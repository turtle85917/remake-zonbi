export function getNPCtalkPresetComponents(customId: string) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "talk" }), style: 1, emoji: { name: "❓" }, label: "-" },
        ]
    }
}