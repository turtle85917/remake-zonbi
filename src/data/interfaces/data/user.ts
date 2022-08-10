import { option } from "../static/item";

export interface attends {
    "attend-times": string[];
    "count": number;
    "combo": number;
}

export interface inventoryItem {
    staticId: string;
    quantity: number;
    options: option;
    UUID: number;
}

export interface effectInterpret {
    staticId: string;
    start: number;
    expire: number;
}

export interface travelInterpret {
    map: string;
    direction: string;
    position: number[];
}

export interface Data {
    guildId: string;
    userId: string;
    level: string;
    mileage: string;
    health: string;
    maxHealth: string;
    healthSpeed: string;
    thirst: string;
    satiety: string;
    effects: string;
    feather: string;
    gem: string;
    maxWeight: string;
    attends: string;
    inventory: string;
    createdAt: string;
    travelData: string;
}