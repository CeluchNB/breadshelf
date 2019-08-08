import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            author: props.author
        };
    }

    componentWillReceiveProps(props) {
        console.log(props);
        this.setState({
            title: props.title,
            author: props.author
        });
    }

    render() {
        return (
            <div>
                <Typography 
                    variant="subtitle1" 
                    style={{display: 'inline', marginRight: '1rem'}}>
                    {this.state.title}
                </Typography>
                <Typography variant="subtitle2"
                    style={{display: 'inline'}}>
                    {this.state.author}
                </Typography>

            </div>
        );
    }
}

export default Book;