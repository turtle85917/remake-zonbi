export function getTravelPresetComponents(customId: string) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "survey" }), style: 1, emoji: { name: "๐" }, label: "์กฐ์ฌํ๊ธฐ", disabled: true },
        ]
    }
}