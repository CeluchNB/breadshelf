import React, { Component } from 'react';
import ListItemText from '@material-ui/core/ListItemText';

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
        const bookStyle = {
            fontWeight: '600pt'
        };
        return (
            <div>
                <ListItemText 
                    primary={this.state.title} 
                    secondary={this.state.author} 
                    primaryTypographyProps={{display: 'inline'}}
                    secondaryTypographyProps={{display: 'inline'}} />
            </div>
        );
    }
}

export default Book;