import fs from "fs";
import axios from "axios";
import sharp from "sharp";

import { AttachmentBuilder, Colors, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";
import { errorEmbed, getFileUUID } from "../../utils/Utility";

import { Account } from "../../data/interfaces/data/account";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "setting";
        this.aliases = ["설정", "set"];
        this.description = "유저의 환경 변수를 설정해요.";

        this.options = [
            { name: "key", description: "환경 변수 경로", required: true, choices: [ "profile-image" ] },
            { name: "val", description: "환경 변수 값", required: false }
        ]
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        let key = args[0],
            val = args[1];

        if (key === "profile-image") {
            let account: Account[] = await database("account").where({ userId: message.author.id });
            if (!account.length) {
                message.reply({ embeds: errorEmbed("![error.account_notfound]".format()) });
                return;
            }

            if (!JSON.parse(account[0].verify)[message.guildId]) {
                message.reply({ embeds: errorEmbed("![error.first_verify]".format()) });
                return;
            }

            if (!message.attachments.size) {
                message.reply({ embeds: errorEmbed("![command.setting.error-no-attachments]".format()) });
                return;
            }

            let firstFile = message.attachments.first();
            if (!["png", "jpg", "jpeg"].includes(firstFile.contentType.replace("image/", ""))) {
                message.reply({ embeds: errorEmbed("![command.setting.error-no-correct-contentType]".format()) });
                return;
            }

            let sizeKB = firstFile.size / 1024;
            let sizeMB = sizeKB / 1024;

            if (Math.ceil(sizeMB) > 2) {
                message.reply({ embeds: errorEmbed("![command.setting.erorr-file-so-big]".format()) });
                return;
            }

            let filePath = `${process.cwd()}/src/data/images/{UUID}.png`;
            fs.unlinkSync(filePath.format({ UUID: account[0].profile }));

            let url = firstFile.url;

            let avatarUUID = getFileUUID(filePath);

            let response = await axios.get(url, { responseType: "arraybuffer" })
            let buffer = Buffer.from(response.data, "base64");

            let fileBuffer = await sharp(buffer).toBuffer();

            fs.writeFileSync(filePath.format({ UUID: avatarUUID }), fileBuffer);
            await database("account").update({ profile: avatarUUID }).where({ userId: message.author.id });

            message.reply({
                embeds: [
                    {
                        title: "![command.setting.t]".format(),
                        description: "![command.setting.profile-image-change]".format(),
                        thumbnail: { url: "attachment://new-profile.png" },
                        color: Colors.Blue
                    }
                ],
                files: [
                    new AttachmentBuilder(fileBuffer, { name: "new-profile.png" })
                ]
            });
        }
    }
}