export function getMovePresetComponents(customId: string) {
    return [
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "nw" }), style: 2, emoji: { name: "↖️".format() } },
            { type: 2, customId: customId.format({ action: "-n" }), style: 2, emoji: { name: "⬆️".format()}  },
            { type: 2, customId: customId.format({ action: "ne" }), style: 2, emoji: { name: "↗️".format() } } ]
        },
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "-w" }), style: 2, emoji: { name: "⬅️".format() } },
            { type: 2, customId: customId.format({ action: "-r" }), style: 1, emoji: { name: "🔄".format()}  },
            { type: 2, customId: customId.format({ action: "-e" }), style: 2, emoji: { name: "➡️".format() } } ]
        },
        { type: 1,
            components: [
            { type: 2, customId: customId.format({ action: "sw" }), style: 2, emoji: { name: "↙️".format() } },
            { type: 2, customId: customId.format({ action: "-s" }), style: 2, emoji: { name: "⬇️".format()}  },
            { type: 2, customId: customId.format({ action: "se" }), style: 2, emoji: { name: "↘️".format() } } ]
        }
    ];
}