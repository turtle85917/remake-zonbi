export interface door {
    mapId: string;
    way?: string;
};

export interface interactionPosition {
    beforeTile: string;
    afterTile: string;

    position: number[];

    finditem: boolean;
};

export default abstract class TravelMap {
    public staticId: string;

    public icon: string;

    public name: string;
    public description: string;

    public baiscPlayerData: { positions: { [map: string]: number[] }; type: "important" | "basic"; };

    public interactionPositions?: interactionPosition[];
    public doors?: door[];

    public data: string[][];
}