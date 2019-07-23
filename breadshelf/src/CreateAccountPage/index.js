import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import FirebaseContext, { withFirebase } from './../Firebase';
import * as ROUTES from '../constants/routes.js';
import * as ERRORS from '../constants/errors.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './../theme/theme.js';
import './index.css';

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const CreateAccountPage = () => (
    <MuiThemeProvider theme={theme}>
        <div className="CreateAccountPage">
            <h1 className="Header">create account</h1>
            <CreateAccountForm />
        </div>
    </MuiThemeProvider>
);

class CreateAccountFormBase extends Component {
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
            largeFieldStyle: { width: "32%" },
            emailError: false,
            usernameError: false,
            passwordError: false,
            confirmPasswordError: false,
            emptyFieldError: false
        }

        this.createAccount = this.createAccount.bind(this);
    }

    createAccount() {
        this.validateCreateAccountInfo().then(results => {
            if(results.empty) {
                this.props.firebase.doCreateUser(this.state);
            } else {
                results.forEach(error => {
                    console.log(error);
                    switch(error) {
                        case ERRORS.PASSWORDS_DO_NOT_MATCH:
                            this.setState({ confirmPasswordError: true });
                            break;
                        case ERRORS.PASSWORD_IS_TOO_WEAK:
                            this.setState({ passwordError: true });
                            break;
                        case ERRORS.USERNAME_IS_TAKEN:
                            this.setState({ usernameError: true });
                            break;
                        case ERRORS.EMAIL_IS_USED:
                        case ERRORS.EMAIL_INVALID:
                            this.setState({ emailError: true });
                            break;
                        case ERRORS.EMPTY_FIELD:
                            this.setState({ emptyFieldError: true });
                            break;
                        default:
                            console.log("Unknown Error");
                    }
                });
            }
        });
    }

    async validateCreateAccountInfo() {
        var errorList = [];
        
        await this.usernameIsTaken(this.state.username).then(value => {
            if(value === true) {
                errorList.push(ERRORS.USERNAME_IS_TAKEN);
            }
        });
        await this.emailIsUsed(this.state.email).then(value => {
            if(value === true) {
                errorList.push(ERRORS.EMAIL_IS_USED);
            }
        })
        if (this.state.password !== this.state.confirmPassword) {
            errorList.push(ERRORS.PASSWORDS_DO_NOT_MATCH);
        } 
        if (this.isWeakPassword(this.state.password)) {
            errorList.push(ERRORS.PASSWORD_IS_TOO_WEAK);
        }
        if(!this.validateEmail(this.state.email)) {
            console.log(this.validateEmail(this.state.email));
            errorList.push(ERRORS.EMAIL_INVALID);
        }

        if(this.state.firstname === "" || this.state.lastname === "" || this.state.email === ""
            || this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "") {
            errorList.push(ERRORS.EMPTY_FIELD);
        }
        
        return errorList;
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    isWeakPassword(password) {

        if(password.length < 6) {
            return true;
        }

        var noUpper = true;
        var noLower = true;
        var noNumber = true;

        for(var i = 0; i < password.length; i++) {
            if(password.charAt(i) === password.charAt(i).toUpperCase()) {
                noUpper = false;
            }
            if(password.charAt(i) === password.charAt(i).toLowerCase()) {
                noLower = false;
            }
            if(!isNaN(password.charAt(i) * 1)) {
                noNumber = false;
            }
        }

        return noUpper || noLower || noNumber;
    }

    usernameIsTaken(username) {
        return this.props.firebase.usernameExists(username).then(querySnap => {
            if(querySnap.empty) {
                return false;
            } else {
                return true;
            }
        });
    }

    emailIsUsed(email) {
        return this.props.firebase.emailExists(email).then(querySnap => {
            if (querySnap.empty) {
                return false;
            } else {
                return true;
            }
        });
    }

    updateStyles() {
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
            <div className="CreateAccountForm">
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
                            this.setState({ 
                                firstname: event.target.value,
                                emptyFieldError: false
                            });
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
                            this.setState({ 
                                lastname: event.target.value,
                                emptyFieldError: false
                            });
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
                                this.setState({ 
                                    email: event.target.value,
                                    emailError: false,
                                    emptyFieldError: false
                                });
                            }
                        }
                        error={this.state.emailError}
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
                                this.setState({ 
                                    username: event.target.value,
                                    usernameError: false,
                                    emptyFieldError: false 
                                });
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
                        style={ this.state.largeFieldStyle }
                        required
                        onChange={
                            (event) => {
                                this.setState({ 
                                    password: event.target.value,
                                    passwordError: false,
                                    emptyFieldError: false
                                });
                            }
                        }
                        error={this.state.passwordError}
                        value={this.state.password}
                    />
                </div>
                <div>
                    <p style={{fontSize: "0.8rem"}}>
                        6 character minimum. At least one uppercase letter, lowercase letter, and one number.
                    </p>
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
                                this.setState({ 
                                    confirmPassword: event.target.value,
                                    confirmPasswordError: false,
                                    emptyFieldError: false
                                });
                            }
                        }
                        error={this.state.confirmPasswordError}
                        value={this.state.confirmPassword}
                    />
                </div>
                <div>
                    <p style={{visibility: this.state.emptyFieldError ? "visible" : "hidden", color: "red"}}>All fields must be completed</p>
                </div>
                <div className="CreateAccountButtons">
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createAccount}>
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
        );
    }
}

const CreateAccountForm = withRouter(withFirebase(CreateAccountFormBase));

export default CreateAccountPage;