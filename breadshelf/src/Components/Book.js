import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            author: props.author
        };

        this.deleteBook = this.deleteBook.bind(this);
        this.moveBook = this.moveBook.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            title: props.title,
            author: props.author
        });
    }

    deleteBook() {
        this.props.deleteBook();
    }

    moveBook() {
        this.props.moveBook();
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <IconButton style={
                    {
                        display: 'inline', 
                        float: 'left', 
                        width: '10%', 
                        height: '100%',
                        minWidth: '47px',
                        maxWidth: '48px'
                    }
                    }
                    disabled={this.props.hasCurrent}
                    onClick={this.moveBook}>
                    <ArrowUpwardIcon />
                </IconButton>
                <div style={{display: 'inline', float: 'left', maxWidth: '60%', minWidth: '40%'}}>
                    <Typography 
                        variant="subtitle1" 
                        style={{display: 'block', marginRight: '1rem', overflow: 'hidden'}}>
                        {this.state.title}
                    </Typography>
                    <Typography variant="subtitle2"
                        style={{display: 'block', overflow: 'hidden'}}>
                        {this.state.author}
                    </Typography>
                </div>
                <IconButton style={
                    {
                        display: 'inline', 
                        float: 'right', 
                        width: '10%', 
                        height: '100%',
                        minWidth: '47px',
                        maxWidth: '48px'
                    }
                    }
                    onClick={this.deleteBook}>
                    <ClearIcon />
                </IconButton>
            </div>
        );
    }
}

export default Book;