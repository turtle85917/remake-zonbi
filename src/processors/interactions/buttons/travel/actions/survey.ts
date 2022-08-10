import { APIEmbedField, ButtonInteraction, CacheType } from "discord.js";
import DiscordBot from "../../../../../structures/DiscordBot";

import InteractionRun, { data } from "../../../../../structures/InteractionRun";

import TravelMap from "../../../../../data/map/Map";
import { tileId, tiles } from "../../../../../data/map/tiles";

import { Data, travelInterpret } from "../../../../../data/interfaces/data/user";
import { extraData, extraInterpret } from "../../../../../data/interfaces/data/extraData";

import { getPos } from "../Utility";
import { getBar } from "../../../../../utils/Utility";

import { database } from "../../../../../utils/Database";

import { getSurveyPresetComponents } from "../../../../../data/components/SurveyPreset";

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

        let y = travelData.position[1] + pos.y;
        if (!mapData[y]) y = 0;

        let keyId = travelData.map + " : " + travelData.position.join(" : ");
        let tile = mapData[y][travelData.position[0] + pos.x];

        let tile_id = tileId[tile];
        let tileData = tiles[tile_id];

        if (!tileData?.survey) return;

        if (travelMap.interactionPositions?.find(d => JSON.stringify(d.position) === JSON.stringify(travelData.position))) {
            if (!extra["travel"][keyId]) extra["travel"][keyId] = "false";
        }
        if (tile_id.startsWith("tree")) {
            if (!extra["travel"][keyId]) extra["travel"][keyId] = { twig: 0.5, moisture: 1, status: "fine" };
        }

        let fields: APIEmbedField[] = [];
        if (tile_id.startsWith("tree")) {
            fields.push({ name: "💦 수분", value: getBar(extra["travel"][keyId].moisture * 100, 100, true, 10, "🟦") });
            fields.push({ name: "🌿 잔가지", value: getBar(extra["travel"][keyId].twig * 100, 100, true, 10, "🟫") });
        }

        interaction.reply({
            embeds: [
                {
                    title: tileData.icon + " " + tileData.name,
                    description: tileData.description, fields
                }
            ],
            components: [
                getSurveyPresetComponents(`${interaction.guildId}@${interaction.user.id}@${Id.get("command-name")}#{action}`, tile_id)
            ].filter(d => d && d.components.length),
            ephemeral: true
        });

        await database("data").update({ travelData: JSON.stringify(travelData, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
        await database("extra-data").update({ data: JSON.stringify(extra, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });

        use.interactions.main = interaction;
    }
}