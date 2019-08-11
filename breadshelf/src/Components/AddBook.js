import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

class AddBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disable: true,
            titleValue: false,
            authorValue: false
        };

        this.handleTitleValue = this.handleTitleValue.bind(this);
        this.handleAuthorValue = this.handleAuthorValue.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.addBook = this.addBook.bind(this);
    }

    handleTitleValue = (e) => {
        if (e.target.value.length > 0) {
            this.setState({ 
                titleValue: true,
                disable: !this.state.authorValue 
            });
        } else {
            this.setState({
                titleValue: false,
                disable: true
            });
        }
    }

    handleAuthorValue = (e) => {
        if (e.target.value.length > 0) {
            this.setState({ 
                authorValue: true,
                disable: !this.state.titleValue
            });
        } else {
            this.setState({
                authorValue: false,
                disable: true
            });
        }
    }

    handleKeyPressed = (e) => {
        if (e.key === 'Enter' && !this.state.disable) {
            this.addBook();
        } else {
            console.log("disabled");
        }
    }

    addBook() {
        console.log("adding book");
    }

    render() {
        return (
            <div style={{margin: '0rem 0.5rem 2rem 0.5rem'}}>
                <IconButton
                    disabled={this.state.disable}
                    onClick={this.addBook}>    
                    <AddIcon />
                </IconButton>
                <Input 
                    id="title"
                    label="Title"
                    type="text"
                    name="title"
                    placeholder="Title"
                    style={{width: '40%'}}
                    onChange={ (e) => this.handleTitleValue(e)} 
                    onKeyPress={ (e) => this.handleKeyPressed(e) }/>
                <Typography component="p" style={{display: 'inline', margin: '0.5rem'}}>by</Typography>
                <Input 
                    id="author"
                    label="Author"
                    type="text"
                    name="author"
                    placeholder="Author"
                    style={{width: '40%'}}
                    onChange={ (e) => this.handleAuthorValue(e)} 
                    onKeyPress={ (e) => this.handleKeyPressed(e) }/>
            </div>
        );
    }
}

export default AddBook;