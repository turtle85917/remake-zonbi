import TravelMap from "../Map";

export default class map extends TravelMap {
    constructor() {
        super();

        this.staticId = "broken-city";

        this.icon = "ποΈ";

        this.name = "ν©νλκ³  νμ λ λμ";
        this.description = "λμκ° ν©νν΄μ§μλ€. κ±΄λ¬Όλ€μ μ¬μ¬ κΈμ΄ κ°κΈ° μμνκ³ , μ€λλ κ±΄λ¬Όμ μ΄λ―Έ λΆκ΄΄ν μ§ μ€λλ€. κ°νΉ κΈΈμ μ±ν¬νμ΄ μλ κ³³λ μλ€. μ’λΉλ€κ³Ό λ§μ μΈμ°κ±°λ λλ§μ³μ λΉ λ₯΄κ² λ³Έλ λͺ©μ μ μννκ³  μ§ν λ²μ»€λ‘ λμκ° μ¬μ.";

        this.baiscPlayerData = {
            positions: {
                "shelter": [9, 5],
                "store": [6, 11]
            },
            type: "important"
        };

        this.doors = [
            {
                mapId: "shelter",
                way: "π³"
            },
            {
                mapId: "store",
                way: "π₯"
            }
        ];

        this.data = [
            ["π³", "π³", "π³", "π³", "π³", "π³", "π³", "π³", "π³", "π³", "π²", "π³", "π²", "π₯", "π₯", "π₯", "π₯", "π₯", "π³", "π³", "π³", "π²", "π³", "π²", "π³", "π²", "π³", "π³", "π³", "π³", "π³"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "π₯", "π₯", "π₯", "π₯", "π₯", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "π₯", "π₯", "π₯", "π₯", "π₯", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "π₯", "π₯", "π₯", "π₯", "π₯", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "π₯", "π²", "π²", "π²", "π₯", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "π³", "π³", "π³", "π³", "π³", "π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π²", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"],
            ["π³", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬", "β¬"]
        ];
    }
}