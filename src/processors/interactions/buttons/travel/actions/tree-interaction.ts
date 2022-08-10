import { ButtonInteraction, CacheType, Colors } from "discord.js";
import DiscordBot from "../../../../../structures/DiscordBot";

import InteractionRun, { data } from "../../../../../structures/InteractionRun";

import TravelMap from "../../../../../data/map/Map";
import { tileId, tiles } from "../../../../../data/map/tiles";

import { getPos } from "../Utility";
import { findItem, getItem, getRandomInt, getWeight, logGetItem, newItem } from "../../../../../utils/Utility";

import { database } from "../../../../../utils/Database";

import { extraData, extraInterpret } from "../../../../../data/interfaces/data/extraData";
import { Data, inventoryItem, travelInterpret } from "../../../../../data/interfaces/data/user";

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
        if (!extra["defer"]) extra["defer"] = {};

        let travelMap: TravelMap = new (require("../../../../../data/map/{map}/data".format({ map: travelData.map })).default)();
        let mapData: string[][] = travelMap.data;

        let pos = getPos(travelData.direction);

        let y = travelData.position[1] + pos.y;
        if (!mapData[y]) y = 0;

        let keyId = travelData.map + " : " + travelData.position.join(" : ");
        let tile = mapData[y][travelData.position[0] + pos.x];

        let tile_id = tileId[tile];
        let tileData = tiles[tile_id];

        if (!tile_id.startsWith("tree")) return;

        if (Id.get("action") === "hit-tree") {
            let treeData = extra["travel"][keyId];

            if (treeData.twig < 0.2) {
                return;
            }

            let getQuantity: number = Math.round(treeData.twig * getRandomInt(12, 26));
            if (!getQuantity) {
                return;
            }

            let inventory: inventoryItem[] = JSON.parse(data.inventory);
            let stick = await findItem("stick");

            if (((await getWeight(inventory)) + (stick.data.weight * getQuantity)) > Number(data.maxWeight)) {
                extra["defer"][travelData.position.join(" : ") + " : hit-tree"] = [
                    { staticId: "stick", quantity: getQuantity }
                ];
                return;
            }

            if (extra["defer"][travelData.position.join(" : ") + " : hit-tree"]) getQuantity =  extra["defer"][travelData.position.join(" : ") + " : hit-tree"];

            inventory = await newItem(inventory, stick.staticId, getQuantity);

            delete extra["defer"][travelData.position.join(" : ") + " : hit-tree"];
            extra["travel"][keyId].twig = 0;

            interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [
                    {
                        title: "✂️ 가지치기 완료!",
                        description: await logGetItem([
                            { staticId: stick.staticId, quantity: getQuantity, after: getItem(inventory, stick.staticId).quantity }
                        ]),
                        color: Colors.Green
                    }
                ]
            });

            await database("data").update({ travelData: JSON.stringify(travelData, null, 4), inventory: JSON.stringify(inventory, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });
            await database("extra-data").update({ data: JSON.stringify(extra, null, 4) }).where({ userId: interaction.user.id, guildId: interaction.guildId });

            
        }
    }
}