import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ROUTES from '../constants/routes.js';
import theme from './../theme/theme.js';
import { withFirebase } from '../Firebase/index.js';
import CurrentReadBase from './CurrentReadBase.js';
import BreadshelfListBase from './BreadshelfListBase.js'
import './index.css';

const BreadShelf = () => (
    <MuiThemeProvider theme={theme}>
        <div className="Content">
            <div className="Header">
                <SignOutButton />
                <h1>breadshelf</h1>
            </div>
            <CurrentRead />
            <div className="BreadshelfListContent">
                <WillRead tense="will"/>
                <HaveRead tense="have"/>
            </div>
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
const WillRead = withRouter(BreadshelfListBase);
const HaveRead = withRouter(BreadshelfListBase);

export default BreadShelf;