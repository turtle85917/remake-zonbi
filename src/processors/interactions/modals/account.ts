import { CacheType, ModalSubmitInteraction } from "discord.js";
import DiscordBot from "../../../structures/DiscordBot";

import Run from "../../../structures/Run";

import { errorEmbed, getFileUUID } from "../../../utils/Utility";

import { database } from "../../../utils/Database";

import fs from "fs";
import axios from "axios";
import sharp from "sharp";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        if (Id.get("action") === "level-1") {
            let use = client.temporaries.find(d => d.token === interaction.user.id && d.commandName === Id.get("command-name"));

            let name = interaction.fields.getTextInputValue("name").trim();
            if (name.length < 2) {
                interaction.reply({ ephemeral: true, embeds: errorEmbed("![error.length.less-than]".format({ length: 1 })) });
                return;
            }
            if (name.length > 15) {
                interaction.reply({ ephemeral: true, embeds: errorEmbed("![error.length.larger-than]".format({ length: 16 })) });
                return;
            }

            let nameRegex = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
            if (nameRegex.test(name)) {
                interaction.reply({ ephemeral: true, embeds: errorEmbed("![command.account.error-name]".format()) });
                return;
            }

            let accountFind = await database("account").where({ userId: interaction.user.id });
            let dataFind = await database("data").where({ userId: interaction.user.id, guildId: interaction.guildId });
            let overlapFind = await database("account").where({ name });

            if (overlapFind.length) {
                interaction.reply({ ephemeral: true, embeds: errorEmbed("![command.account.error-overlap-name]".format()) });
                return;
            }
            if (accountFind.length || dataFind.length) {
                interaction.reply({ ephemeral: true, embeds: errorEmbed("![command.account.error-account]".format()) });
                return;
            }

            let url = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png?size=1024`;
            let filePath = `${process.cwd()}/src/data/images/{UUID}.png`;

            let avatarUUID = getFileUUID(filePath);

            let response = await axios.get(url, { responseType: "arraybuffer" })
            let buffer = Buffer.from(response.data, "base64");

            let fileBuffer = await sharp(buffer).toBuffer();

            fs.writeFileSync(filePath.format({ UUID: avatarUUID }), fileBuffer);

            interaction.reply({
                content: interaction.user.toString(),
                embeds: [
                    { description: "![command.account.success]".format() }
                ]
            });
            await database("account").insert({
                userId: interaction.user.id, name,
                verify: JSON.stringify({ [interaction.guildId]: true }, null, 4),
                profile: String(avatarUUID),
                createdAt: Math.floor(Date.now() / 1000)
            });
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

            use.messages.main.delete();
        }
    }

    async keypad(client: DiscordBot, interaction: ModalSubmitInteraction<CacheType>): Promise<void> {}
}