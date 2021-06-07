import React, { useEffect, useRef } from 'react';
import { useStylesBill } from './Bill.styles';
import Card from '@material-ui/core/Card';
import { CardActions, Divider, IconButton } from '@material-ui/core';
import {
    AddCircleOutline,
    DateRange,
    DeleteOutline,
    Fingerprint,
    LocalGroceryStore,
    RemoveCircleOutline,
    Schedule
} from '@material-ui/icons';
import { BillProps } from './Bill.props';

function BillComponent(props: BillProps) {
    const styles = useStylesBill();
    const scrollableBottomRef = useRef(null);
    const [date, setDate] = React.useState<Date>(new Date());

    useEffect(() => {
        scrollToBottom();
        const timer = setInterval(() => {
            console.log('Updating bill date');
            setDate(new Date());
        }, 5000);
        return () => clearInterval(timer);
    }, [props.scrollToBottomObserver])

    function preventButtonFocus(e: any) {
        e.preventDefault();
    }

    function getDateString(): string {
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString(undefined, dateOptions);
    }

    function getTimeString(): string {
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        return date.toLocaleTimeString(undefined, timeOptions);
    }

    function scrollToBottom() {
        console.log('Scrolling to bottom of bill');
        // @ts-ignore
        scrollableBottomRef.current.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <Card className={styles.root}>
            <div>
                <div className={styles.logoContainer}>
                    <img className={styles.logo} src={'assets/img/billit-logo.png'} alt='logo'/>
                </div>

                <Divider/>

                <div className={styles.topContainer}>
                    <div className={styles.edgeTopRow}/>
                    <div className={styles.firstTopRow}>
                        <div className={styles.firstTopRowElement}>
                            <DateRange className={styles.icon}/>
                            {getDateString()}
                        </div>
                        <div className={styles.firstTopRowElement}>
                            <Schedule className={styles.icon}/>
                            {getTimeString()}
                        </div>
                    </div>
                    <div className={`${styles.topRow} ${styles.topRowStore}`}>
                        <LocalGroceryStore className={styles.icon}/>
                        {props.bill.store}
                    </div>
                    <div className={styles.topRow}>
                        <Fingerprint className={styles.icon}/>
                        {props.bill.number}
                    </div>
                    <div className={styles.edgeTopRow}/>
                </div>

                <Divider/>
            </div>

            <div className={styles.middleContainer}>
                {
                    props.bill.products.map((product, index) => {
                        return (
                            <div key={product.barcode}>
                                <div className={styles.middleRow}>
                                    <div className={styles.middleRowElement}>
                                        <div className={styles.middleRowText}>
                                            <span className={styles.middleRowName}>{product.name}</span>
                                            <span>Qty: {product.quantity}</span>
                                        </div>
                                        <div className={styles.middleRowActions}>
                                            <IconButton aria-label="decrease" className={styles.middleRowButton}
                                                        onMouseDown={preventButtonFocus}
                                                        onClick={() => props.decreaseQuantityCallback(product.barcode.toString())}>
                                                <RemoveCircleOutline className={styles.middleRowIcon}/>
                                            </IconButton>
                                            <IconButton aria-label="increase" className={styles.middleRowButton}
                                                        onMouseDown={preventButtonFocus}
                                                        onClick={() => props.increaseQuantityCallback(product.barcode.toString())}>
                                                <AddCircleOutline className={styles.middleRowIcon}/>
                                            </IconButton>
                                        </div>
                                    </div>

                                    <div className={styles.middleRowElement}>
                                        <div className={styles.middleRowText}>
                                            <span>{product.quantity} x {product.price}</span>
                                            <span>{product.computeTotal()} {props.bill?.currency}</span>
                                        </div>
                                        <div className={styles.middleRowActions}>
                                            <IconButton aria-label="delete" className={styles.middleRowButton}
                                                        onMouseDown={preventButtonFocus}
                                                        onClick={() => props.removeProductCallback(product.barcode)}>
                                                <DeleteOutline
                                                    className={`${styles.middleRowIcon} ${styles.middleRowDeleteIcon}`}/>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                                {
                                    index !== props.bill.products.length - 1 &&
                                    <Divider className={styles.middleRowDivider}/>
                                }
                            </div>
                        );
                    })
                }
                <div ref={scrollableBottomRef}/>
            </div>


            <CardActions className={styles.cardActions}>
                <div className={styles.bottomContainer}>
                    <Divider/>
                    <div className={styles.bottomContainerText}>
                        <p>TOTAL</p>
                        <p>{props.bill.computeTotal()} {props.bill.currency}</p>
                    </div>
                </div>

            </CardActions>
        </Card>
    );
}

export default BillComponent;