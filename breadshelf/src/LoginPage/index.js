import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase, { auth } from './../Firebase/firebase.js';
import * as ROUTES from '../constants/routes.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './../theme/theme';
import './index.css';

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

class LoginPage extends Component {

    state = {
        username: "",
        password: ""
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
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    trySignIn() {
        auth.signInWithEmailAndPassword(this.state.username, this.state.password)
            .catch(error => console.log(error));
        auth.onAuthStateChanged(authUser => {
            if (authUser) {
                console.log(authUser);
                this.props.history.push(ROUTES.BREADSHELF);
            } else {
                console.log("no user");
            }
        });
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="LoginPage">
                    <div className="HeadContainer">
                        <h1 className="Header">breadshelf</h1>
                    </div>
                    <div className="FormField">
                        <div>
                            <TextField
                                id="outlined-email-input"
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
                                id="outlined-email-input"
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
                            onClick={this.trySignIn}>
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
            </MuiThemeProvider>
        );
    }
}

export default LoginPage;