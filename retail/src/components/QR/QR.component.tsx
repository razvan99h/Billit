import React, { useEffect, useRef } from 'react';
import { useStylesQR } from './QR.styles';
import Card from '@material-ui/core/Card';
import { Button, Divider, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { AddCircleOutline, Close, RemoveCircleOutline } from '@material-ui/icons';
import { QRProps } from './QR.props';
import { Bill } from '../../shared/models/bill.model';
import { Product } from '../../shared/models/product.model';

function QRComponent(props: QRProps) {
    const styles = useStylesQR();
    let QRCode = require('qrcode.react');
    let barcodeInput = useRef(null);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [barcode, setBarcode] = React.useState<string>('');
    const [isValidBarcode, setIsValidBarcode] = React.useState<boolean>(true);
    const [billJSON, setBillJSON] = React.useState<string>('');

    useEffect(() => {
        console.log('Initializing QR component')
        setQuantity(1);
        setBarcode('');
        setIsValidBarcode(true);
        setBillJSON(props.bill.toJSON());
        if (barcodeInput.current) {
            // @ts-ignore
            barcodeInput.current.focus();
        }
    }, [props.initializeObserver, props.bill])

    function preventButtonFocus(e: any) {
        e.preventDefault();
    }

    function decreaseQuantity(e: any) {
        console.log('Decreasing current product quantity');
        setQuantity(Math.max(1, quantity - 1));
        e.preventDefault();
    }

    function increaseQuantity(e: any) {
        console.log('Increasing current product quantity');
        setQuantity(Math.min(Bill.maxQuantity, quantity + 1));
        e.preventDefault();
    }

    function handleQuantityChange(event: any) {
        console.log('Current product quantity changed');
        setQuantity(event.target.value);
    }

    function handleBarcodeChange(event: any) {
        console.log('Current product barcode changed');
        setBarcode(event.target.value);
        setIsValidBarcode(true);
    }

    function handleEnter(event: any) {
        if (event.key === 'Enter') {
            console.log('Product entered');
            addProduct();
        }
    }

    function clearBarcode() {
        setBarcode('');
        setIsValidBarcode(true);
    }

    function validateQuantity(): boolean {
        // console.log('Checking current product quantity validity');
        try {
            parseFloat(quantity.toString());
        } catch (e) {
            return false;
        }
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
            props.addProductCallback(new Product(
                productToAdd.barcode,
                productToAdd.name,
                productToAdd.price,
                productToAdd.category,
                parseFloat(quantity.toString()))
            );
            setBarcode('');
            setQuantity(1);
            setIsValidBarcode(true);
            setBillJSON(props.bill.toJSON());
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
                            <IconButton aria-label="decrease"
                                        onMouseDown={preventButtonFocus}
                                        onClick={decreaseQuantity}>
                                <RemoveCircleOutline fontSize="large"/>
                            </IconButton>
                            <IconButton aria-label="increase"
                                        onMouseDown={preventButtonFocus}
                                        onClick={increaseQuantity}>
                                <AddCircleOutline fontSize="large"/>
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.topBarcodeRow}>
                        <TextField id="barcode-input" variant="outlined" label="Barcode"
                                   autoFocus
                                   inputRef={barcodeInput}
                                   value={barcode}
                                   error={!isValidBarcode}
                                   onChange={handleBarcodeChange}
                                   onKeyPress={handleEnter}
                                   className={styles.topInput}
                                   InputProps={
                                       barcode !== ''
                                           ? {
                                               endAdornment: <InputAdornment position="end">
                                                   <IconButton
                                                       onMouseDown={preventButtonFocus}
                                                       onClick={clearBarcode}>
                                                       <Close/>
                                                   </IconButton>
                                               </InputAdornment>,
                                           }
                                           : {}
                                   }
                        />
                        <div>
                            <Button variant="contained" size="large" color="primary"
                                    className={styles.topAddButton}
                                    onMouseDown={preventButtonFocus}
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
                        <QRCode size={1000} value={billJSON} className={styles.QRCode}/>
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