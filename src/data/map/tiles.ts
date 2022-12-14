export interface tile {
    [name: string]: {
        icon: string;

        name: string;
        description: string;

        survey: boolean;
        pass: boolean;
    }
};

export const tileId: { [icon: string]: string } = {
    "๐ฒ": "door",
    "๐ณ": "wall",
    "๐ฅ": "store-wall",
    "โฌ": "counter-wall",
    "๐ณ": "tree-#1",
    "๐ฒ": "tree-#2",
    "โฝ": "display-stand",
    "๐จ๏ธ": "counter"
};

export const tiles: tile = {
    "door": {
        icon: "๐ฒ",

        name: "๋ฌธ",
        description: "๋ฌธ์ด๋ค.",

        survey: false,
        pass: false
    },

    "wall": {
        icon: "๐ณ",

        name: "๋ฒฝ",
        description: "๋ฒฝ์ด๋ค.",

        survey: false,
        pass: false
    },
    "store-wall": {
        icon: "๐ฅ",

        name: "์ํผ๋ง์ผ ๋ฒฝ",
        description: "์ํผ๋ง์ผ ๋ฒฝ์ด๋ค.",

        survey: false,
        pass: false
    },
    "counter-wall": {
        icon: "โฌ",

        name: "์นด์ดํฐ ์ฑ์",
        description: "์นด์ดํฐ ์ฑ์์ด๋ค.",

        survey: false,
        pass: false
    },

    "tree-#1": {
        icon: "๐ณ",

        name: "์ธ์ฐฝํ๊ณ  ํธ๋ฅด๋ฅธ ๋์ฝ์",
        description: "๋๋ฌด๋ฅผ ๊ฐ์ง์น๊ธฐํ๋ฉด ๋์ฝ๊ณผ ๋๋ญ๊ฐ์ง๋ฅผ ์ป์ ์ ์์ ๊ฒ ๊ฐ๋ค.",
        
        survey: true,
        pass: false
    },
    "tree-#2": {
        icon: "๐ฒ",

        name: "๊ฝค ํผํผํ๊ฒ ์๋ ์๋ก์",
        description: "๊ฝค ๋พฐ์กฑํ๊ฒ ์๋ ๋๋ฌด์ด๋ค. ํฅ๊ธฐ๋ก์ด ํฅ์ด ๋๋ค.",

        survey: true,
        pass: false
    },
    "display-stand": {
        icon: "โฝ",

        name: "์ง์ด๋",
        description: "๋ค์ํ ๋ฌผํ๋ค์ ์ง์ดํ  ์ ์๋ค.",

        survey: true,
        pass: false
    },

    "counter": {
        icon: "๐จ๏ธ",

        name: "์นด์ดํฐ",
        description: "๋ฌผ๊ฑด์ ์ด ๋ ํ๊ธ์ผ๋ก ๊ณ์ฐํ ํ ๊ฑฐ์ค๋ฆ๋์ ์ค์ผ ํ  ๋ ์ฌ์ฉ๋๋ ๊ธฐ๊ณ์ด๋ค.",

        survey: false,
        pass: false
    }
};