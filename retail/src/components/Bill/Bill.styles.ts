import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStylesBill = makeStyles((theme: Theme) =>
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
            padding: '0 1em',
        },
        edgeTopRow: {
            padding: '0.25em 0',
        },
        firstTopRow: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        firstTopRowElement: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.65em 0'
        },
        topRow: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.65em 0',
        },
        topRowStore: {
            fontWeight: 'bold',
            fontSize: '1.2em',
        },
        icon: {
            marginRight: '0.5em',
        },
        middleContainer: {
            padding: '0 0 0 1em',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        middleRow: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.9em',
            padding: '0.25em 1em 0.25em 0',
        },
        middleRowElement: {
            display: 'flex',
        },
        middleRowText: {
            flex: 9,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '1em',
        },
        middleRowName: {
            fontSize: '1.2em',
        },
        middleRowActions: {
            flex: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            margin: '0.25em 0 0.25em 1em',
        },
        middleRowButton: {
            padding: '0',
            margin: '0 0.25em',
            height: 'auto',
        },
        middleRowIcon: {
            fontSize: '1.2em',
        },
        middleRowDeleteIcon: {
            color: theme.palette.error.main,
        },
        middleRowDivider: {
            marginRight: '1em',
            backgroundColor: '#f1f1f1',
        },
        cardActions: {
            padding: '0 0 0.5em 0',
        },
        bottomContainer: {
            width: '100%',
        },
        bottomContainerText: {
            padding: '0 1em',
            fontSize: '1.2em',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
        }
    }),
);

export { useStylesBill };