import { ButtonInteraction, CacheType, Colors } from "discord.js";
import DiscordBot from "../../../structures/DiscordBot";

import Run from "../../../structures/Run";

import { database } from "../../../utils/Database";
import { errorEmbed } from "../../../utils/Utility";

import TravelMap from "../../../data/map/Map";
import { tileId, tiles } from "../../../data/map/tiles";

import { npcs } from "../../../data/map/npcs";
import { npcScripts, scriptContent } from "../../../data/map/scripts";

import { Account } from "../../../data/interfaces/data/account";

import { Data, travelInterpret } from "../../../data/interfaces/data/user";
import { extraData, extraInterpret } from "../../../data/interfaces/data/extraData";

import { doorOutsideMapId, getNPCtalkPos, getPos } from "./travel/Utility";

import { getNPCtalkPresetComponents } from "../../../data/components/NPCtalkPreset";
import InteractionRun from "../../../structures/InteractionRun";

export default class Action extends Run {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {
        let Id = interaction.customId;

        let token = interaction.channelId + interaction.user.id;
        let use = client.temporaries.find(d => d.token === token && d.commandName === Id.get("command-name"));

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
        let travelData: travelInterpret = JSON.parse(data[0].travelData);

        let extraData: extraData[] = await database("extra-data").where({ userId: interaction.user.id, guildId: interaction.guildId });

        let extra: extraInterpret = JSON.parse(extraData[0].data);
        if (!extra["travel"]) extra["travel"] = {};
        if (!extra["script"]) extra["script"] = {};

        let travelMap: TravelMap = new (require("../../../data/map/{map}/data".format({ map: travelData.map })).default)();
        let mapData: string[][] = travelMap.data;

        if (["hit-tree", "drop-water"].includes(Id.get("action"))) {
            await (new (require("./travel/actions/tree-interaction").default)() as InteractionRun).run(client, interaction, { data: data[0], extra: extraData[0] });
            return;
        }

        if (Id.get("action") === "survey") {
            await (new (require("./travel/actions/survey").default)() as InteractionRun).run(client, interaction, { data: data[0], extra: extraData[0] });
            return;
        }

        if (Id.get("action") === "talk") {
            await (new (require("./travel/actions/talk").default)() as InteractionRun).run(client, interaction, { data: data[0], extra: extraData[0] });
            return;
        }

        if (Id.get("action") === "-r") {
            client.commands.get(Id.get("command-name")).run(client, undefined, [], interaction);
            return;
        }

        let newDir = (Id.get("action").split("").filter(d => d !== "-").join("") + "_").slice(0, 2);
        travelData.direction = newDir;

        let dir: string = Id.get("action");
        let dlist: string[] = dir.split("");

        let pos = { x: 0, y: 0 };

        if ([dlist[0], dlist[dlist.length - 1]].includes("s")) pos.y = 1;
        else if ([dlist[0], dlist[dlist.length - 1]].includes("n")) pos.y = -1;

        if ([dlist[0], dlist[dlist.length - 1]].includes("e")) pos.x = 1;
        else if ([dlist[0], dlist[dlist.length - 1]].includes("w")) pos.x = -1;

        travelData.position[0] += pos.x;
        travelData.position[1] += pos.y;

        if (
            !mapData[travelData.position[1]] ||
            !mapData[travelData.position[1]][travelData.position[0]]) {
                travelData.position[0] -= pos.x;
                travelData.position[1] -= pos.y;
            }
        
        let tile = mapData[travelData.position[1]][travelData.position[0]];

        let tile_id = tileId[tile];
        let tileData = tiles[tile_id];

        let npc = npcs.find(d => d.icon === tile);

        if ((tileData && !tileData.pass) || npc) {
            travelData.position[0] -= pos.x;
            travelData.position[1] -= pos.y;
        }

        if (tileData?.icon === "🔲") {
            let doors = travelMap.doors;

            let yMap = mapData[travelData.position[1] + pos.y * 2];
            if (!yMap) yMap = mapData[travelData.position[1]];

            let behindTile = yMap[travelData.position[0] + pos.x * 2];
            
            let mapId = doorOutsideMapId(travelMap, mapData, { x: travelData.position[0] + pos.x, y : travelData.position[1] });
            let scriptId = "new-" + mapId + "-visit";

            if ((!extra["script"][scriptId] || extra["script"][scriptId].startsWith("npc-talking")) && npcScripts[scriptId]) {
                if (!extra["script"][scriptId]) extra["script"][scriptId] = "npc-talking : 0";

                let npcPos = getNPCtalkPos(extra["script"][scriptId]);

                let script = npcScripts[scriptId];
                let nextScript = script[npcPos + 1];

                let nextChatterNpc = npcs.find(d => d.npcId === nextScript?.chatterId);
                let nextChatterShoten = nextScript?.shortenForm;

                let pushScripts: scriptContent[] = [];
                for (let idx = 0; idx < npcPos + 1; idx++) {
                    pushScripts.push(script[idx]);
                }

                let components = [ getNPCtalkPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`) ];

                if (nextChatterNpc) {
                    components[0].components[0].emoji.name = "▶";
                    components[0].components[0].label = undefined;
                }
                if (nextScript?.chatterId === "player") {
                    components[0].components[0].emoji.name = undefined;
                    components[0].components[0].label = nextChatterShoten;
                }

                if (npcPos === script.length - 1) components.shift();

                interaction.reply({
                    embeds: [
                        {
                            title: "NPC와 대화 나누기",
                            description: pushScripts.map(d => {
                                let npc = npcs.find(np => np.npcId === d.chatterId);
                                let name = "[ - ]";

                                if (!npc) name = "> ";
                                else name = "[ **" + npc.icon + " " + npc.name + "** ] : ";

                                let contents = d.content.split("\n");

                                return contents.map(cnt => name + cnt).join("\n");
                            }).join("\n\n"),
                            color: Colors.Blurple
                        }
                    ],
                    components,
                    ephemeral: true, fetchReply: true
                });
                use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);
                use.interactions.main = interaction;

                await database("data").update({ travelData: JSON.stringify(travelData, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
                await database("extra-data").update({ data: JSON.stringify(extra, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
                return;
            }

            if (doors.length === 1) {
                travelData.map = doors[0].mapId;

                travelData.direction = "c_";
                travelData.position = travelMap.baiscPlayerData.positions[doors[0].mapId];
            } else {
                let newMap = doors.find(d => d.way === behindTile);

                if (newMap) {
                    travelData.map = newMap.mapId;

                    travelData.direction = "c_";
                    travelData.position = travelMap.baiscPlayerData.positions[newMap.mapId];
                }
            }
        }

        await database("data").update({ travelData: JSON.stringify(travelData, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
        await database("extra-data").update({ data: JSON.stringify(extra, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });

        client.commands.get(Id.get("command-name")).run(client, undefined, [], interaction);
    }

    async keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType>): Promise<void> {}
}