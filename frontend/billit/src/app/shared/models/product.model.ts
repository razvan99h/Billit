export class Product {
  // tslint:disable-next-line:variable-name
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;

  constructor(id: string, name: string, price: number, quantity: number, category: string) {
    this._id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
  }

  static fromJSON(json: any): Product {
    return new Product(json._id, json.name, json.price, json.quantity, json.category);
  }

  static fromBarcodeJSON(json: any): Product {
    return new Product(null, json.n, json.p, json.q, json.c);
  }

  static empty(): Product {
    return new Product(null, null, null, null, null);
  }

  computeTotal(): number {
    return this.price * this.quantity;
  }
}
