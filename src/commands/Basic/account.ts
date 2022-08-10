import { APIEmbed } from "discord-api-types/v10";
import { Colors, Message } from "discord.js";

import { getAnswerPresetComponents } from "../../data/components/AnswerPreset";

import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";

import { errorEmbed } from "../../utils/Utility";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "account";
        this.aliases = ["계정"];
        this.description = "계정을 만들거나 연동해봐요.";
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        if (message) {
            if (!client.temporaries.find(d => d.token === message.author.id && d.commandName === this.name)) {
                client.temporaries.push({ token: message.author.id, commandName: this.name, messages: { main: undefined }, lastUse: message.guildId });
            }
        }

        let use = client.temporaries.find(d => d.token === message.author.id && d.commandName === this.name);

        let accountFind = await database("account").where({ userId: message.author.id });

        if (accountFind.length) {
            if (JSON.parse(accountFind[0].verify)[message.guildId]) {
                message.reply({ embeds: errorEmbed("![error.already_verify]".format()) });
                return;
            }

            let m = await message.reply({
                embeds: [
                    {
                        description: "![command.account.link]".format(),
                        color: Colors.Aqua
                    }
                ],
                components: [
                    getAnswerPresetComponents(`${message.guildId}@${message.author.id}@${this.name}#{action}`)
                ]
            });

            use.messages.main?.delete().catch(() => undefined);
            use.messages.main = m;

            use.lastUse = message.guildId;
            return;
        }

        let m = await message.reply({
            embeds: [
                {
                    title: "![command.account.t]".format(),
                    description: `![command.account.description]`.format(),
                    color: Colors.Blue
                }
            ].map((_, __, embeds) => {
                // prev server
                if (use.lastUse !== message.guildId)
                    (embeds as APIEmbed[]).unshift({
                        description: "![command.account.prev-server.d]".format()
                    });

                return embeds as APIEmbed;
            }).flat(Infinity),
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, style: 2, customId: `${message.guildId}@${message.author.id}@${this.name}#input`, label: "![term.action.progress]".format() }
                    ]
                }
            ]
        });

        use.messages.main?.delete().catch(() => undefined);
        use.messages.main = m;

        use.lastUse = message.guildId;
    }
}