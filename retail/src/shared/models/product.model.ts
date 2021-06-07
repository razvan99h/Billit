export class Product {
    barcode: string;
    name: string;
    price: number;
    quantity: number;
    category: string;

    constructor(barcode: string, name: string, price: number, category: string, quantity: number = 1) {
        this.barcode = barcode;
        this.name = name;
        this.price = price;
        this.category = category;
        this.quantity = quantity;
    }

    static fromDatabaseJSON(json: any) {
        return new Product(json['barcode'], json['name'], json['price'], json['category']);
    }

    toJSON(): string {
        // override of JSON.stringify
        const json = {
            n: this.name,
            p: this.price,
            q: this.quantity,
            c: this.category,
        };
        return JSON.stringify(json);
    }

    computeTotal(): string {
        return (this.quantity * this.price).toFixed(2);
    }
}