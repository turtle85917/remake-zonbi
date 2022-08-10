import "dotenv/config";
import DiscordBot from "./structures/DiscordBot";

import { ko } from "./utils/Language";

import { createTable, hasTable } from './utils/Database';

import { processMessageEvent } from "./processors/MessageEvent";

import Run from "./structures/Run";

import { errorEmbed } from "./utils/Utility";
import { CacheType, SelectMenuInteraction } from "discord.js";

declare global {
    interface String {
        format(...args): string;
        bind(): string;
        get(path: "guild-id"|"channel-id"|"user-id"|"command-name"|"action"): string;
        printMarkdown(): string;
    }
}

String.prototype.format = function (this: string, ...args) {
    let cnt: number = 0;
    let res = this;

    res = res.bind();
    return res.bind().replace(/{(.*?)}/g, (matched: string, p1: string) => {
        let rt: string = args[cnt];
        let first = p1.split(".")[0];

        if (rt === undefined) {
            rt = args.find(d => d && d[first]);
        }
        if (typeof rt === "number") rt = String(rt)

        if (typeof rt === "object" && !Array.isArray(rt)) {
            let re = args[cnt];
            if (re === undefined) {
                re = args.find(d => d && d[first]);
            }
            for (let pd of p1.split(".")) {
                if (re[pd]) re = re[pd];
            }

            rt = re;
        }

        if (rt === undefined) rt = matched;
        if (typeof rt === "object") rt = matched;

        cnt++;
        return String(rt).bind() || matched;
    });
};

String.prototype.bind = function (this: string) {
    let res = this;
    let lang = this.match(/!\[(.*?)\]/g);

    lang?.map(d => {
        let l = d.slice(2, d.length - 1);

        let result = ko;
        for (let ld of l.split(".")) {
            if (result[ld]) result = result[ld];
        }

        if (typeof result === "string") res = res.replace(d, result);
    });

    return res;
}

String.prototype.get = function (this: string, path: "guild-id"|"channel-id"|"user-id"|"command-name"|"action") {
    switch (path) {
        case "guild-id": 
        case "channel-id":
            return this.split("@")[0];
        case "user-id":
            return this.split("@")[1];
        case "command-name":
            return this.split("@")[2].split('#')[0];
        case "action":
            return this.split("@")[2].split('#')[1];
    }
}

String.prototype.printMarkdown = function (this: string) {
    let markdown = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    let result: string = '';

    this.split("").map(d => {
        if (d.match(markdown)) result += `\\${d}`;
        else result += d;
    });

    return result;
}

let client = new DiscordBot();

async function Main(): Promise<void> {
    client.once("ready", async () => {
        client.logger("SUCCESS", [
            { content: "Discord", style: [32] },
            { content: ":", style: [] },
            { content: client.user.tag, style: [1, 4] }
        ]);
        client.prefixLoad();

        let hasAccount = await hasTable("account");
        let hasData = await hasTable("data");


        if (!hasAccount) {
            await createTable("account", (t) => {
                t.string("userId");
                t.string("name");

                t.string("verify");

                t.bigInteger("createdAt");
            })
        }
        if (!hasData) {
            await createTable("data", (t) => {
                t.string("guildId");
                t.string("userId");

                t.string("health");
                t.string("maxHealth");
                t.string("healthSpeed");

                t.string("thirst");

                t.string("satiety");

                t.string("effects");

                t.string("feather");
                t.string("gem");

                t.string("maxWeight");

                t.string("attends");

                t.string("inventory");
            })
        }
        
        client.on("messageCreate", async (message) => processMessageEvent(client, message));
        client.on("interactionCreate", async (interaction) => {
            if (interaction.type === 3) {
                let Id = interaction.customId;
                if (Id.get("user-id") !== interaction.user.id) {
                    interaction.reply({ ephemeral: true, embeds: errorEmbed("![error.user-control]".format()) });
                    return;
                }

                let use = client.temporaries.find(d => d.token === interaction.user.id && d.commandName === Id.get("command-name"));
                if (!use) use = client.temporaries.find(d => d.token === `${interaction.channelId}${interaction.user.id}` && d.commandName === Id.get("command-name"));
                if (!use) {
                    interaction.reply({ embeds: errorEmbed("![error.bot_is_rebooting]".format()), ephemeral: true });
                    await interaction.message.delete().catch(() => undefined);
                    return;
                }

                if (["left", "refrash", "right"].some(d => Id.get("action").includes(d))) {
                    let file: Run = new (require("./processors/interactions/PageCommand.ts").default)();
                    file.run(client, interaction);
                    return;
                }

                if (!isNaN(Number(Id.get("action")))) {
                    let file: Run = new (require("./processors/interactions/KeypadCommand.ts").default)();
                    file.run(client, interaction);
                    return;
                }

                if (Id.get("action").includes("no")) {
                    interaction.update({ embeds: [], components: [], files: [], content: "![error.expire]".format() });
                    return;
                }

                if (interaction instanceof SelectMenuInteraction<CacheType>) {
                    let file: Run = new (require(`./processors/interactions/select-menus/${Id.get("command-name")}.ts`).default)();
                    file.run(client, interaction);
                    return;
                }

                let file: Run = new (require(`./processors/interactions/buttons/${Id.get("command-name")}.ts`).default)();
                file.run(client, interaction);
            }
            if (interaction.type === 5) {
                let Id = interaction.customId;
                if (Id.get("user-id") !== interaction.user.id) {
                    interaction.reply({ ephemeral: true, embeds: errorEmbed("![error.expire]".format()) });
                    return;
                }

                let use = client.temporaries.find(d => d.token === interaction.user.id && d.commandName === Id.get("command-name"));
                if (!use) use = client.temporaries.find(d => d.token === `${interaction.channelId}${interaction.user.id}` && d.commandName === Id.get("command-name"));
                if (!use) {
                    interaction.reply({ embeds: errorEmbed("![error.bot_is_rebooting]".format()), ephemeral: true });
                    return;
                }

                let file: Run = new (require(`./processors/interactions/modals/${Id.get("command-name")}.ts`).default)();
                file.run(client, interaction);
            }
        })

        client.user.setActivity(`${client.guilds.cache.size.toLocaleString()}개의 서버에서 🧟‍♀️가 서식 중..`);
    });
    await client.login(process.env.TOKEN);
};

Main();
process.on("uncaughtException", e => {
    client.logger("ERROR", [
        { content: "Unhandled Exception", style: [4] },
        { content: ":", style: [] },
        { content: e.stack, style: [1, 31] }
    ]);
});
process.on("unhandledRejection", e => {
    client.logger("ERROR", [
        { content: "Unhandled Rejection", style: [4] },
        { content: ":", style: [] },
        { content: e instanceof Error ? e.stack : e as string, style: [1, 31] }
    ]);
});