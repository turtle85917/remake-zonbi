export interface Storage {
    guildId: string;
    userId: string;
    health: string;
    level: string;
    status: "fine" | "broken";
}