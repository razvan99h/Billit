import { Product } from './product.model';

export enum BILL_TYPES {
  TRUSTED = 'trusted',
  NORMAL = 'normal'
}

export class Bill {
  // tslint:disable-next-line:variable-name
  _id: string;
  store: string;
  number: string;
  currency: string;
  date: Date;
  type: string;
  category: string;
  total: number;
  products: Array<Product>;

  constructor(
    id: string,
    store: string,
    billNumber: string,
    currency: string,
    date: Date,
    type: string,
    category: string,
    total: number,
    products: Array<Product>
  ) {
    this._id = id;
    this.store = store;
    this.number = billNumber;
    this.currency = currency;
    this.date = date;
    this.type = type;
    this.category = category;
    this.total = total;
    this.products = products;
  }

  static fromJSON(json: any): Bill {
    const date = new Date(json.date);
    const products = json.products.map(productJSON => Product.fromJSON(productJSON));
    return new Bill(json._id, json.store, json.number, json.currency, date, json.type, json.category, json.total, products);
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

  getCategories(): Array<string> {
    const productCategories = Array.from(new Set(this.products.map(p => p.category)));
    console.log(productCategories, this.category);
    if (this.category) {
      return [this.category];
    }
    if (productCategories[0] != null) {
      return productCategories;
    }
    return [];
  }
}
