import React, { useEffect } from 'react';
import { useStylesHomepage } from './Homepage.styles';
import { DatabaseService } from '../../shared/services/database.service';
import { Product } from '../../shared/models/product.model';
import NavbarComponent from '../Navbar/Navbar.component';
import BillComponent from '../Bill/Bill.component';
import QRComponent from '../QR/QR.component';
import { Bill } from '../../shared/models/bill.model';

function HomepageComponent() {
    const styles = useStylesHomepage();
    const [storeProducts, setStoreProducts] = React.useState<Array<Product>>([]);
    const [storeName, setStoreName] = React.useState<string>('');
    const [currency, setCurrency] = React.useState<string>('');
    const [scrollToBottomObserver, setScrollToBottomObserver] = React.useState<number>(0);
    const [initializeObserver, setInitializeObserver] = React.useState<number>(0);
    const [bill, setBill] = React.useState<Bill>(new Bill(storeName, currency));

    useEffect(() => {
        DatabaseService.getStoreInfo().then(storeInfo => {
            console.log('Getting store info');
            setStoreProducts(storeInfo.products);
            setStoreName(storeInfo.storeName);
            setCurrency(storeInfo.currency);
            setBill(new Bill(storeInfo.storeName, storeInfo.currency));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function decreaseQuantity(barcode: string) {
        const index = bill.products.findIndex(p => p.barcode === barcode);
        console.log('Decreasing quantity for product with index: ', index);
        bill.products[index].quantity = Math.max(1, bill.products[index].quantity - 1);
        setBill(Bill.copy(bill));
    }

    function increaseQuantity(barcode: string) {
        const index = bill.products.findIndex(p => p.barcode === barcode);
        console.log('Increasing quantity for product with index: ', index);
        bill.products[index].quantity = Math.min(Bill.maxQuantity, bill.products[index].quantity + 1);
        setBill(Bill.copy(bill));
    }

    function removeProduct(barcode: string) {
        const index = bill.products.findIndex(p => p.barcode === barcode);
        console.log('Removing product with index: ', index);
        bill.products.splice(index, 1);
        setBill(Bill.copy(bill));
    }

    function addProduct(product: Product) {
        console.log('Adding product: ', product);
        setScrollToBottomObserver(scrollToBottomObserver + 1);
        const foundProductIndex = bill.products.findIndex(p => p.barcode === product.barcode);
        if (foundProductIndex !== -1) {
            bill.products[foundProductIndex].quantity += product.quantity;
        } else {
            bill.products.push(product);
        }
        setBill(Bill.copy(bill));
    }

    function refreshBill() {
        console.log('Refreshing bill');
        setBill(new Bill(storeName, currency));
        setInitializeObserver(initializeObserver + 1);
    }

    return (
        <div className={styles.root}>
            <NavbarComponent storeName={storeName} refreshCallback={refreshBill}/>
            <main className={styles.main}>
                <div className={styles.inner}>
                    <BillComponent bill={bill}
                                   decreaseQuantityCallback={decreaseQuantity}
                                   increaseQuantityCallback={increaseQuantity}
                                   removeProductCallback={removeProduct}
                                   scrollToBottomObserver={scrollToBottomObserver}/>
                    <QRComponent bill={bill}
                                 storeProducts={storeProducts}
                                 addProductCallback={addProduct}
                                 initializeObserver={initializeObserver}/>
                </div>
            </main>

        </div>
    );
}

export default HomepageComponent;