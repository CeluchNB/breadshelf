import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ROUTES from '../constants/routes.js';
import * as TENSE from '../constants/tense.js'
import { withFirebase } from '../Firebase/index.js';
import CurrentReadBase from './CurrentReadBase.js';
import BreadshelfListBase from './BreadshelfListBase.js'
import theme from './../theme/theme.js';
import './index.css';

/*const BreadShelf = () => (
    <MuiThemeProvider theme={theme}>
        <div className="Content">
            <div className="Header">
                <h1 style={{display: 'inline'}}>breadshelf</h1>
                <SignOutButton />
            </div>
            <CurrentRead />
            <div className="BreadshelfListContent">
                <WillRead tense="will"/>
                <HaveRead tense="have"/>
            </div>
        </div>
    </MuiThemeProvider>
);*/

class BreadShelfBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            willBooks: [],
            haveBooks: [],
            currentBook: {},
            hasCurrent: true
        };

    }

    /**
     * Adds book to will shelf in current state and db
     * also appends firebase reference id to book param
     * @param book object with only title and authorName
     */
    addWillBook = (book) => {
        this.props.firebase.addNewBook(book, TENSE.WILL)
            .then(id => {
                book.id = id;
                this.setState({ willBooks: [...this.state.willBooks, book]});
            });
    }

    /**
     * Adds book to have shelf in current state and db
     * also appends firebase reference id to book param
     * @param book object with only title and authorName
     */
    addHaveBook = (book) => {
        this.props.firebase.addNewBook(book, TENSE.HAVE)
            .then(id => {
                book.id = id;
                this.setState({ haveBooks: [...this.state.haveBooks, book]});
            });
    }

    removeWillBook = (index) => {
        var books = [...this.state.willBooks];
        var book;
        if (index >= 0) {
            book = books.splice(index, 1);
            this.setState({ willBooks: books });
            this.props.firebase.removeWillBook(book[0]);
        }
    }

    removeHaveBook = (index) => {
        var books = [...this.state.haveBooks];
        if (index >= 0) {
            books.splice(index, 1);
            this.setState({ haveBooks: books });
        }
    }

    moveWillBook = (book, index) => {
        this.removeWillBook(index);
        this.setCurrent(book);
    }

    moveHaveBook = (book, index) => {
        this.removeHaveBook(index);
        this.setCurrent(book);
    }

    removeCurrent = () => {
        this.setState({ currentBook: {}, hasCurrent: false });
    }

    setCurrent = (book) => {
        this.setState({ currentBook: book, hasCurrent: true });
    }

    moveCurrentToWill = () => {
        this.addWillBook(this.state.currentBook);
        this.removeCurrent();
    }

    moveCurrentToDone = () => {
        this.addHaveBook(this.state.currentBook);
        this.removeCurrent();
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="Content">
                    <div className="Header">
                        <h1 style={{display: 'inline'}}>breadshelf</h1>
                        <SignOutButton />
                    </div>
                    <CurrentRead 
                        book={this.state.currentBook} 
                        hasBook={this.state.hasCurrent}
                        moveCurrentToWill={this.moveCurrentToWill}
                        moveCurrentToDone={this.moveCurrentToDone} />
                    <div className="BreadshelfListContent">
                        <WillRead 
                            tense="will"
                            hasCurrent={this.state.hasCurrent}
                            books={this.state.willBooks} 
                            addBook={this.addWillBook}
                            removeBook={this.removeWillBook}
                            moveBook={this.moveWillBook}/>
                        <HaveRead 
                            tense="have"
                            hasCurrent={this.state.hasCurrent}
                            books={this.state.haveBooks} 
                            addBook={this.addHaveBook}
                            removeBook={this.removeHaveBook}
                            moveBook={this.moveHaveBook}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

class SignOutButtonBase extends Component {
    constructor(props) {
        super(props);

        this.props.firebase.checkOnAuthStateChanged(authUser => {
            if(!authUser) {
                this.props.history.push(ROUTES.LANDING);
            }
        });

        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        this.props.firebase.doSignOut().then(user => this.props.history.push(ROUTES.LANDING));
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                    <Button variant="contained" 
                            color="primary"
                            onClick={this.signOut}>
                        Sign Out
                    </Button>
            </MuiThemeProvider>
        );
    }
}

const SignOutButton = withRouter(withFirebase(SignOutButtonBase));
const BreadShelf = withRouter(withFirebase(BreadShelfBase));
const CurrentRead = withRouter(CurrentReadBase);
const WillRead = withRouter(BreadshelfListBase);
const HaveRead = withRouter(BreadshelfListBase);

export default BreadShelf;