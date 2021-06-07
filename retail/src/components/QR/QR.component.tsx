import React, { useEffect } from 'react';
import { useStylesQR } from './QR.styles';
import Card from '@material-ui/core/Card';
import { Button, Divider, IconButton, TextField } from '@material-ui/core';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import { QRProps } from './QR.props';
import { Bill } from '../../shared/models/bill.model';
import { Product } from '../../shared/models/product.model';

function QRComponent(props: QRProps) {
    const styles = useStylesQR();
    let QRCode = require('qrcode.react');
    const [quantity, setQuantity] = React.useState<number>(1);
    const [barcode, setBarcode] = React.useState<string>('');
    const [isValidBarcode, setIsValidBarcode] = React.useState<boolean>(true);


    useEffect(() => {
        console.log('Initializing QR component')
        setQuantity(1);
        setBarcode('');
        setIsValidBarcode(true);
    }, [props.initializeObserver])

    function decreaseQuantity() {
        console.log('Decreasing current product quantity');
        setQuantity(Math.max(1, quantity - 1));
    }

    function increaseQuantity() {
        console.log('Increasing current product quantity');
        setQuantity(Math.min(Bill.maxQuantity, quantity + 1));
    }

    function handleQuantityChange(event: any) {
        console.log('Current product quantity changed');
        setQuantity(event.target.value);
    }

    function handleBarcodeChange(event: any) {
        console.log('Current product barcode changed');
        setBarcode(event.target.value);
    }

    function validateQuantity(): boolean {
        // console.log('Checking current product quantity validity');
        return quantity > 0 && quantity < Bill.maxQuantity;
    }

    function findProductByBarcode(): Product | undefined {
        // console.log('Checking current product barcode validity');
        const product = props.storeProducts.find(p => p.barcode === barcode);
        setIsValidBarcode(!!product);
        return product;
    }

    function addProduct() {
        const isValidQuantity = validateQuantity();
        const productToAdd = findProductByBarcode();
        if (isValidQuantity && isValidBarcode && productToAdd) {
            props.addProductCallback(new Product(productToAdd.barcode, productToAdd.name, productToAdd.price, quantity));
            setBarcode('');
            setQuantity(1);
            setIsValidBarcode(true);
        }
    }

    return (
        <Card className={styles.root}>
            <div>
                <div className={styles.logoContainer}>
                    <img className={styles.logo} src={'assets/img/partner-logo.png'} alt='logo'/>
                </div>

                <Divider/>

                <div className={styles.topContainer}>
                    <div className={styles.topQuantityRow}>
                        <TextField id="quantity" type="number" label="Quantity" variant="outlined"
                                   value={quantity}
                                   error={!validateQuantity()}
                                   onChange={handleQuantityChange}
                                   className={styles.topInput}>`</TextField>
                        <div>
                            <IconButton aria-label="decrease" onClick={decreaseQuantity}>
                                <RemoveCircleOutline fontSize="large"/>
                            </IconButton>
                            <IconButton aria-label="increase" onClick={increaseQuantity}>
                                <AddCircleOutline fontSize="large"/>
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.topBarcodeRow}>
                        <TextField id="barcode" type="number" aria-valuemin={0} label="Barcode" variant="outlined"
                                   value={barcode}
                                   error={!isValidBarcode}
                                   onChange={handleBarcodeChange}
                                   className={styles.topInput}/>
                        <div>
                            <Button variant="contained" size="large" color="primary" className={styles.topAddButton}
                                    onClick={addProduct}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider/>
            </div>

            <div className={styles.middleContainer}>
                <div className={styles.QRCodeContainer}>
                    {
                        props.bill.products.length > 0 &&
                        <QRCode size={1000} value={props.bill.toJSON()} className={styles.QRCode}/>
                    }
                </div>


                <div>
                    <div className={styles.middleText}>
                        {
                            props.bill.products.length > 0
                                ? 'Scan this QR code'
                                : 'Start scanning products'
                        }
                    </div>
                    <div className={styles.middleHelperText}>
                        {
                            props.bill.products.length > 0
                                ? 'With your Billit mobile App'
                                : 'And open your Billit mobile App'
                        }
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default QRComponent;