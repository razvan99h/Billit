export class Product {
  name: string;
  price: number;
  quantity: number;


  constructor(name: string, price: number, quantity: number) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  static fromJSON(json: any) {
    return new Product(json.name, json.price, json.quantity);
  }

  computeTotal(): number {
    return this.price * this.quantity;
  }
}
