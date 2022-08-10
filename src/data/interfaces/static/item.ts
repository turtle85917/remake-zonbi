export interface option {
    coupon?: { [quantity: string]: { [itemName: string]: number } };
}

export interface itemData {
    icon: string;
    name: string;
    description: string;
    category: string;
    weight: number;
    deletable: boolean;
}

export interface item {
    staticId: string;
    data: string;
    options: string;
}

export interface itemInterpret {
    staticId: string;
    data: itemData;
    options: option;
}