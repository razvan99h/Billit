import { Bill } from '../../shared/models/bill.model';
import { Product } from '../../shared/models/product.model';

export interface QRProps {
    bill: Bill;
    storeProducts: Array<Product>;
    addProductCallback: any;
    initializeObserver: number;
}