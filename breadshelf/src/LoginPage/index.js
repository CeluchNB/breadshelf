import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../constants/routes.js';
import theme from './../theme/theme';
import './index.css';
import { MuiThemeProvider } from '@material-ui/core/styles';

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

class LoginPage extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="LoginPage">
                    <div className="HeadContainer">
                        <h1 className="Header">breadshelf</h1>
                    </div>
                    <div className="FormField">
                        <TextField
                            id="outlined-email-input"
                            label="Email or Username"
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            id="outlined-email-input"
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="password"
                            margin="normal"
                            variant="outlined"
                        /> 
                    </div>
                    <Button variant="contained" color="primary" component={AdapterLink} to={ROUTES.BREADSHELF}>
                        Sign In
                    </Button>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default LoginPage;