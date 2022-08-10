import { ButtonInteraction, CacheType, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";
import { errorEmbed } from "../../utils/Utility";

import { Account } from "../../data/interfaces/data/account";
import { Data, travelInterpret } from "../../data/interfaces/data/user";
import { extraData, extraInterpret } from "../../data/interfaces/data/extraData";

import TravelMap from "../../data/map/Map";
import { tileId, tiles } from "../../data/map/tiles";

import { getMovePresetComponents } from "../../data/components/MovePreset";
import { getTravelPresetComponents } from "../../data/components/TravelPreset";

import { getPos } from "../../processors/interactions/buttons/travel/Utility";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "travel";
        this.aliases = ["모험", "탐험"];
        this.description = "지하 벙커를 나가 돌아다닙니다.";
    }

    async run(client: DiscordBot, message: Message, args: string[], interaction: ButtonInteraction<CacheType>) {
        let userId = interaction ? interaction.user.id : message.author.id;
        let channelId = interaction ? interaction.channelId : message.channelId;
        let guildId = interaction ? interaction.guildId : message.guildId;

        let token = channelId + userId;

        if (message) {
            if (!client.temporaries.find(d => d.token === token && d.commandName === this.name)) {
                client.temporaries.push({ token, commandName: this.name, messages: { main: undefined }, interactions: { main: undefined } });
            }
        }

        let use = client.temporaries.find(d => d.token === token && d.commandName === this.name);

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
        let travelData: travelInterpret = JSON.parse(data[0].travelData);

        let extraData: extraData[] = await database("extra-data").where({ userId, guildId });
        let extra: extraInterpret = JSON.parse(extraData[0].data);

        if (!travelData.map) travelData.map = "shelter";
        if (!extra["interactions"]) extra["interactions"] = {};

        let travelMap: TravelMap = new (require("../../data/map/{map}/data".format({ map: travelData.map })).default)();
        let mapData: string[][] = travelMap.data;

        if (!travelData.position.length) {
            travelData.position = travelMap.baiscPlayerData.positions["init"];
        }

        let result: string[][] = [];

        for (let idx = -4; idx < 5; idx++) {
            let loadY = travelData.position[1] + idx;

            if (loadY > -1 && loadY < mapData.length) {
                let x = travelData.position[0] - 4;
                if (x < 0) x = 0;

                let endX = travelData.position[0] + 5;

                let mapPIECE: string[] = mapData[loadY].map(d => d);

                if (travelMap.interactionPositions) {
                    for (const interactionData of travelMap.interactionPositions) {
                        if (interactionData.position[1] === loadY) {
                            let keyId = travelData.map + " : " + interactionData.position.join(" : ");
                            mapPIECE[interactionData.position[0]] = extra["interactions"][keyId] === "true" ? interactionData.afterTile : interactionData.beforeTile;
                        }
                    }
                }

                mapPIECE = mapPIECE.slice(x, endX);

                if (mapPIECE.length < 9) {
                    let lack = 9 - mapPIECE.length;

                    if (travelData.position[0] < Math.floor(mapData.length / 2)) ["▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪"].slice(0, lack).forEach(d => mapPIECE.unshift(d));
                    else mapPIECE = mapPIECE.concat(["▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪"].slice(0, lack));
                }

                result.push(mapPIECE);
            } else {
                result.push(["▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪", "▪"]);
            }
        }

        let dirEmoji = client.emojis.cache.find(d => d.guild.id === "942211347972784158" && d.name === travelData.direction);
        result[Math.floor(result.length / 2)][Math.floor(result[0].length / 2)] = `<:${dirEmoji.name}:${dirEmoji.id}>`;

        let components: any[] = getMovePresetComponents(`${guildId}@${userId}@${this.name}#{action}`);
        components.push(getTravelPresetComponents(`${guildId}@${userId}@${this.name}#{action}`));

        let pos = getPos(travelData.direction);

        let y = travelData.position[1] + pos.y;
        if (!mapData[y]) y = 0;

        let tile = mapData[y][travelData.position[0] + pos.x];

        let tile_id = tileId[tile];
        let tileData = tiles[tile_id];

        components[components.length - 1].components[0].disabled = !tileData?.survey;

        await database("data").update({ travelData: JSON.stringify(travelData, null, 4) }).where({ userId, guildId });

        if (message) {
            let m = await message.reply({
                embeds: [
                    {
                        title: `${travelMap.icon} ${travelMap.name} 위치 중...`,
                        description: travelMap.description,
                        fields: [
                            {
                                name: `📍 현재 위치 (${travelData.position.map(d => d + 1).join(", ")})`,
                                value: ">>> " + result.map(d => d.join("")).join("\n")
                            }
                        ]
                    }
                ],
                components
            });

            use.messages.main?.delete()?.catch(() => undefined);
            use.messages.main = m;

            use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);
            use.interactions.main = undefined;
        } else {
            interaction.update({
                embeds: [
                    {
                        title: `${travelMap.icon} ${travelMap.name} 위치 중...`,
                        description: travelMap.description,
                        fields: [
                            {
                                name: `📍 현재 위치 (${travelData.position.map(d => d + 1).join(", ")})`,
                                value: ">>> " + result.map(d => d.join("")).join("\n")
                            }
                        ]
                    }
                ],
                components
            });

            use.interactions.main?.editReply({ embeds: [], components: [], files: [], content: "![error.expire]".format() })?.catch(() => undefined);
            use.interactions.main = undefined;
        }
    }
}