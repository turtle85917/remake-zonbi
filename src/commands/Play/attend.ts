import { APIEmbed, Colors, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { database } from "../../utils/Database";

import { errorEmbed, findItem, getItem, koreanTimeZone, logGetItem, newItem } from "../../utils/Utility";

import { Account } from "../../data/interfaces/data/account";
import { attends, Data, inventoryItem } from "../../data/interfaces/data/user";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "attend";
        this.aliases = ["ㅊㅊ", "출첵", "출석체크", "attendance"];
        this.description = "생존 신고(출석 체크)를 해요.";
    }

    async run(client: DiscordBot, message: Message, args: string[]) {
        let account: Account[] = await database("account").where({ userId: message.author.id });
        if (!account.length) {
            message.reply({ embeds: errorEmbed("![error.account_notfound]".format()) });
            return;
        }

        if (!JSON.parse(account[0].verify)[message.guildId]) {
            message.reply({ embeds: errorEmbed("![error.first_verify]".format()) });
            return;
        }

        let data: Data[] = await database("data").where({ userId: message.author.id, guildId: message.guildId });
        let attends: attends = JSON.parse(data[0].attends);

        let date = koreanTimeZone();

        let newTime = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();

        date.setDate(date.getDate() - 1);
        let yesterTime = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();

        date.setDate(date.getDate() + 1);

        if (attends["attend-times"].includes(newTime)) {
            message.reply({ embeds: errorEmbed("![command.attend.error-already]".format()) });
            return;
        }

        let maxCombo = attends.combo;
        let comboBroken = false;

        if (attends["attend-times"][attends["attend-times"].length - 1] === yesterTime) {
            attends.combo += 1;
            maxCombo += 1;
        } else {
            comboBroken = true;
        }

        if (comboBroken && !maxCombo) {
            attends.combo += 1;
            maxCombo += 1;

            comboBroken = false;
        }

        attends["attend-times"].push(newTime);

        let fiveCount = Math.floor(attends["attend-times"].length / 5);
        let leftCount = attends["attend-times"].length - (fiveCount * 5);

        let leftText = "/".repeat(leftCount);

        let fiveText = "";
        for(let idx = 0; idx < Math.ceil(fiveCount / 8); idx++) {
            fiveText += new Array(fiveCount).fill("~~////~~").join(" ").slice(idx * 9 * 8, (idx + 1) * 9 * 8) + (idx === Math.ceil(fiveCount / 8) - 1 ? "" : "\n");
        }

        let resultText = fiveText ? fiveCount - leftCount > 8 ? fiveText + "\n" + leftText : fiveText + " " + leftText : leftText;
        let getReward: APIEmbed = {};

        if (comboBroken && maxCombo) {
            let getQuantity: number = 2 * maxCombo;

            let inventory: inventoryItem[] = JSON.parse(data[0].inventory);

            let brokenHeart = await findItem("broken-heart");
            inventory = await newItem(inventory, brokenHeart.staticId, getQuantity);

            let brokenHeart_ = getItem(inventory, brokenHeart.staticId);

            getReward = {
                title: "![command.attend.t-reward]".format(),
                description: await logGetItem([
                    { staticId: brokenHeart.staticId, quantity: getQuantity, after: brokenHeart_.quantity }
                ]),
                color: Colors.DarkRed
            };

            await database("data").update({ inventory: JSON.stringify(inventory, null, 4) }).where({ userId: message.author.id, guildId: message.guildId });
        }

        message.reply({
            embeds: [
                {
                    title: "![command.attend.t-success]".format(),
                    description: [
                        comboBroken && maxCombo ? "![command.attend.combo-broken]".format({ maxCombo }) : maxCombo ? "![command.attend.combo-ing]".format({ maxCombo }) : undefined,
                        "![command.attend.survival-ing]".format({ day: attends["attend-times"].length }),
                        "",
                        "![command.attend.calendar]".format(),
                        resultText
                    ].join("\n"),
                    footer: { text: comboBroken && maxCombo ? undefined : "![command.attend.footer-reward-desc]".format() },
                    color: Colors.Green
                }
            ].map((_, __, embeds: APIEmbed[]) => {
                if (comboBroken && maxCombo) {
                    embeds.unshift(getReward);
                }
                return embeds;
            }).flat()
        });

        if (comboBroken) attends.combo = 1;
        await database("data").update({ attends: JSON.stringify(attends, null, 4) }).where({ userId: message.author.id, guildId: message.guildId });
    }
}