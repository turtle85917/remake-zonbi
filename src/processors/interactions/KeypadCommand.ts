import { ButtonInteraction, CacheType } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import Run from "../../structures/Run";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        let token = interaction.channelId + interaction.user.id;
        let use = client.temporaries.find(d => d.token === token && d.commandName === Id.get("command-name"));

        if (!Id.get("action").includes("-")) {
            use.count = Number(String(use.count) + String(Number(Id.get("action"))));
        } else if (Number(Id.get("action")) === -1) {
            use.count = Number(String(use.count).slice(0, -1));
        } else use.count = 0;

        let file: Run = new (require(`${process.cwd()}/src/processors/interactions/buttons/${Id.get("command-name")}.ts`).default)();
        file.keypad(client, interaction);
    }
    
    async keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {}
}