import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { ListItem } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import Book from '../Components/Book';
import AddBook from '../Components/AddBook';
import './BreadshelfList.css';

class BreadshelfListBase extends Component {
    constructor(props) {
        super(props);

        this.willReadState = {
            paperColor: 'rgba(79, 255, 105, 0.5)',
            floatDirection: 'left',
            tenseTitle: 'Will Read'
        }

        this.haveReadState = {
            paperColor: 'rgba(66, 230, 255, 0.5)',
            floatDirection: 'right',
            tenseTitle: 'Have Read'
        }

        this.state = {
            books: [...this.props.books],
            isMobile: window.innerWidth <= 800
        };

        if(this.props.tense === "will") {
            this.state = { ...this.state, ...this.willReadState };
        } else {
            this.state = { ...this.state, ...this.haveReadState };
        }

        this.addBook = this.addBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.moveBook = this.moveBook.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ books: [...props.books], isMobile: props.isMobile });
    }

    addBook = (book) => {
        this.props.addBook(book);
    }

    deleteBook = (index) => {
        this.props.removeBook(index);
    }

    moveBook = (book, index) => {
        this.props.moveBook(book, index);
    }

    render() {

        const paperStyle = {
            backgroundColor: this.state.paperColor,
            height: '100%',
            overflow: 'hidden'
        };

        const headerStyle = {
            padding: '0.25rem',
            paddingBottom: '0rem',
            paddingLeft: '2rem',
            color: '#4e4e4e',
            borderBottom: '1px solid rgba(0,0,0,0.12)'
        };

        return (
            <div className={this.state.isMobile ? "BreadshelfListMobile" : "BreadshelfList"} 
                style={{float: this.state.floatDirection}}>
                <Paper style={paperStyle}>
                    <Typography variant="h6" style={headerStyle}>{this.state.tenseTitle}</Typography>
                    <Scrollbars
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={500}
                        className="Scrollbar"
                        ref="scrollbars"
                        >
                        <List style={this.state.isMobile ? {} :
                            {marginRight: '0.5rem', marginLeft: '0.5rem', paddingTop: '0'}}>
                            {
                                this.state.books.map((book, index) => {
                                    return (
                                        <div key={index}>
                                            <ListItem>
                                                <Book 
                                                    title={book.title} 
                                                    author={book.authorName} 
                                                    hasCurrent={this.props.hasCurrent}
                                                    willRead={this.props.tense === "will"}
                                                    deleteBook={() => this.deleteBook(index)}
                                                    moveBook={
                                                        () =>  this.moveBook({
                                                            title: book.title, 
                                                            authorName: book.authorName,
                                                            id: book.id
                                                        }, index)
                                                    } />
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    );
                                })
                            }
                        </List>
                        <AddBook addBook={this.addBook} isMobile={this.state.isMobile}/>
                    </Scrollbars>
                </Paper>
            </div>
        );
    }
}

export default BreadshelfListBase;