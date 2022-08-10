import { ButtonInteraction, CacheType } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import Run from "../../structures/Run";

import { getPagePresetComponents } from "../../data/components/PagePreset";

import { errorEmbed  } from "../../utils/Utility";

import { database } from "../../utils/Database";

import { Account } from "../../data/interfaces/data/account";
import { Data, inventoryItem } from "../../data/interfaces/data/user";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        let token = interaction.channelId + interaction.user.id;
        let use = client.temporaries.find(d => d.token === token && d.commandName === Id.get("command-name"));

        if (Id.get("action") === "refrash") {
            await client.commands.get(Id.get("command-name")).run(client, undefined, [], interaction);
            return;
        }

        if (Id.get("action").includes("left")) {
            use.page.c--;
            if (use.page.c < 0) use.page.c = 0;
        }
        if (Id.get("action").includes("right")) {
            use.page.c++;
            if (use.page.c > use.page.m) use.page.c = use.page.m;
        }

        let account: Account[] = await database("account").where({ userId: interaction.user.id });
        if (!account.length) {
            interaction.reply({ embeds: errorEmbed("![error.account_notfound]".format()), ephemeral: true });
            return;
        }

        if (!JSON.parse(account[0].verify)[interaction.guildId]) {
            interaction.reply({ embeds: errorEmbed("![error.first_verify]".format()), ephemeral: true });
            return;
        }

        let data: Data[] = await database("data").where({ userId: interaction.user.id, guildId: interaction.guildId });
        let inventory: inventoryItem[] = JSON.parse(data[0].inventory);

        let newMax = Math.ceil(inventory.length / 25);
        if (newMax !== use.page.m) {
            await client.commands.get(Id.get("command-name")).run(client, undefined, [], interaction);
            return;
        }

        let components = [];

        if (use.page.components[0]) components.push(use.page.components[0][use.page.c] || use.page.components[0]);
        if (use.page.components[1]) components.push(use.page.components[1][use.page.c] || use.page.components[1]);
        if (use.page.components[2]) components.push(use.page.components[2][use.page.c] || use.page.components[2]);
        if (use.page.components[3]) components.push(use.page.components[3][use.page.c] || use.page.components[3]);

        components.push(getPagePresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, `${use.page.c + 1} / ${use.page.m || 1}`));

        if (use.page.c === 0) components[components.length - 1].components[0].disabled = true;
        if (use.page.c === use.page.m - 1 || !use.page.m) components[components.length - 1].components[2].disabled = true;

        components = components.filter(d => d);

        interaction.update({
            embeds: [use.page.list[use.page.c] || use.page.list[0]],
            components
        })
    }

    async keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {}
}