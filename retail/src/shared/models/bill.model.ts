import { Product } from './product.model';

export class Bill {
    static maxQuantity = 999;
    store: string;
    currency: string;
    number: string;
    products: Array<Product>;

    constructor(store: string, currency: string, number?: string, products?: Array<Product>) {
        this.store = store;
        this.currency = currency;
        this.number = number ? number : '#' + Math.floor(100000 + Math.random() * 900000);
        this.products = products ? products : [];
    }

    static copy(bill: Bill): Bill {
        return new Bill(bill.store, bill.currency, bill.number, bill.products);
    }

    toJSON(): string {
        // override of JSON.stringify
        const obj = {
            s: this.store,
            n: this.number,
            p: this.products,
        };
        return JSON.stringify(obj);
    }

    computeTotal(): string {
        return this.products
            .reduce((accumulator, product) => accumulator + product.price * product.quantity, 0)
            .toFixed(2);
    }
}