import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Book from './../Components/Book.js';
import './CurrentRead.css';

class CurrentReadBase extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const paperStyle = {
            backgroundColor: '#c798d2'
        };

        return (
            <div className="CurrentRead">
                <Paper style={paperStyle}>
                    <Book title="The Vanishing American Adult" author="Dr. Ben Sasse" />
                </Paper>
            </div>
        );
    }

}

export default CurrentReadBase;