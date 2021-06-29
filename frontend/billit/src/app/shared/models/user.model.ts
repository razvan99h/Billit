export class User {
  // tslint:disable-next-line:variable-name
  _id: string;
  name: string;
  email: string;
  country: string;
  currency: string;

  constructor(id: string, name: string, email: string, country: string, currency: string) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.country = country;
    this.currency = currency;
  }

  static fromJSON(json: any): User {
    return new User(json._id, json.name, json.email, json.country, json.currency);
  }
}

