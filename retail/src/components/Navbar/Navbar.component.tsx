import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { useStylesNavbar } from './Navbar.styles';
import { NavbarProps } from './Navbar.props';
import { RefreshRounded } from '@material-ui/icons';


function NavbarComponent(props: NavbarProps) {
    const styles = useStylesNavbar();

    return (
        <AppBar position="fixed" color="primary" elevation={0} className={styles.appBar}>
            <Toolbar>
                <Typography variant="h6" color="inherit" noWrap
                            className={styles.toolbarTitle}>
                    Billit Retail - {props.storeName}
                </Typography>

                <IconButton
                    color="inherit"
                    onClick={props.refreshCallback}>
                    <RefreshRounded className={styles.refreshIcon}/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default NavbarComponent;