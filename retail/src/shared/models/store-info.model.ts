import { Product } from './product.model';

export interface StoreInfo {
    storeName: string;
    products: Array<Product>;
    currency: string;
}