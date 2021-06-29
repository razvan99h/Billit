import { Currencies } from './enums/currencies';

export class ExchangeRate {
  // tslint:disable-next-line:variable-name
  _id: string;
  base: string;
  rates: Currencies;


  constructor(id: string, base: string, rates: Currencies) {
    this._id = id;
    this.base = base;
    this.rates = rates;
  }

  static fromJSON(json: any): ExchangeRate {
    return new ExchangeRate(json._id, json.base, json.rates);
  }
}
