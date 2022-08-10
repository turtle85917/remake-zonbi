import { Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "reload";
        this.aliases = ["리로드", "ㄹㄹㄷ"];
        this.description = "명령어를 새로고침합니다.";
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        client.prefixReload();
        message.react("✅");
    }
}