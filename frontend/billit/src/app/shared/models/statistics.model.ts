export class Statistics {
  total: number;
  labels: Array<string>;
  labelsShort: Array<string>;
  amounts: Array<number>;
  amountsShort: Array<number>;

  constructor(total: number, labels: Array<string>, labelsShort: Array<string>, amounts: Array<number>, amountsShort: Array<number>) {
    this.total = total;
    this.labels = labels;
    this.labelsShort = labelsShort;
    this.amounts = amounts;
    this.amountsShort = amountsShort;
  }

  static fromJSON(json: any): Statistics {
    return new Statistics(json.total, json.labels, json.labelsShort, json.amounts, json.amountsShort);
  }

  static empty(): Statistics {
    return new Statistics(0, [], [], [], []);
  }
}
