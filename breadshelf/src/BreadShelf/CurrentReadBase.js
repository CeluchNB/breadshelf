import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
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
            backgroundColor: '#c798d2'
        };

        return (
            <div className="CurrentRead">
                <Paper style={paperStyle}>
                    <Book title={this.state.books[0].title} author={this.state.books[0].author}/>
                </Paper>
            </div>
        );
    }

}

export default CurrentReadBase;