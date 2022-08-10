export function getPagePresetComponents(customId: string, text: string) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "left" }), style: 1, emoji: { name: "![preset.page-components.left]".format() } },
            { type: 2, customId: customId.format({ action: "refrash" }), style: 1, emoji: { name: "![preset.page-components.refrash]".format()}, label: text  },
            { type: 2, customId: customId.format({ action: "right" }), style: 1, emoji: { name: "![preset.page-components.right]".format() } }
        ]
    }
}