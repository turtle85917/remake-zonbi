export function getAnswerPresetComponents(customId: string, disabled?: boolean) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "yes" }), style: 1, label: "![preset.answer-components.yes]".format(), disabled },
            { type: 2, customId: customId.format({ action: "no" }), style: 4, label: "![preset.answer-components.no]".format() }
        ]
    }
}