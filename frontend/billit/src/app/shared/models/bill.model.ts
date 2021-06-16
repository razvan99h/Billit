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
  favorite: boolean;
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
    favorite: boolean,
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
    this.favorite = favorite;
    this.total = total;
    this.products = products;
  }

  static fromJSON(json: any): Bill {
    const date = new Date(json.date);
    const products = json.products.map(productJSON => Product.fromJSON(productJSON));
    return new Bill(json._id, json.store, json.number, json.currency, date, json.type, json.category, json.favorite, json.total, products);
  }

  static fromBarcodeJSON(json: any): Bill {
    const date = new Date(json.d);
    const products = json.p.map(productString => Product.fromBarcodeJSON(JSON.parse(productString)));
    return new Bill(null, json.s, json.n, json.c, date, BILL_TYPES.TRUSTED, null, false, null, products);
  }

  static emptyBill(): Bill {
    return new Bill(null, null, null, null, null, null, null, null, null, []);
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
