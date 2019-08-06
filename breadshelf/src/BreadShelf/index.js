import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import CurrentReadBase from './CurrentReadBase.js';
import * as ROUTES from '../constants/routes.js';
import { withRouter } from 'react-router-dom';
import theme from './../theme/theme.js';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase/index.js';
import './index.css';

const BreadShelf = () => (
    <MuiThemeProvider theme={theme}>
        <div className="Content">
            <SignOutButton />
            <h1 className="Header">breadshelf</h1>
            <CurrentRead />
        </div>
    </MuiThemeProvider>
);

class SignOutButtonBase extends Component {
    constructor(props) {
        super(props);

        this.props.firebase.checkOnAuthStateChanged(authUser => {
            if(!authUser) {
                this.props.history.push(ROUTES.LANDING);
            }
        });

        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        this.props.firebase.doSignOut().then(user => this.props.history.push(ROUTES.LANDING));
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                    <Button variant="contained" 
                            color="primary"
                            onClick={this.signOut}>
                        Sign Out
                    </Button>
            </MuiThemeProvider>
        );
    }
}

const SignOutButton = withRouter(withFirebase(SignOutButtonBase));
const CurrentRead = withRouter(withFirebase(CurrentReadBase));

export default BreadShelf;