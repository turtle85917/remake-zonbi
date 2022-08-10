import { ButtonInteraction, CacheType } from "discord.js";
import DiscordBot from "../../../structures/DiscordBot";

import Run from "../../../structures/Run";

import { database } from "../../../utils/Database";
import { errorEmbed, findItem, getItem, logGetItem, newItem } from "../../../utils/Utility";

import { Account } from "../../../data/interfaces/data/account";
import { Data, inventoryItem } from "../../../data/interfaces/data/user";
import { itemInterpret } from "../../../data/interfaces/static/item";

import { getKeypadPresetComponents } from "../../../data/components/KeypadPreset";
import { getAnswerPresetComponents } from "../../../data/components/AnswerPreset";

import { getItemInfo } from "../select-menus/inventory";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
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

        let UUID = use.inventory.UUID;
        let inventory_item = inventory.find(d => d.UUID === UUID);

        if (!inventory_item) {
            interaction.reply({ embeds: errorEmbed("![command.inventory.error-notfound]".format()), ephemeral: true });
            return;
        }

        let itemInfo = await findItem(inventory_item.staticId);

        if (Id.get("action") === "fix") {
            return;
        }

        if (Id.get("action") === "dump") {
            if (!itemInfo.data.deletable) {
                interaction.reply({ embeds: errorEmbed("![command.inventory.action.error-dump".format()), ephemeral: true });
                return;
            }

            let components: any[] = getKeypadPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`);
            components.push(getAnswerPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, true));

            use.inventory.actionType = "dump";
            use.count = 0;
            
            interaction.update({ components, embeds: [
                {
                    title: "![command.inventory.action.dump.t]".format(),
                    description: "![command.inventory.action.dump.how-dump]".format({ quantity: use.count || "몇" }),
                }
            ] })
        }

        if (Id.get("action") === "yes") {
            let feather = data[0]["feather"], gem = data[0]["gem"];

            if (use.inventory.actionType === "dump") {
                if (inventory_item.quantity < use.count) use.count = inventory_item.quantity;
                inventory_item.quantity -= use.count;
            }
            if (use.inventory.actionType.startsWith("coupon")) {
                let quantity = use.inventory.actionType.split("-")[1];
                if (inventory_item.quantity < (use.count * Number(quantity))) {
                    use.count = Math.floor(inventory_item.quantity / Number(quantity));
                }

                let needItem = Object.entries(inventory_item.options.coupon).find(([k, _]) => k === quantity);
                let trades = Object.entries(needItem[1]);

                inventory_item.quantity -= use.count * Number(quantity);

                for (const trade of trades) {
                    let tradeItem = await findItem(trade[0]);

                    let get: number = trade[1] * use.count;

                    if (tradeItem.data.category === "resource") {
                        if (tradeItem.staticId === "gem") gem = String(Number(gem) + get);
                        if (tradeItem.staticId === "feather") feather = String(Number(feather) + get);
                    } else {
                        newItem(inventory, tradeItem.staticId, get);
                    }
                }
            }

            inventory = inventory.filter(d => d.quantity); // 아이템 갯수가 0개인 항목 제거

            if (inventory_item.quantity) getItemInfo(interaction, inventory_item, "update");
            else interaction.update({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);

            client.commands.get(Id.get("command-name")).run(client, undefined, [], interaction);

            use.interactions.main = interaction;

            await database("data").update({ inventory: JSON.stringify(inventory, null, 4), feather, gem }).where({ userId: interaction.user.id, guildId: interaction.guildId });
        }
    }

    async keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
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

        let UUID = use.inventory.UUID;
        let inventory_item = inventory.find(d => d.UUID === UUID);

        if (inventory_item.quantity < use.count) {
            use.count = inventory_item.quantity;
        }

        if (use.inventory.actionType.startsWith("dump")) {
            let components: any[] = getKeypadPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`);
            components.push(getAnswerPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, inventory_item.quantity - use.count < 0 || use.count < 1));

            interaction.update({
                embeds: [
                    {
                        title: "![command.inventory.action.dump.t]".format(),
                        description: "![command.inventory.action.dump.how-dump]".format({ quantity: String(use.count) }),
                        fields: [
                            {
                                name: "\u200b",
                                value: await logGetItem([
                                    { staticId: inventory_item.staticId, quantity: use.count * -1, after: inventory_item.quantity - use.count }
                                ])
                            }
                        ]
                    }
                ],
                components
            });
        } else if (use.inventory.actionType.startsWith("coupon")) {
            let quantity = use.inventory.actionType.split("-")[1];

            if (inventory_item.quantity < (use.count * Number(quantity))) {
                use.count = Math.floor(inventory_item.quantity / Number(quantity));
            }

            let needItem = Object.entries(inventory_item.options.coupon).find(([k, _]) => k === quantity);
            let trades = Object.entries(needItem[1]);

            let itemInfo = await findItem(inventory_item.staticId);
            if (!inventory_item.options.coupon) {
                interaction.reply({ embeds: errorEmbed("![command.inventory.action.error-coupon".format()), ephemeral: true });
                return;
            }

            let log: { staticId: string; quantity: number; after: number; }[] = [
                { staticId: inventory_item.staticId, quantity: (use.count * Number(quantity)) * -1, after: inventory_item.quantity - (use.count * Number(quantity)) }
            ];

            let tradeItems: itemInterpret[] = [];
            for (const trade of trades) {
                let tradeItem = await findItem(trade[0]);

                tradeItems.push(tradeItem);

                let trade_inventory = getItem(inventory, trade[0]);

                let trade_quantity: number = 0;
                if (tradeItem.data.category === "resource") {
                    if (tradeItem.staticId === "gem") trade_quantity = Number(data[0]["gem"]);
                    if (tradeItem.staticId === "feather") trade_quantity = Number(data[0]["feather"]);
                } else {
                    if (trade_quantity) trade_quantity = trade_inventory.quantity;
                    else trade_quantity = 0;
                }

                let get: number = trade[1] * use.count;

                log.push({ staticId: tradeItem.staticId, quantity: get, after: trade_quantity + get  });
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
            components.push(getAnswerPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, inventory_item.quantity - (use.count * Number(quantity)) < 0 || (use.count * Number(quantity)) < 1));

            interaction.update({
                embeds: [
                    {
                        title: "![command.inventory.action.coupon.t]".format(),
                        description: "![command.inventory.action.coupon.how-coupon]".format({ quantity: String((use.count * Number(quantity))) }),
                        fields: [
                            {
                                name: "\u200b",
                                value: await logGetItem(log)
                            }
                        ]
                    }
                ],
                components
            });
        }
    }
}