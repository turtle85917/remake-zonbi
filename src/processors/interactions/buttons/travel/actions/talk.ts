import { ButtonInteraction, CacheType, Colors } from "discord.js";
import DiscordBot from "../../../../../structures/DiscordBot";

import InteractionRun, { data } from "../../../../../structures/InteractionRun";

import { database } from "../../../../../utils/Database";
import { getPos, doorOutsideMapId, getNPCtalkPos } from "../Utility";

import TravelMap from "../../../../../data/map/Map";
import { npcs } from "../../../../../data/map/npcs";
import { npcScripts, scriptContent } from "../../../../../data/map/scripts";

import { getNPCtalkPresetComponents } from "../../../../../data/components/NPCtalkPreset";

import { Data, travelInterpret } from "../../../../../data/interfaces/data/user";
import { extraData, extraInterpret } from "../../../../../data/interfaces/data/extraData";

export default class Action extends InteractionRun {
    constructor() {
        super();
    }

    async run(client: DiscordBot, interaction: ButtonInteraction<CacheType>, datas: data) {
        let Id = interaction.customId;

        let token = interaction.channelId + interaction.user.id;
        let use = client.temporaries.find(d => d.token === token && d.commandName === Id.get("command-name"));

        let data: Data = datas.data;
        let travelData: travelInterpret = JSON.parse(data.travelData);

        let extraData: extraData = datas.extra;
        let extra: extraInterpret = JSON.parse(extraData.data);

        let travelMap: TravelMap = new (require("../../../../../data/map/{map}/data".format({ map: travelData.map })).default)();
        let mapData: string[][] = travelMap.data;

        let pos = getPos(travelData.direction);
        let mapId = doorOutsideMapId(travelMap, mapData, { x: travelData.position[0] + pos.x, y : travelData.position[1] });

        let scriptId = "new-" + mapId + "-visit";
        if (extra["script"][scriptId] && npcScripts[scriptId]) {
            extra["script"][scriptId] = "npc-talking : " + String(getNPCtalkPos(extra["script"][scriptId]) + 1);
            let npcPos = getNPCtalkPos(extra["script"][scriptId]);

            let script = npcScripts[scriptId];
            let nextScript = script[npcPos + 1];

            let pushScripts: scriptContent[] = [];
            for (let idx = 0; idx < npcPos + 1; idx++) {
                pushScripts.push(script[idx]);
            }

            let nextChatterNpc = npcs.find(d => d.npcId === nextScript?.chatterId);
            let nextChatterShoten = nextScript?.shortenForm;

            let components = [ getNPCtalkPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`) ];

            if (nextChatterNpc) {
                components[0].components[0].emoji.name = "▶";
                components[0].components[0].label = undefined;
            }
            if (nextScript?.chatterId === "player") {
                components[0].components[0].emoji.name = undefined;
                components[0].components[0].label = nextChatterShoten;
            }

            if (npcPos === script.length - 1) {
                components.shift();
                extra["script"][scriptId] = "fin.";
            }

            interaction.update({
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
                components, fetchReply: true
            });

            await database("data").update({ travelData: JSON.stringify(travelData, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
            await database("extra-data").update({ data: JSON.stringify(extra, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });

            use.interactions.main = interaction;
        }
    }
}