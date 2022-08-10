import { ButtonInteraction, CacheType, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import DiscordBot from "./DiscordBot";

export default abstract class Run {
    abstract run(client: DiscordBot, interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType> | ModalSubmitInteraction<CacheType>): Promise<void>;
    abstract keypad(client: DiscordBot, interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType> | ModalSubmitInteraction<CacheType>): Promise<void>;
}