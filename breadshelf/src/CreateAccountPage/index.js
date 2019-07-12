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

class CreateAccountPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstNameStyle: { width: "15%", marginRight: "2%" },
            lastNameStyle: { width: "15%" },
            largeFieldStyle: { width: "32%" }
        }
        console.log(window.innerWidth);
    }

    createAccount() {
        console.log("creating");
    }

    updateStyles() {
        console.log(window.innerWidth);
        if(window.innerWidth > 800 ) {
            this.setState({
                firstNameStyle: { width: "15%", marginRight: "2%" },
                lastNameStyle: { width: "15%" },
                largeFieldStyle: { width: "32%" }
            });
        } else {
            this.setState({
                firstNameStyle: { width: "60%", display: "flex-block"},
                lastNameStyle: { width: "60%", display: "flex-block" },
                largeFieldStyle: { width: "60%" }
            });
        }
    }

    componentDidMount() {
        this.updateStyles();
        window.addEventListener("resize", this.updateStyles.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateStyles.bind(this));
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="CreateAccountPage">
                    <h1 className="Header">create account</h1>
                    <TextField
                        id="firstname-input"
                        label="First Name"
                        type="text"
                        name="firstname"
                        autoComplete="firstname"
                        margin="normal"
                        variant="outlined"
                        autoFocus={true}
                        style={ this.state.firstNameStyle }
                        required
                        onChange={
                            (event) => { 
                                this.setState({ firstname: event.target.value });
                            }
                        }
                        value={this.state.firstname}
                    />
                    <TextField
                        id="lastname-input"
                        label="Last Name"
                        type="text"
                        name="lastname"
                        autoComplete="lastname"
                        margin="normal"
                        variant="outlined"
                        style={ this.state.lastNameStyle }
                        required
                        onChange={
                            (event) => {
                                this.setState({ lastname: event.target.value });
                            }
                        }
                        value={this.state.lastname}
                    />
                    <div>
                        <TextField
                            id="email-input"
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                            style={ this.state.largeFieldStyle }
                            required
                            onChange={
                                (event) => {
                                    this.setState({ email: event.target.value });
                                }
                            }
                            value={this.state.email}
                        />
                    </div>
                    <div>
                        <TextField
                            id="username=input"
                            label="Username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            margin="normal"
                            variant="outlined"
                            style={ this.state.largeFieldStyle }
                            required
                            onChange={
                                (event) => {
                                    this.setState({ username: event.target.value });
                                }
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
                            style={ this.state.largeFieldStyle }
                            required
                            onChange={
                                (event) => {
                                    this.setState({ password: event.target.value });
                                }
                            }
                            value={this.state.password}
                        />
                    </div>
                    <div>
                        <TextField
                            id="confirm-password-input"
                            label="Confirm Password"
                            type="password"
                            name="confirm-password"
                            autoComplete="confirmpassword"
                            margin="normal"
                            variant="outlined"
                            style={ this.state.largeFieldStyle }
                            required
                            onChange={
                                (event) => {
                                    this.setState({ confirmPassword: event.target.value });
                                }
                            }
                            value={this.state.confirmPassword}
                        />
                    </div>
                    <div className="CreateAccountButtons">
                        <div>
                            <Button
                                variant="contained"
                                color="primary">
                                Create
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="text"
                                color="primary"
                                component={AdapterLink}
                                to={ROUTES.LANDING}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default CreateAccountPage;