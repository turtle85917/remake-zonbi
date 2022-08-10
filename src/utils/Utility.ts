import fs from "fs";

import { AttachmentBuilder, Colors } from "discord.js";
import { database } from "./Database";

import { item, itemInterpret, option } from "../data/interfaces/static/item";
import { inventoryItem } from "../data/interfaces/data/user";

export function getMaxMileage(level: number) {
    return (level + 2) * level * 100;
}

/**
 * 띄어쓰기를 입력하기 위해 "로 감싸져 있는 얘들을 위해 만든 함수.
 */
export function getArgs(input: string): string[] {
    let marks: string[] = input.match(/"(.*?)"/g);
    let numObj: { [x in number]: string } = {};

    let cnt = 0;
    let result: string[] = [];

    marks?.map(mk => {
        let replace = input.replace(mk, `T${cnt}`);
        numObj[replace.split(' ').indexOf(`T${cnt}`)] = mk;
        input = replace; cnt++;
    });

    result = input.split(/ +/g);
    for (const [k, v] of Object.entries(numObj)) {
        result[k] = v.replace(/"/g, "");
    }

    return result;
}

export function getBar(current: number, maximum: number, percent: boolean = false, length: number = 10, color: string = "⬛"): string {
    let percent_ = current / maximum;
    let progress = Math.floor(percent_ * length);

    let valid = new Array(progress).fill(color).join("");
    let expire = new Array(length - progress).fill("⬛").join("");

    return valid + expire
        + (percent ? " " + String(Math.floor(percent_ * 100)) + "%" : "");
}

export function errorEmbed(content: string): any {
    return [
        {
            title: "![term.error]".format(),
            description: content.format(),
            color: Colors.Red
        }
    ]
}

/**
 * "   "로 정렬해줌.
 */
export function sort(input: string, size: number = 1): string {
    let txt = ("   ").repeat(size);
    return `${input}${txt.slice(0, txt.length - input.length)}`
}

/**
 * 한국 시간 대 반환.
 */
export function koreanTimeZone() {
    let curr = new Date();

    let utc = 
      curr.getTime() + 
      (curr.getTimezoneOffset() * 60 * 1000);

    let KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    let kr_curr =  new Date(utc + (KR_TIME_DIFF));

    return kr_curr;
}

/**
 * min ≤ (quantity) < max
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 아이템을 찾습니다.
 */
export async function findItem(staticId: string): Promise<itemInterpret> {
    let item: item[] = await database("static-item").where({ staticId });

    if (!item.length) throw Error("Not found item");
    return { staticId, data: JSON.parse(item[0].data), options: JSON.parse(item[0].options) };
}

/**
 * 인벤토리에 아이템을 넣습니다.
 */
export async function newItem(inventory: inventoryItem[], staticId: string, quantity: number): Promise<inventoryItem[]> {
    let item = await findItem(staticId);
    
    let find = inventory.find(d => d.staticId === item.staticId && JSON.stringify(d.options) === JSON.stringify(item.options));
    if (!find) {
        let newUUID = getRandomInt(100000, 1000000);
        while (inventory.find(d => d.UUID === newUUID)) {
            newUUID = getRandomInt(100000, 1000000);
        }

        inventory.push({ staticId, quantity: 0, options: item.options, UUID: newUUID });
        find = inventory.find(d => d.staticId === item.staticId && JSON.stringify(d.options) === JSON.stringify(item.options));
    }

    find.quantity += quantity;
    return inventory;
}

export function getFileUUID(path: string) {
    let newUUID = getRandomInt(100000, 1000000);
    while (fs.existsSync(path.format({ UUID: String(newUUID) }))) {
        newUUID = getRandomInt(100000, 1000000);
    }

    return newUUID;
}

export function getAvatar(UUID: string) {
    let filePath = `${process.cwd()}/src/data/images/{UUID}.png`.format({ UUID });
    let buffer = fs.readFileSync(filePath);

    return new AttachmentBuilder(buffer, { name: "profile.png" });
}

/**
 * 포만감에 따라 회복 속도 결정.
 */
export function satietyToHealth(satiety: number): number {
    let result: number = (1 / (1 - satiety)) * 0.75;
    if (result > 7.2) result = (10 * 0.3 * satiety) + 9;

    return Math.ceil(result);
}

/**
 * 인벤토리에서 아이템을 찾아요.
*/
export function getItem(inventory: inventoryItem[], staticId: string, options?: option): inventoryItem {
    let find = inventory.find(d => d.staticId == staticId &&
        (options ? JSON.stringify(d.options) === JSON.stringify(options) : true));
    return find;
}

/**
 * 인벤토리의 들어있는 아이템의 총 무게.
 */
export async function getWeight(inventory: inventoryItem[]): Promise<number> {
    let weight = 0;

    for (const item of inventory) {
        let item_ = await findItem(item.staticId);
        weight += item_.data.weight * item.quantity;
    }

    return weight;
}

/**
 * 아이템을 얻을 경우 출력될 메시지를 만들어요.
 */
export async function logGetItem(list: { staticId: string; quantity: number; after: number; }[]): Promise<string> {
    let result = [];
    for (const data of list) {
        let item = await findItem(data.staticId)
        result.push(`\`${data.after < 0 ? "❌" : "✅"}\`｜[${item.data.icon} ${item.data.name}] [${addNumberUnit(data.quantity)}] [= ${data.after}개]`);
    }

    return result.join("\n");
}

/**
 * 값에 따라 부호를 붙입니다.
 */
export function addNumberUnit(value: number): string {
    return (value > 0 ? "+" : value < 0 ? "-" : "") + String(Math.abs(value));
}

/**
 * 단위 무게를 구합니다.
 */
export function getWeightUnit(gram: number): string {
    let torn = Number(String(gram / 1000000).slice(0, 4));
    if (gram > 999999) return String(torn.toLocaleString()) + "t";

    let kilogram = Number(String(gram / 1000).slice(0, 4));
    if (gram > 999) return String(kilogram.toLocaleString()) + "㎏";

    return String(gram.toLocaleString()) + "g";
}

export function timeFormat(value: number, recent: boolean = false): string {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);

    if (betweenTime < 1 && recent) return "방금";

    if (betweenTime < 60) {
        return `${betweenTime}분`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간`;
    }

    return `${Math.floor(betweenTime / 60 / 24)}일`;
}