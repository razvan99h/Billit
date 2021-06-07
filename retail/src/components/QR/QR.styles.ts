import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStylesQR = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100%',
            width: '30vw',
            minWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1em 1em 0 1em',
        },
        logoContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        logo: {
            maxHeight: '8vh',
            maxWidth: '50%',
            marginBottom: '1em'
        },
        topContainer: {
            padding: '1em 0.25em 1em 1.25em',
        },
        topQuantityRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5em',
        },
        topBarcodeRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        topInput: {
            flex: 1,
            marginRight: '0.5em',
        },
        topAddButton: {
            width: '94px',
            margin: '0 12px',
        },
        middleContainer: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '1.25em 1.25em 2em 1.25em',
        },
        middleText: {
            fontSize: '30px',
            fontWeight: 600,
            textAlign: 'center',
        },
        middleHelperText: {
            fontSize: '14px',
            fontWeight: 500,
            margin: '0.25em 0 0 0',
            textAlign: 'center',
        },
        QRCodeContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // width: '450px',
            // height: '450px',
        },
        QRCode: {
            width: '100% !important',
            height: 'auto !important',
            // margin: '1em 1em 0.5em 1em',
        }
    }),
);

export { useStylesQR };