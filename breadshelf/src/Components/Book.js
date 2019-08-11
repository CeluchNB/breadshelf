import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
                    }>
                    { this.props.willRead ? <ArrowUpwardIcon /> : <ArrowBackIcon /> }
                </IconButton>
                <div style={{display: 'inline', float: 'left', width: '80%'}}>
                    <Typography 
                        variant="subtitle1" 
                        style={{display: 'block', marginRight: '1rem'}}>
                        {this.state.title}
                    </Typography>
                    <Typography variant="subtitle2"
                        style={{display: 'block'}}>
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
                    }>
                    <ClearIcon />
                </IconButton>
            </div>
        );
    }
}

export default Book;