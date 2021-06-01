import { Product } from './product.model';

export class Bill {
  // tslint:disable-next-line:variable-name
  _id: string;
  store: string;
  number: string;
  date: Date;
  total: number;
  products: Array<Product>;

  constructor(id: string, store: string, billNumber: string, date: Date, total: number, products: Array<Product>) {
    this._id = id;
    this.store = store;
    this.number = billNumber;
    this.date = date;
    this.total = total;
    this.products = products;
  }

  static fromJSON(json: any): Bill {
    const date = new Date(json.date);
    const products = json.products.map(productJSON => Product.fromJSON(productJSON));
    return new Bill(json._id, json.store, json.number, date, json.total, products);
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
      hour: '2-digit',
      minute: '2-digit',
    };
    return this.date.toLocaleTimeString(undefined, timeOptions);
  }
}
