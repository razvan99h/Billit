export interface StatisticsRequest {
  currency: string;
  timeZone: string;
  from?: string;
  to?: string;
  date?: string;
  month?: string;
}

export enum StatisticsRequestType {
  categories = 'categories',
  stores = 'stores'
}
