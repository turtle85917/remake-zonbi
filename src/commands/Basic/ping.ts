import { Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "ping";
        this.aliases = ["핑"];
        this.description = "응답 처리 시간을 구해요.";
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        let m = await message.reply("![command.ping.checking]".format());
        if (!m.deletable) {
            message.reply("![command.ping.error]".format());
            return;
        }

        m.edit("![command.ping.success]".format({
            ping: m.createdTimestamp - message.createdTimestamp
        }))
    }
}