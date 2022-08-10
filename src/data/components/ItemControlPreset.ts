import { findItem } from "../../utils/Utility";

type componentsType = { type: number; components: any[] };

export async function getItemControlPresetComponents(staticId: string, customId: string): Promise<componentsType[]> {
    let itemInfo = await findItem(staticId);

    let components: componentsType[] = [];
    let selectMenu: componentsType = { type: 1, components: [] };

    if (itemInfo.data.deletable) {
        components = componentsAddNewLine(components);
        components[0].components.push({
            type: 2,
            style: 1,
            customId: customId.format({ action: "dump" }),
            emoji: { name: "🗑️" },
            label: "![term.action.item.dump]".format()
        })
    }

    if (itemInfo.options.coupon) {
        selectMenu.components.push({ type: 3, customId: customId.format({ action: "coupon" }), options: [], placeholder: "![command.inventory.action.coupon.placeholder]".format() })
        for (const [k, v] of Object.entries(itemInfo.options.coupon)) {
            let trades = Object.entries(v);
            let item = await findItem(trades[0][0]);

            selectMenu.components[0].options.push({
                label: item.data.name,
                description: "![command.inventory.action.coupon.need-item]".format({ quantity: k }),
                emoji: { name: item.data.icon },
                value: "s" + k
            });
        }

        components.unshift(selectMenu);
    }

    return components;
}

function componentsAddNewLine(components: componentsType[]) {
    if (!components.length) {
        components.push({
            type: 1, components: []
        });
    }

    return components;
}