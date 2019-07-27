import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './../Firebase';
import CreateAccountFormBase from './CreateAccountFormBase';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './../theme/theme.js';
import './index.css';

const CreateAccountPage = () => (
    <MuiThemeProvider theme={theme}>
        <div className="CreateAccountPage">
            <h1 className="Header">create account</h1>
            <CreateAccountForm />
        </div>
    </MuiThemeProvider>
);

const CreateAccountForm = withRouter(withFirebase(CreateAccountFormBase));

export default CreateAccountPage;