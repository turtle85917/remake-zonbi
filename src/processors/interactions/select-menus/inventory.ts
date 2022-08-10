import { SelectMenuInteraction, CacheType, ButtonInteraction } from "discord.js";
import DiscordBot from "../../../structures/DiscordBot";

import Run from "../../../structures/Run";

import { database } from "../../../utils/Database";

import { errorEmbed, findItem, getWeightUnit } from "../../../utils/Utility";

import { Account } from "../../../data/interfaces/data/account";
import { Data, inventoryItem } from "../../../data/interfaces/data/user";
import { itemInterpret } from "../../../data/interfaces/static/item";

import { getItemControlPresetComponents } from "../../../data/components/ItemControlPreset";
import { getAnswerPresetComponents } from "../../../data/components/AnswerPreset";
import { getKeypadPresetComponents } from "../../../data/components/KeypadPreset";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: SelectMenuInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        let token = interaction.channelId + interaction.user.id;
        let use = client.temporaries.find(d => d.token === token && d.commandName === Id.get("command-name"));

        let account: Account[] = await database("account").where({ userId: interaction.user.id });
        if (!account.length) {
            interaction.reply({ embeds: errorEmbed("![error.account_notfound]".format()), ephemeral: true });
            return;
        }

        if (!JSON.parse(account[0].verify)[interaction.guildId]) {
            interaction.reply({ embeds: errorEmbed("![error.first_verify]".format()), ephemeral: true });
            return;
        }

        let data: Data[] = await database("data").where({ userId: interaction.user.id, guildId: interaction.guildId });
        let inventory: inventoryItem[] = JSON.parse(data[0].inventory);

        let UUID: number = isNaN(Number(interaction.values[0])) ? use.inventory.UUID : Number(interaction.values[0]);
        let inventory_item = inventory.find(d => d.UUID === Number(UUID));

        if (!inventory_item) {
            interaction.reply({ embeds: errorEmbed("![command.inventory.error-notfound]".format()), ephemeral: true });
            return;
        }

        if (Id.get("action") === "coupon") {
            let quantity = interaction.values[0].slice(1);

            let needItem = Object.entries(inventory_item.options.coupon).find(([k, _]) => k === quantity);
            let trades = Object.entries(needItem[1]);

            let itemInfo = await findItem(inventory_item.staticId);
            if (!inventory_item.options.coupon) {
                interaction.reply({ embeds: errorEmbed("![command.inventory.action.error-coupon".format()), ephemeral: true });
                return;
            }

            let tradeItems: itemInterpret[] = [];
            for (const trade of trades) {
                tradeItems.push(await findItem(trade[0]));
            }

            if (Number(needItem[0]) > inventory_item.quantity) {
                interaction.reply({ embeds: errorEmbed("![error.need-item]".format({
                    item: {
                        icon: itemInfo.data.icon,
                        name: itemInfo.data.name,
                        quantity: Number(needItem[0]) - inventory_item.quantity
                    }
                })), ephemeral: true });
                return;
            }

            let components: any[] = getKeypadPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`);
            components.push(getAnswerPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, true));

            use.inventory.actionType = "coupon-"+quantity;
            use.count = 0;
            
            interaction.update({ components, embeds: [
                {
                    title: "![command.inventory.action.coupon.t]".format(),
                    description: "![command.inventory.action.coupon.how-coupon]".format({
                        quantity: use.count || "몇"
                    }),
                }
            ] });
            return;
        }

        use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);

        use.inventory.UUID = Number(UUID);
        getItemInfo(interaction, inventory_item, "reply");

        use.interactions.main = interaction;
    }

    async keypad(client: DiscordBot, interaction: SelectMenuInteraction<CacheType>): Promise<void> {}
}

export async function getItemInfo(interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>, inventory_item: inventoryItem, type: "update" | "reply") {
    let Id = interaction.customId;
    let itemInfo = await findItem(inventory_item.staticId);
    let embeds = [
        {
            title: `${itemInfo.data.icon} ${itemInfo.data.name}`,
            description: itemInfo.data.description,
            fields: [
                {
                    name: "![command.inventory.info-field.0]".format(),
                    value: `${getWeightUnit(inventory_item.quantity * itemInfo.data.weight)} / ${inventory_item.quantity}개 보유 중`
                }
            ]
        }
    ];
    
    if (type === "update") {
        interaction.update({
            components: await getItemControlPresetComponents(itemInfo.staticId, `${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`),
            embeds
        });
    } else {
        interaction.reply({
            components: await getItemControlPresetComponents(itemInfo.staticId, `${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`),
            embeds, ephemeral: true, fetchReply: true
        })
    }
}