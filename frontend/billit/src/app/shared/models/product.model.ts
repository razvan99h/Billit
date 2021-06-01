export class Product {
  // tslint:disable-next-line:variable-name
  _id: string;
  name: string;
  price: number;
  quantity: number;

  constructor(id: string, name: string, price: number, quantity: number) {
    this._id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  static fromJSON(json: any) {
    return new Product(json._id, json.name, json.price, json.quantity);
  }

  computeTotal(): number {
    return this.price * this.quantity;
  }
}
