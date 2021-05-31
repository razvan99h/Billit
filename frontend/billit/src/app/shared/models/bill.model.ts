import { Product } from './product.model';

export class Bill {
  store: string;
  number: string;
  date: Date;
  total: number;
  products: Array<Product>;


  constructor(store: string, billNumber: string, date: Date, total: number, products: Array<Product>) {
    this.store = store;
    this.number = billNumber;
    this.date = date;
    this.total = total;
    this.products = products;
  }

  static fromJSON(json: any): Bill {
    const date = new Date(json.date);
    const products = json.products.map(productJSON => Product.fromJSON(productJSON));
    return new Bill(json.store, json.number, date, json.total, products);
  }

  getDateString(): string {
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return this.date.toLocaleDateString(undefined, dateOptions);
  }

  getTimeString(): string {
    const timeOptions = {
      minute: '2-digit',
      second: '2-digit',
    };
    return this.date.toLocaleTimeString(undefined, timeOptions);
  }
}
