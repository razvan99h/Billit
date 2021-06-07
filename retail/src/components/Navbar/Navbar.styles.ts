import { makeStyles, Theme } from '@material-ui/core';

const useStylesNavbar = makeStyles((theme: Theme) => ({
    appBar: {
        boxShadow: '0px 6px 7px rgb(0 0 0 / 10%)',
        zIndex: theme.zIndex.drawer + 1,
    },
    toolbarTitle: {
        flexGrow: 1,
        cursor: 'pointer'
    },
    refreshIcon: {
        fontSize: '1.5em',
    }
}));

export { useStylesNavbar };