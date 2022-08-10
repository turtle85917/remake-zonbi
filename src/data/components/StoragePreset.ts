export function getStoragePresetComponents(customId: string) {
    return { type: 1,
        components: [
            { type: 2, customId: customId.format({ action: "extend" }), style: 1, emoji: { "id": "987474087024680971" }, label: "확장하기", disabled: true },
            { type: 2, customId: customId.format({ action: "fix" }), style: 3, emoji: { name: "⛏" }, label: "수리하기" },
        ]
    }
}