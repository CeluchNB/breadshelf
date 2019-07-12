import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import firebase, { auth } from './../Firebase/firebase.js';
import * as ROUTES from '../constants/routes.js';
import { Link } from 'react-router-dom';
import theme from './../theme/theme.js';
import { MuiThemeProvider } from '@material-ui/core/styles';

class BreadShelf extends Component {
    constructor(props) {
        super(props);

        let user = auth.currentUser;
        if (user === null) {
            auth.onAuthStateChanged(authUser => {
                if(!authUser) {
                    this.props.history.push("/");
                } else {

                }
            });
        }

        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        auth.signOut();
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Link to={ROUTES.LANDING}>
                    <Button variant="contained" 
                            color="primary"
                            onClick={this.signOut()}>
                        Sign Out
                    </Button>
                </Link>
            </MuiThemeProvider>
        );
    }
}

export default BreadShelf;