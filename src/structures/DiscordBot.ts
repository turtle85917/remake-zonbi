import { APIEmbed, ButtonInteraction, CacheType, Client, Collection, IntentsBitField, Message, Partials, SelectMenuInteraction } from "discord.js";
import PrefixCommand from "./Prefix";

import { content, Logger, LOGLEVEL } from "../utils/Logger";

import fs from "fs";

export interface temporary {
    token: string;
    commandName: string;
    messages: {
        [other: string]: Message<boolean>
        "dm"?: Message<boolean>
        "main": Message<boolean>
    };
    interactions?: {
        "main": ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>
    };
    lastUse?: string;

    count?: number;

    profile?: { target: string; };
    page?: { c: number; m: number; list?: APIEmbed[]; components?: any[]; };
    inventory?: { UUID: number; actionType: string; };
};

export default class DiscordBot extends Client {
    readonly commands: Collection<string, PrefixCommand>;
    readonly aliases: Collection<string, string>;

    readonly temporaries: temporary[];

    constructor() {
        super({
            intents: [
                new IntentsBitField(32767), "MessageContent"
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User
            ]
        });

        this.commands = new Collection<string, PrefixCommand>();
        this.aliases = new Collection<string, string>();

        this.temporaries = [];
    }

    prefixLoad() {
        fs.readdirSync(`${process.cwd()}/src/commands`).map(dir => {
            fs.readdirSync(`${process.cwd()}/src/commands/${dir}`).filter(f => f.endsWith(".ts")).map(file => {
                let cmdFile: PrefixCommand = new (require(`${process.cwd()}/src/commands/${dir}/${file}`).default)();

                this.commands.set(cmdFile.name, cmdFile);
                cmdFile.aliases.forEach(ali => this.aliases.set(ali, cmdFile.name));

                this.logger("SUCCESS", [
                    { content: cmdFile.name, style: [32] },
                    { content: "is", style: [] },
                    { content: "Load", style: [1, 4] }
                ]);
            })
        })
    }

    prefixReload() {
        this.commands.sweep(() => true);
        this.aliases.sweep(() => true);

        fs.readdirSync(`${process.cwd()}/src/commands`).map(dir => {
            fs.readdirSync(`${process.cwd()}/src/commands/${dir}`).filter(f => f.endsWith(".ts")).map(file => {
                delete require.cache[require.resolve(`${process.cwd()}/src/commands/${dir}/${file}`)];
                let cmdFile: PrefixCommand = new (require(`${process.cwd()}/src/commands/${dir}/${file}`).default)();

                this.commands.set(cmdFile.name, cmdFile);
                cmdFile.aliases.forEach(ali => this.aliases.set(ali, cmdFile.name));
                
                this.logger("SUCCESS", [
                    { content: cmdFile.name, style: [32] },
                    { content: "is", style: [] },
                    { content: "Reload", style: [1, 4] }
                ]);
            })
        })
    }

    logger(type: "NORMAL" | "INFO" | "SUCCESS" | "WARING" | "ERROR", contents: content[]): void {
        let level: number = LOGLEVEL[type];
        new Logger(level, contents);
    }
}