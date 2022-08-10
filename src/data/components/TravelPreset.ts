export function getTravelPresetComponents(customId: string) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "survey" }), style: 1, emoji: { name: "🔍" }, label: "조사하기", disabled: true },
        ]
    }
}