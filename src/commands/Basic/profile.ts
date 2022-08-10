import { ButtonInteraction, CacheType, GuildMember, Message } from "discord.js";
import DiscordBot from "../../structures/DiscordBot";

import PrefixCommand from "../../structures/Prefix";

import { errorEmbed, findItem, getAvatar, getBar, getMaxMileage, satietyToHealth, timeFormat } from "../../utils/Utility";
import { database } from "../../utils/Database";

import { Account } from "../../data/interfaces/data/account";
import { Data, effectInterpret } from "../../data/interfaces/data/user";

import { getPagePresetComponents } from "../../data/components/PagePreset";

export default class Command extends PrefixCommand {
    constructor() {
        super();
        this.name = "profile";
        this.aliases = ["ㅍㄿ", "ㅍㄹㅍ", "프로필"];
        this.description = "유저의 정보를 봐요.";

        this.options = [
            { name: "nickname", description: "정보를 보고 싶은 별명", required: false },
        ]
    }

    async run(client: DiscordBot, message: Message, args: string[], interaction: ButtonInteraction<CacheType>) {
        let userId = interaction ? interaction.user.id : message.author.id;
        let channelId = interaction ? interaction.channelId : message.channelId;

        let guildId = interaction ? interaction.guildId : message.guildId;
        let guild = interaction ? interaction.guild : message.guild;

        let reply = (options: any, behind: boolean = true) => {
            if (interaction) {
                options["ephemeral"] = behind;
                interaction.reply(options);
            } else {
                message.reply(options);
            }
        };

        let token = channelId + userId;

        if (message) {
            if (!client.temporaries.find(d => d.token === token && d.commandName === this.name)) {
                client.temporaries.push({ token, commandName: this.name, messages: { main: undefined }, interactions: { main: undefined }, page: { c: 0, m: 0, list: [] }, profile: { target: undefined } });
            }
        }

        let use = client.temporaries.find(d => d.token === token && d.commandName === this.name);
        let another = interaction ? use.profile.target : message.author.id;

        let name = args[0]?.trim()?.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, "");
        let otherUser: boolean = message ? (name ? true : false) : false;

        let account: Account[] = [];
        if (otherUser) {
            account = await database("account").where({ name });
        } else {
            account = await database("account").where({ userId: another });
        }

        if (!account.length) {
            if (otherUser) {
                reply({ embeds: errorEmbed("![command.profile.error-other_account]".format({ name })) });
            } else {
                reply({ embeds: errorEmbed("![error.account_notfound]".format()) });
            }
            return;
        }

        let member: GuildMember | undefined = undefined;
        if (otherUser) {
            member = guild.members.cache.get(account[0].userId);
        }

        if (account[0] && !otherUser && !JSON.parse(account[0].verify)[guildId]) {
            reply({ embeds: errorEmbed("![error.first_verify]".format()) });
            return;
        }

        if (!member && otherUser) {
            reply({ embeds: errorEmbed("![command.profile.error-other_guild]".format({ name })) });
            return;
        }

        if (account[0] && otherUser && !JSON.parse(account[0].verify)[guildId]) {
            reply({ embeds: errorEmbed("![command.profile.error-other_verify]".format({ name })) });
            return;
        }

        let data: Data[] = [];
        let allData: Data[] = [];
        if (otherUser) {
            data = await database("data").where({ userID: member.user.id, guildId });
            allData = await database("data").where({ userID: member.user.id });
        } else {
            data = await database("data").where({ userId: another, guildId });
            allData = await database("data").where({ userID: another });
        }

        if (message) use.profile.target = otherUser ? member.id : userId;

        let feather = await findItem("feather");
        let gem = await findItem("gem");

        let nextLevel = Number(data[0].level) + 1;

        let prevLevel = Number(data[0].level) - 1;
        let nervExp = getMaxMileage(prevLevel);

        let totalLevel = 0;
        allData.forEach(d => totalLevel += Number(d.level));

        if (message) use.page.c = 0;
        use.page.list = [];

        use.page.list.push({
            title: account[0].name,
            description: [
                `<@${account[0].userId}>,`,
                "![term.status.level]",
                getBar(Number(data[0].mileage) - nervExp, getMaxMileage(Number(data[0].level)) - nervExp, true, 10, "🟩"),
                "![command.profile.need-mileage]".format({ level: { prev: Number(data[0].level), next: nextLevel, mileage: getMaxMileage(Number(data[0].level)) - Number(data[0].mileage) } }),
                "![term.status.health]",
                getBar(Number(data[0].health) * Number(data[0].maxHealth), Number(data[0].maxHealth), true, 10, "🟥"),
                "![command.profile.health-speed]".format({ health: data[0].healthSpeed }),
                "![term.status.thirst]",
                getBar(Number(data[0].thirst) * 100, 100, true, 10, "🟦"),
                "![term.status.satiety]",
                getBar(Number(data[0].satiety) * 100, 100, true, 10, "🟫"),
                "![command.profile.health-speed]".format({ health: satietyToHealth(Number(data[0].satiety)) }),
                "",
                "![term.status.goods-data]",
                `${feather.data.icon} : \`${data[0].feather}\``,
                `${gem.data.icon} : \`${data[0].gem}\``
            ].join("\n").format(),
            thumbnail: { url: "attachment://profile.png" }
        });
        use.page.list.push({
            title: account[0].name,
            description: [
                "![term.status.effect]",
                "> " + ((JSON.parse(data[0].effects) as effectInterpret[]).map(d => d.start).join("\n") || "*(없음)*"),
                "![term.status.usual]",
                "![command.profile.usual.guild-level]".format({ level: Math.ceil(totalLevel / allData.length)  }),
                "![command.profile.usual.start-survival]".format({ createdAt: data[0].createdAt }),
                "![command.profile.usual.survival]".format({ timestamp: timeFormat(Number(data[0].createdAt) * 1000) })
            ].join("\n").format(),
            thumbnail: { url: "attachment://profile.png" }
        });
        use.page.m = 2;

        let components: any[] = [getPagePresetComponents(`${guildId}@${userId}@${this.name}#{action}`, `${use.page.c + 1} / ${use.page.m}`)]
        if (use.page.c === 0) components[components.length - 1].components[0].disabled = true;
        if (use.page.c === use.page.m - 1 || !use.page.m) components[components.length - 1].components[2].disabled = true;

        if (message) {
            let m = await message.reply({
                embeds: [use.page.list[0]],
                files: [getAvatar(account[0].profile)],
                components
            });

            use.messages.main?.delete()?.catch(() => undefined);
            use.messages.main = m;
        } else {
            interaction.update({
                embeds: [use.page.list[use.page.c]],
                files: [getAvatar(account[0].profile)],
                components
            }).catch(() => undefined);
        }
    }
}