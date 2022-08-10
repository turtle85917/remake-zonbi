import { tiles } from "../map/tiles";

export function getSurveyPresetComponents(customId: string, tileId: string) {
    let tileData = tiles[tileId];
    let components = { type: 1, components: [] };

    if (tileId.startsWith("tree")) {
        components.components.push({
            type: 2,
            style: 1,
            customId: customId.format({ action: "drop-water" }),
            emoji: { name: "💦" },
            label: "물 주기"
        });
        components.components.push({
            type: 2,
            style: 1,
            customId: customId.format({ action: "hit-tree" }),
            emoji: { name: "🌿" },
            label: "가지치기"
        });
    }

    return components;
}