import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes.js';
import './index.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="LoginPage">
                <h1 className="Header">breadshelf</h1>
                <div className="FormField">
                    <Link to={ROUTES.BREADSHELF}>
                        <Button variant="contained" color="primary">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default LoginPage;