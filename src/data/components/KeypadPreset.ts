export function getKeypadPresetComponents(customId: string) {
    return [
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "07" }), style: 2, emoji: { name: "7️⃣".format() } },
            { type: 2, customId: customId.format({ action: "08" }), style: 2, emoji: { name: "8️⃣".format()}  },
            { type: 2, customId: customId.format({ action: "09" }), style: 2, emoji: { name: "9️⃣".format() } } ]
        },
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "04" }), style: 2, emoji: { name: "4️⃣".format() } },
            { type: 2, customId: customId.format({ action: "05" }), style: 2, emoji: { name: "5️⃣".format()}  },
            { type: 2, customId: customId.format({ action: "06" }), style: 2, emoji: { name: "6️⃣".format() } } ]
        },
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "01" }), style: 2, emoji: { name: "1️⃣".format() } },
            { type: 2, customId: customId.format({ action: "02" }), style: 2, emoji: { name: "2️⃣".format()}  },
            { type: 2, customId: customId.format({ action: "03" }), style: 2, emoji: { name: "3️⃣".format() } } ]
        },
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "00" }), style: 2, emoji: { name: "0️⃣".format() } },
            { type: 2, customId: customId.format({ action: "-1" }), style: 2, emoji: { name: "⬅️".format()}  },
            { type: 2, customId: customId.format({ action: "-2" }), style: 4, emoji: { name: "🆑".format() } } ]
        }
    ]
}