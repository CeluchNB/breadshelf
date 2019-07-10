import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import * as ROUTES from '../constants/routes.js';
import { Link } from 'react-router-dom';

class BreadShelf extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link to={ROUTES.LANDING}>
                <Button variant="contained" color="primary">
                    Sign Out
                </Button>
            </Link>
        );
    }
}

export default BreadShelf;