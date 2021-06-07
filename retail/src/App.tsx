import React from 'react';
import './App.css';
import '@fontsource/roboto';
import HomepageComponent from './components/Homepage/Homepage.component';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';

function App() {
    const theme = React.useMemo(() =>
        createMuiTheme({
            palette: {
                primary: {
                    main: '#c0392b'
                },
                secondary: {
                    main: '#e74c3c',
                },
                background: {
                    default: '#f3f6f8'
                },
                text: {
                    primary: '#606060',
                },
                type: 'light',
            },
        }), []);
    return (
        <ThemeProvider theme={theme}>
            <HomepageComponent/>
        </ThemeProvider>
    );
}

export default App;
