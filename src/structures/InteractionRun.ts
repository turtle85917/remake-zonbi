import { ButtonInteraction, CacheType, SelectMenuInteraction } from "discord.js";
import DiscordBot from "./DiscordBot";

import { extraData } from "../data/interfaces/data/extraData";
import { Data } from "../data/interfaces/data/user";

export interface data { data: Data, extra?: extraData };

export default abstract class InteractionRun {
    abstract run(client: DiscordBot, interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>, datas: data): Promise<void>;
}