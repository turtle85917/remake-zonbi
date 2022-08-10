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
    "🔲": "door",
    "🔳": "wall",
    "🟥": "store-wall",
    "⬜": "counter-wall",
    "🌳": "tree-#1",
    "🌲": "tree-#2",
    "◽": "display-stand",
    "🖨️": "counter"
};

export const tiles: tile = {
    "door": {
        icon: "🔲",

        name: "문",
        description: "문이다.",

        survey: false,
        pass: false
    },

    "wall": {
        icon: "🔳",

        name: "벽",
        description: "벽이다.",

        survey: false,
        pass: false
    },
    "store-wall": {
        icon: "🟥",

        name: "슈퍼마켓 벽",
        description: "슈퍼마켓 벽이다.",

        survey: false,
        pass: false
    },
    "counter-wall": {
        icon: "⬜",

        name: "카운터 책상",
        description: "카운터 책상이다.",

        survey: false,
        pass: false
    },

    "tree-#1": {
        icon: "🌳",

        name: "울창하고 푸르른 낙엽수",
        description: "나무를 가지치기하면 낙엽과 나뭇가지를 얻을 수 있을 것 같다.",
        
        survey: true,
        pass: false
    },
    "tree-#2": {
        icon: "🌲",

        name: "꽤 튼튼하게 자란 상록수",
        description: "꽤 뾰족하게 자란 나무이다. 향기로운 향이 난다.",

        survey: true,
        pass: false
    },
    "display-stand": {
        icon: "◽",

        name: "진열대",
        description: "다양한 물픔들을 진열할 수 있다.",

        survey: true,
        pass: false
    },

    "counter": {
        icon: "🖨️",

        name: "카운터",
        description: "물건을 살 때 현금으로 계산한 후 거스름돈을 줘야 할 때 사용되는 기계이다.",

        survey: false,
        pass: false
    }
};