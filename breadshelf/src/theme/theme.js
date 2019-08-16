import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#c798d2',
            contrastText: "#ffffff"
        },
        seconday: {
            main: '#ffffff',
            contrastText: "#ffffff"
        },
        accent: {
            main: '#ffffff',
            contrastText: "#ffffff"
        }
    }
});

export default theme;