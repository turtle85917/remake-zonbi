export default abstract class Options {
    readonly name: string;
    readonly description: string;

    readonly required: boolean;
    readonly choices?: string[];
}