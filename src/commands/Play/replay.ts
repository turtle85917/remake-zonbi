import { APIEmbed, ButtonInteraction, CacheType, Colors, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";

import { errorEmbed } from "../../utils/Utility";

import { npcNames, npcScripts, scriptContent } from "../../data/map/scripts";
import { npcs } from "../../data/map/npcs";

import { Account } from "../../data/interfaces/data/account";
import { Data } from "../../data/interfaces/data/user";
import { extraData, extraInterpret } from "../../data/interfaces/data/extraData";

import { getNPCtalkPos } from "../../processors/interactions/buttons/travel/Utility";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "replay";
        this.aliases = ["다시보기", "rp"];
        this.description = "마지막으로 대화한 부분까지 보여줘요.";
    }

    async run(client: DiscordBot, message: Message, args: string[], interaction: ButtonInteraction<CacheType>) {
        let userId = interaction ? interaction.user.id : message.author.id;
        let channelId = interaction ? interaction.channelId : message.channelId;
        let guildId = interaction ? interaction.guildId : message.guildId;

        let token = channelId + userId;

        let reply = (options: any, behind: boolean = true) => {
            if (interaction) {
                options["ephemeral"] = behind;
                interaction.reply(options);
            } else {
                message.reply(options);
            }
        };

        let account: Account[] = await database("account").where({ userId });
        if (!account.length) {
            reply({ embeds: errorEmbed("![error.account_notfound]".format()) });
            return;
        }

        if (!JSON.parse(account[0].verify)[guildId]) {
            reply({ embeds: errorEmbed("![error.first_verify]".format()) });
            return;
        }

        let data: Data[] = await database("data").where({ userId, guildId });
        let extraData: extraData[] = await database("extra-data").where({ userId, guildId });

        let extra: extraInterpret = JSON.parse(extraData[0].data);

        let scriptNames = Object.keys(npcScripts);
        let viewScripts: string[] = [];

        for (const name of scriptNames) if (extra["script"][name]) viewScripts.push(name);

        let pages: APIEmbed[] = [];
        for (const viewScript of viewScripts) {
            let lastTalk = getNPCtalkPos(extra["script"][viewScript]);
            if (extra["script"][viewScript] === "fin.") lastTalk = npcScripts[viewScript].length - 1;

            let pushScripts: scriptContent[] = [];

            for (let idx = 0; idx < lastTalk + 1; idx++) {
                pushScripts.push(npcScripts[viewScript][idx]);
            }
            
            pages.push({
                title: npcNames[viewScript] + (extra["script"][viewScript] === "fin." ? "" : " (대화 중)"),
                description: pushScripts.map(d => {
                    let npc = npcs.find(np => np.npcId === d.chatterId);
                    let name = "[ - ]";

                    if (!npc) name = "> ";
                    else name = "[ **" + npc.icon + " " + npc.name + "** ] : ";

                    let contents = d.content.split("\n");

                    return contents.map(cnt => name + cnt).join("\n");
                }).join("\n\n"),
                color: Colors.Blurple
            });
        }
        
        if (!pages.length) {
            message.reply({
                embeds: errorEmbed("대화가 진행 중이거나 끝낸게 없어요.")
            })
            return;
        }

        message.reply({
            embeds: [pages[0]]
        });
    }
}