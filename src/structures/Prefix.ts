import { ButtonInteraction, CacheType, Message, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import DiscordBot from "./DiscordBot";

import Options from "./Options";

export default abstract class PrefixCommand {
    public name: string;
    public aliases: string[];
    public description: string;

    public dev?: boolean;

    public options?: Options[];

    abstract run(client: DiscordBot, message: Message, args: string[], interaction?: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType> | ModalSubmitInteraction<CacheType>): Promise<void>;
}