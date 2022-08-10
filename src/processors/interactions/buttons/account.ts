import { AttachmentBuilder, ButtonInteraction, CacheType, Colors } from "discord.js";
import DiscordBot from "../../../structures/DiscordBot";

import Run from "../../../structures/Run";

import { database } from "../../../utils/Database";
import { ko } from "../../../utils/Language";

import { errorEmbed } from "../../../utils/Utility";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        if (Id.get("action") === "yes") {
            let account = await database("account").where({ userId: interaction.user.id });
            if (!account.length) {
                interaction.reply({ embeds: errorEmbed("![error.account_notfound]".format()), ephemeral: true });
                return;
            }

            let verify = JSON.parse(account[0].verify);
            if (verify[interaction.guildId]) {
                interaction.reply({ embeds: errorEmbed("![command.account.error-already_verify]".format()), ephemeral: true });
                return;
            }

            verify[interaction.guildId] = true;
            await database("data").insert({
                userId: interaction.user.id, guildId: interaction.guildId,

                feather: "0", gem: "0", maxWeight: "1200",

                level: "1", mileage: "0",

                health: "1",
                maxHealth: "100",
                healthSpeed: "1",

                thirst: "0",
                satiety: "0.8",

                effects: "[]",
                inventory: "[]",

                attends: JSON.stringify({
                    "attend-times": [],
                    "count": 0,
                    "combo": 0
                }, null, 4),

                travelData: JSON.stringify({
                    "map": "",
                    "direction": "c_",
                    "position": []
                }, null, 4),

                createdAt: Math.floor(Date.now() / 1000)
            });
            await database("extra-data").insert({
                userId: interaction.user.id, guildId: interaction.guildId,
                data: JSON.stringify({})
            });
            await database("storage").insert({
                userId: interaction.user.id, guildId: interaction.guildId,
                health: "1", level: "1", status: "fine"
            });

            await database("account").update({ verify: JSON.stringify(verify, null, 4) }).where({ userId: interaction.user.id });

            interaction.update({ components: [], embeds: [
                {
                    description: "![command.account.success_verify]".format({ name: account[0].name }),
                    color: Colors.Blue
                }
            ], files: [], content: undefined });
        }
        if (Id.get("action") === "input") {
            interaction.showModal({
                customId: `${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#level-1`,
                title: "![command.account.t]".format(),
                components: [
                    {
                        type: 1,
                        components: [
                            { type: 4, customId: "name", label: "![command.account.modal-textinput.name.l]".format(), placeholder: "![command.account.modal-textinput.name.p]".format(), style: 1, minLength: 2, maxLength: 15 }
                        ]
                    }
                ]
            })
        }
    }

    async keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {}
}