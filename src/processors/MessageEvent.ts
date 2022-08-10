import { Colors, Message } from "discord.js";
import DiscordBot from "../structures/DiscordBot";

import { prefix, dev } from "../data/settings.json";

import { errorEmbed, getArgs } from "../utils/Utility";

export async function processMessageEvent(client: DiscordBot, message: Message<boolean>): Promise<void> {
    if (message.author.bot || message.system || !message.content.startsWith(prefix)) return;

    try {
        let argString: string = message.content.slice(prefix.length).trim();

        let cmd: string = argString.split(/ +/g).shift();
        let args: string[] = getArgs(argString.split(/ +/g).slice(1).join(" "));

        if (message.channel.type === 1) {
            message.reply({
                embeds: errorEmbed("![error.dm]".format())
            });
            return;
        }

        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) {
            return;
        }

        if (command.dev && message.author.id !== dev.userId) return;

        let pass = true;
        if (command.options) {
            for (let idx = 0; idx < command.options.length; idx++) {
                let option = command.options[idx]
                if (!args[idx]?.trim() && option.required) pass = false;
                else if (option.required && option.choices && !option.choices.includes(args[idx]?.trim())) pass = false;
            }
        }

        if (!pass) {
            message.reply({ embeds: errorEmbed("![error.usage]".format({
                command: {
                    line: prefix + " **" + command.name + "** " + command.options.map(d => (d.required ? "[`{name}`]" : "(`{name}`)").format({ name: d.name })).join(" "),
                    options: command.options.map(d =>
                        "> " + (d.required ? "[`{name}`]" : "(`{name}`)").format({ name: d.name })
                        + " : " + d.description + " "
                        + (d.choices ? "(" + d.choices.map(d => "`" + d + "`").join(", ") + " 중 하나)" : "")
                    ).join("\n") || undefined
                }
            })) });
            return;
        }

        command.run(client, message, args);
    } catch (e) {
        message.reply({ embeds: errorEmbed("![error.unhandeld-error]".format()) });
        if (message.channel.type === 0) {
            client.users.cache.get(dev.userId).send({
                embeds: [
                    {
                        title: "![error.log-message.t]".format(),
                        description: "![error.log-message.d]".format({
                            guild: { name: message.guild.name, id: message.guildId },
                            channel: { name: message.channel.name, id: message.channel.id },
                            message: { content: message.cleanContent },
                            error: e
                        }),
                        color: Colors.Red
                    }
                ]
            });
        }
    }
}