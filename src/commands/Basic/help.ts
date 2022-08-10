import { Colors, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { prefix } from "../../data/settings.json";
import fs from "fs";

import { sort } from "../../utils/Utility";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "help";
        this.aliases = ["도움말", "도움"];
        this.description = "봇의 명령어를 확인해요.";
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        message.reply({
            embeds: [
                {
                    title: "![command.help.t]".format(),
                    description: "![command.help.d]".format(),
                    fields: fs.readdirSync(`${process.cwd()}/src/commands`).filter(c => c !== "Owner").map(cat => {
                        let commands = fs.readdirSync(`${process.cwd()}/src/commands/${cat}`).filter(d => d.endsWith(".ts"));

                        return {
                            name: `__![term.categories.${cat.toLowerCase()}]__`.format(),
                            value: commands.map(cmd => {
                                let command = client.commands.get(cmd.slice(0, -3).trim());

                                return `\`${prefix} ${sort(command.name, 3)}:\` ${command.description}`
                            }).join("\n")
                        };
                    }),
                    color: Colors.Blurple
                }
            ]
        })
    }
}