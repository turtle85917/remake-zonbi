export type content = ({ style: number[], content: string } | string);

export enum LOGLEVEL {
    NORMAL,
    INFO,
    SUCCESS,
    WARNING,
    ERROR
};

export const ESC = '\x1b';

interface LogColor {
    NONE: number,
    BOLD: number,
    UNDERLINE: number,

    F_BLACK: number,
    F_RED: number,
    F_GREEN: number,
    F_YELLOW: number,
    F_BLUE: number,
    F_MAGENTA: number,
    F_CYAN: number,
    F_WHITE: number,

    B_BLACK: number,
    B_RED: number,
    B_GREEN: number,
    B_YELLOW: number,
    B_BLUE: number,
    B_MAGENTA: number,
    B_CYAN: number,
    B_WHITE: number
}

export const STYLE_TABLE: LogColor = {
    NONE: 0,
    BOLD: 1,
    UNDERLINE: 4,

    F_BLACK: 30,
    F_RED: 31,
    F_GREEN: 32,
    F_YELLOW: 33,
    F_BLUE: 34,
    F_MAGENTA: 35,
    F_CYAN: 36,
    F_WHITE: 37,

    B_BLACK: 40,
    B_RED: 41,
    B_GREEN: 42,
    B_YELLOW: 43,
    B_BLUE: 44,
    B_MAGENTA: 45,
    B_CYAN: 46,
    B_WHITE: 47
}

export class Logger {
    private static resetColor(): string {
        return `${ESC}[0m`;
    }

    private static makeColor(content: string, color: number[]): string {
        return `${ESC}[${color.join(';')}m${content}${this.resetColor()}`;
    }

    private static Head(type: LOGLEVEL = LOGLEVEL.NORMAL): string {
        let result: string = '';

        switch (type) {
            case LOGLEVEL.NORMAL:
                result = this.makeColor('(:)', [STYLE_TABLE.BOLD, STYLE_TABLE.B_WHITE, STYLE_TABLE.F_BLACK]);
                break;
            case LOGLEVEL.INFO:
                result = this.makeColor('(i)', [STYLE_TABLE.BOLD, STYLE_TABLE.B_GREEN, STYLE_TABLE.F_BLACK]);
                break;
            case LOGLEVEL.SUCCESS:
                result = this.makeColor('(✓)', [STYLE_TABLE.BOLD, STYLE_TABLE.B_GREEN, STYLE_TABLE.F_BLACK]);
                break;
            case LOGLEVEL.WARNING:
                result = this.makeColor('(△)', [STYLE_TABLE.BOLD, STYLE_TABLE.B_YELLOW, STYLE_TABLE.F_BLACK]);
                break;
            case LOGLEVEL.ERROR:
                result = this.makeColor('(×)', [STYLE_TABLE.BOLD, STYLE_TABLE.B_RED, STYLE_TABLE.F_WHITE]);
                break;
        }

        return result;
    }

    constructor(type: LOGLEVEL = LOGLEVEL.NORMAL, contents: content[] = []) {
        let result: string[] = [];

        contents.map(data => {
            result.push(Logger.makeColor(typeof data === "string" ? data : data.content, typeof data === "string" ? [] : data.style));
        })

        switch (type) {
            case LOGLEVEL.NORMAL:
                console.log(`${Logger.Head(type)} ${result.join(' ')}`);
                break;
            case LOGLEVEL.INFO:
            case LOGLEVEL.SUCCESS:
                console.info(`${Logger.Head(type)} ${result.join(' ')}`);
                break;
            case LOGLEVEL.WARNING:
                console.warn(`${Logger.Head(type)} ${result.join(' ')}`);
                break;
            case LOGLEVEL.ERROR:
                console.error(`${Logger.Head(type)} ${result.join(' ')}`);
                break;
        }
    }
}