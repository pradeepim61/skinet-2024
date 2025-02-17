import {nanoid} from 'nanoid';

export type CartType ={
    id: string;
    items: Cartitem[];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
}

export type Cartitem ={
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class Cart implements CartType{
    id = nanoid();
    items: Cartitem[] = [];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
}