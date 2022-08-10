export interface scriptContent {
    chatterId: string;

    content: string;
    shortenForm: string;
};

export interface script {
    [part: string]: scriptContent[];
}

export const npcNames: { [part: string]: string } = {
    "new-broken-city-visit": "지하 벙커를 나가는 것을 걱정하는 자들의 대화"
};

export const npcScripts: script = {
    "new-broken-city-visit": [
        { chatterId: "extra-survivor-#1", content: "어디 가려고 하는거야?", shortenForm: "-" },
        { chatterId: "extra-survivor-#2", content: "밖에는 이미 좀비들이 *점령했다고!!!*\n그렇게 무턱대고 나가다가는 좀비 떼들한테 당하고 말걸?", shortenForm: "-" },
        { chatterId: "player", content: "걱정하지 마세요. 제가 알아서 할게요.", shortenForm: "알아서 할게요." },
        { chatterId: "extra-survivor-#1", content: "뭘 알아서 *한다는 거야???*\n무기도 없어 보이는데 그냥 나가면 감염될걸?", shortenForm: "-" },
        { chatterId: "extra-survivor-#3", content: "그래. 무기도 없이 밖에 나가 좀비 떼들한테 덤빈다는 건 말이 안 되지.", shortenForm: "-" },
        { chatterId: "player", content: "무기가 꼭 필요할까요?\n걱정하지 마세요~ 살아서 돌아올게요.", shortenForm: "조심히 다녀올게요." },
        { chatterId: "extra-survivor-#2", content: "살아서 돌아오고 자시고 너도 모르는 사이에 감염된지도 모르고 다시 들어오면 우리들도 다 같이 감염된다?", shortenForm: "-" },
        { chatterId: "player", content: "당연히 알죠.", shortenForm: "당연히 알죠." }
    ]
};