import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStylesHomepage = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            backgroundImage: `url('assets/img/background-polygons.png')`,
            backgroundSize: 'cover',
        },
        main: {
            paddingTop: '64px',
            height: 'calc(100% - 64px)',
        },
        inner: {
            '&::before': {
                content: '""',
            },
            '&::after': {
                content: '""',
            },
            flex: 1,
            height: 'calc(100% - 100px)',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '50px',
            paddingBottom: '50px'
        }
    }),
);

export { useStylesHomepage };