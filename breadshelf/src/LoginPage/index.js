import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../constants/routes.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './../theme/theme';
import './index.css';

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const LoginPage = () => (
    <MuiThemeProvider theme={theme}>
        <div className="LoginPage">
            <div className="HeadContainer">
                <h1 className="Header">breadshelf</h1>
            </div>
            <LoginForm />
        </div>
    </MuiThemeProvider>
);

class LoginFormBase extends Component {

    state = {
        username: "",
        password: "",
        disabled: false
    }

    constructor(props) {
        super(props);

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.trySignIn = this.trySignIn.bind(this);
    }

    handleEmailChange = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    trySignIn() {
        this.setState({ disabled: true });
        //check if input is username,
        //if username get email using getUserByUsername
        //user querySnap doc to get email
        this.props.firebase
            .doSignInWithEmailAndPassword(this.state.username, this.state.password)
            .then(authUser => {
                this.props.history.push(ROUTES.BREADSHELF);
            }).catch(error => {
                this.setState({ disabled: false });
                console.log("error");
            });
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateUsername(username) {
        var re = /^[a-z0-9._-]+$/i;
        return re.test(String(username).toLowerCase());
    }

    validatePassword(password) {
        var re = /^[a-z0-9.!@#$%^&*()\[\]_-]+$/i;
        return re.test(String(password).toLowerCase());
    }

    render() {
        return (
            <div>      
                <div className="FormField">
                    <div>
                        <TextField
                            id="email-input"
                            label="Email or Username"
                            type="text"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                            autoFocus={true}
                            required
                            onChange={
                                (e) => this.handleEmailChange(e)
                            }
                            value={this.state.username}
                        />
                    </div>
                    <div>
                        <TextField
                            id="password-input"
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="password"
                            margin="normal"
                            variant="outlined"
                            required
                            onChange={
                                (e) => this.handlePasswordChange(e)
                            }
                            value={this.state.password}
                        />
                    </div> 
                </div>
                <div className="LogInButton">
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={this.trySignIn}
                        disabled={this.state.disabled}>
                        Sign In
                    </Button>
                </div>
                <div className="LogInButton">
                    <Button
                        variant="text"
                        color="primary"
                        component={AdapterLink}
                        to={ROUTES.SIGN_UP}>
                        Create Account
                    </Button>
                </div>
            </div>
        );
    }
}

const LoginForm = withRouter(withFirebase(LoginFormBase));

export { LoginForm, LoginFormBase };

export default LoginPage;