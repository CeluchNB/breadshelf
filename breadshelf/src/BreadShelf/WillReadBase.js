import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './WillRead.css';

class WillReadBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: []
        };
    }

    render() {

        const paperStyle = {
            backgroundColor: '#4fff69'
        };

        return (
            <div>
                <Paper style={paperStyle}>
                    <p>hello world</p>
                </Paper>
            </div>
        );
    }
}

export default WillReadBase;