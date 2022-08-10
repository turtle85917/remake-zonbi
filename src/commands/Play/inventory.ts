import { ButtonInteraction, CacheType, Colors, Message, SelectMenuInteraction } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";

import { errorEmbed, findItem, getBar, getWeight, getWeightUnit } from "../../utils/Utility";

import { Account } from "../../data/interfaces/data/account";
import { Data, inventoryItem } from "../../data/interfaces/data/user";
import { Storage } from "../../data/interfaces/data/storage";

import { getPagePresetComponents } from "../../data/components/PagePreset";
import { getStoragePresetComponents } from "../../data/components/StoragePreset";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "inventory";
        this.aliases = ["인벤토리", "가방", "items"];
        this.description = "보유 중인 아이템을 확인해요.";
    }

    async run(client: DiscordBot, message: Message, args: string[], interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>) {
        let userId = interaction ? interaction.user.id : message.author.id;
        let channelId = interaction ? interaction.channelId : message.channelId;
        let guildId = interaction ? interaction.guildId : message.guildId;

        let token = channelId + userId;

        if (message) {
            if (!client.temporaries.find(d => d.token === token && d.commandName === this.name)) {
                client.temporaries.push({ token, commandName: this.name, messages: { main: undefined }, interactions: { main: undefined }, page: { c: 0, m: 0, components: [] }, inventory: { UUID: undefined, actionType: "" }, count: 0 });
            }
        }

        let use = client.temporaries.find(d => d.token === token && d.commandName === this.name);

        let reply = (options: any, behind: boolean = true) => {
            if (interaction) {
                options["ephemeral"] = behind;
                interaction.reply(options);
            } else {
                message.reply(options);
            }
        };

        if (message) use.page.c = 0;
        use.page.components = [];

        let account: Account[] = await database("account").where({ userId });
        if (!account.length) {
            reply({ embeds: errorEmbed("![error.account_notfound]".format()) });
            return;
        }

        if (!JSON.parse(account[0].verify)[guildId]) {
            reply({ embeds: errorEmbed("![error.first_verify]".format()) });
            return;
        }

        let data: Data[] = await database("data").where({ userId, guildId });
        let inventory: inventoryItem[] = JSON.parse(data[0].inventory);

        let storage: Storage[] = await database("storage").where({ userId, guildId });

        let feather = await findItem("feather");
        let gem = await findItem("gem");

        let components: any[] = [];

        if (inventory.length) {
            use.page.components.push([]);
        }

        for(let idx = 0; idx < Math.ceil(inventory.length / 25); idx++) {
            use.page.components[0].push({
                type: 1,
                components: [
                    {
                        type: 3,
                        customId: `${guildId}@${userId}@${this.name}#inventory`,
                        options: []
                    }
                ]
            })
            for (const item of inventory.slice(idx * 25, (idx + 1) * 25)) {
                let item_ = await findItem(item.staticId);

                use.page.components[0][idx].components[0].options.push({
                    label: item_.data.name,
                    description: `${item.quantity}개 보유 중 ｜ ${getWeightUnit(item_.data.weight * item.quantity)}`,
                    emoji: { name: item_.data.icon },
                    value: String(item.UUID)
                })
            }
        }
        
        use.page.m = Math.ceil(inventory.length / 25);
        if (use.page.c > use.page.m - 1 && inventory.length) use.page.c = 0;

        if (inventory.length) components.push(use.page.components[0][use.page.c]);

        use.page.components.push(getStoragePresetComponents(`${guildId}@${userId}@${this.name}#{action}`));
        components.push(use.page.components.length === 2 ? use.page.components[1] : use.page.components[0]);

        components.push(getPagePresetComponents(`${guildId}@${userId}@${this.name}#{action}`, `${use.page.c + 1} / ${use.page.m || 1}`))
        
        if (use.page.c === 0) components[components.length - 1].components[0].disabled = true;
        if (use.page.c === use.page.m - 1 || !use.page.m) components[components.length - 1].components[2].disabled = true;

        use.page.list = [];
        use.page.list.push({
            title: "![command.inventory.t]".format({ name: account[0].name }),
            description: ((inventory.length ? "![command.inventory.d-found]" : "![command.inventory.d-empty]") + "\n![command.inventory.d-health]").format({ healthBar: getBar(Number(storage[0].health) * 100, 100, true, 10, "🟩") }),
            fields: [
                { name: `${feather.data.icon} ${feather.data.name}`, value: `\`${data[0].feather}\``, inline: true },
                { name: `${gem.data.icon} ${gem.data.name}`, value: `\`${data[0].gem}\``, inline: true }
            ],
            footer: {
                text: "![command.inventory.backpack-weight]".format({ weight: { current: getWeightUnit(Number(await getWeight(inventory))), maximum: getWeightUnit(Number(data[0].maxWeight)) } })
            },
            color: Colors.Blurple
        });

        if (message) {
            let m = await message.reply({
                embeds: [use.page.list[0]],
                components
            });

            use.messages.main?.delete()?.catch(() => undefined);
            use.messages.main = m;

            use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);
            use.interactions.main = undefined;
        } else {
            interaction.update({
                embeds: [use.page.list[0]],
                components
            })
            .then(() => {
                use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);
                use.interactions.main = undefined;
            })
            .catch(() => {
                use.messages.main.edit({
                    embeds: [use.page.list[0]],
                    components
                });
            });
        }
    }
}