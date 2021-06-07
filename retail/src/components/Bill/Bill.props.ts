import { Bill } from '../../shared/models/bill.model';

export interface BillProps {
    bill: Bill;
    increaseQuantityCallback: any;
    decreaseQuantityCallback: any;
    removeProductCallback: any;
    scrollToBottomObserver: number;
}