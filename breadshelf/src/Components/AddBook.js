import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import AddIcon from '@material-ui/icons/Add';

class AddBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disable: true,
            titleValue: false,
            authorValue: false,
            title: "",
            author: ""
        };

        this.handleTitleValue = this.handleTitleValue.bind(this);
        this.handleAuthorValue = this.handleAuthorValue.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.addBook = this.addBook.bind(this);
    }

    handleTitleValue = (e) => {
        this.setState({ title: e.target.value });
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
        this.setState({ author: e.target.value });
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
        }
    }

    addBook() {
        this.setState({ title: "", author: "" });
        this.props.addBook({title: this.state.title, author: this.state.author });
    }

    render() {
        return (
            <div style={{margin: '0rem 0rem 2rem 0.5rem'}}>
                <ListItem>
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
                        value={this.state.title}
                        style={{maxWidth: '30%', minWidth: '20%', marginLeft: '0.25rem'}}
                        onChange={ (e) => this.handleTitleValue(e)} 
                        onKeyPress={ (e) => this.handleKeyPressed(e) }/>
                    <Typography component="p" style={{display: 'inline', margin: '0.5rem'}}>by</Typography>
                    <Input 
                        id="author"
                        label="Author"
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={this.state.author}
                        style={{maxWidth: '30%', minWidth: '20%'}}
                        onChange={ (e) => this.handleAuthorValue(e)} 
                        onKeyPress={ (e) => this.handleKeyPressed(e) }/>
                </ListItem>
            </div>
        );
    }
}

export default AddBook;