import TravelMap from "../../../../data/map/Map";

export function getPos(dir: string) {
    let dlist: string[] = dir.split("");
    let pos = { x: 0, y: 0 };

    if ([dlist[0], dlist[dlist.length - 1]].includes("s")) pos.y = 1;
    else if ([dlist[0], dlist[dlist.length - 1]].includes("n")) pos.y = -1;

    if ([dlist[0], dlist[dlist.length - 1]].includes("e")) pos.x = 1;
    else if ([dlist[0], dlist[dlist.length - 1]].includes("w")) pos.x = -1;

    return pos;
}

export function getNPCtalkPos(data: string): number {
    return Number(data.split(":")[1]);
}

export function doorOutsideMapId(travelMap: TravelMap, mapData: string[][], pos: { x: number; y: number; }): string {
    let doors = travelMap.doors;
    let behindTile = mapData[pos.y][pos.x];

    let mapId: string = doors.length === 1 ? doors[0].mapId : doors.find(d => d.way === behindTile)?.mapId;
    return mapId;
}