import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Book from './../Components/Book.js';
import './CurrentRead.css';

class CurrentReadBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [
                { title: "The Vanishing American Adult", author: "Ben Sasse" }
            ]
        }
    }

    render() {
        const paperStyle = {
            backgroundColor: ' rgba(199, 152, 210, 0.5)'
        };

        const headerStyle = {
            padding: '0.25rem',
            paddingBottom: '0rem',
            paddingLeft: '2rem'
        };

        return (
            <div className="CurrentRead">
                <Paper style={paperStyle}>
                    <Typography variant="h6" style={headerStyle}>Current Read</Typography>
                    <div className="CurrentReadItem">
                        <Book title={this.state.books[0].title} author={this.state.books[0].author}/>
                    </div>
                </Paper>
            </div>
        );
    }

}

export default CurrentReadBase;