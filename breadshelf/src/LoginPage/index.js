import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../constants/routes.js';
import * as ERRORSTRINGS from '../constants/errorstrings.js';
import { validateUsername, validateEmail } from './../Utils/ValidateUtils';
import theme from './../theme/theme';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
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

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            disabled: false,
            errorMsg: "",
            usernameError: false,
            passwordError: false,
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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

    handleKeyPress = (e) => {
        if ( e.key === 'Enter') {
            this.trySignIn();
        }
    }

    trySignIn() {
        this.setState({ disabled: true });
        this.getEmailFromUsernameField().then(res => {
            if(!this.state.usernameError) {
                this.props.firebase
                    .doSignInWithEmailAndPassword(res, this.state.password)
                    .then(authUser => {
                        this.props.history.push(ROUTES.BREADSHELF);
                    }).catch(error => {
                        if(error.code === "auth/user-not-found") {
                            this.setState({
                                disabled: false,
                                usernameError: true,
                                errorMsg: ERRORSTRINGS.USERNAME_LOGIN_DNE
                            });
                        } else {
                            this.setState({
                                disabled: false,
                                passwordError: true,
                                errorMsg: ERRORSTRINGS.PASSWORD_LOGIN_INVALID
                            });
                        }
                    });
            } else {
                this.setState({
                    disabled: false
                });
            }
        });
    }

    async getEmailFromUsernameField() {
        if(validateEmail(this.state.username)) {
            return this.state.username;
        } 
        else if (validateUsername(this.state.username)) {
            var email = "";
            await this.props.firebase.getUserByUsername(this.state.username)
                .then(querySnap => {
                    if(querySnap.empty) {
                        this.setState({ 
                            usernameError: true,
                            errorMsg: ERRORSTRINGS.USERNAME_LOGIN_DNE
                        });
                    } else {
                        querySnap.forEach(doc => {
                            email = doc.data().email;
                        });
                    }
                });
            return email;
        }
        else {
            this.setState({ 
                usernameError: true,
                errorMsg: ERRORSTRINGS.USERNAME_LOGIN_DNE
            });
            return "";
        }
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
                            onKeyPress={ this.handleKeyPress }
                            onChange={
                                (e) => {
                                    this.handleEmailChange(e);
                                    this.setState({ usernameError: false });
                                }
                            }
                            error={this.state.usernameError}
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
                            onKeyPress={ this.handleKeyPress }
                            onChange={
                                (e) => {
                                    this.handlePasswordChange(e);
                                    this.setState({ passwordError: false });
                                }
                            }
                            error={this.state.passwordError}
                            value={this.state.password}
                        />
                    </div> 
                </div>
                <p style={{
                    display: this.state.passwordError || this.state.usernameError ? "block" : "none",
                    color: "red"
                    }}>
                    {this.state.errorMsg}
                </p>
                <div className="LogInButton">
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={this.trySignIn}
                        disabled={this.state.disabled}>
                        Sign In
                    </Button>
                </div>
                <div className="CreateButton">
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