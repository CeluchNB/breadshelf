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

class BreadShelfBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            willBooks: [],
            haveBooks: [],
            currentBook: {},
            hasCurrent: false,
            isMobile: window.innerWidth <= 800
        };
        
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if(user !== null) {
                this.props.firebase.getBreadshelf()
                    .then(breadshelf => {
                        if(breadshelf.willBooks !== null) {
                            this.setState({
                                willBooks: breadshelf.willBooks,
                                haveBooks: breadshelf.haveBooks,
                                currentBook: breadshelf.currentBook,
                                hasCurrent: breadshelf.currentBook.title === null ? false : true
                            });
                        }
                    });
            }
        });

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

    /**
     * Removes book from will shelf in the react state
     * and makes call to database to remove book
     * @param index index of book in state willBooks array
     */
    removeWillBook = (index) => {
        var books = [...this.state.willBooks];
        var book;
        if (index >= 0) {
            book = books.splice(index, 1);
            this.setState({ willBooks: books });
            this.props.firebase.removeBook(book[0].id, TENSE.WILL);
        }
    }

    /**
     * Removes book from have shelf in the react state
     * and makes call to database to remove book
     * @param index index of book in state haveBooks array
     */
    removeHaveBook = (index) => {
        var books = [...this.state.haveBooks];
        var book;
        if (index >= 0) {
            book = books.splice(index, 1);
            this.setState({ haveBooks: books });
            this.props.firebase.removeBook(book[0].id, TENSE.HAVE);
        }
    }

    /**
     * Moves book in willBooks state array to be the current book
     * in state and in database
     * @param book object of book that is being moved
     * @param index index of book in the willBooks array
     */
    moveWillBook = (book, index) => {
        this.removeWillBook(index);
        this.setCurrent(book);
        this.props.firebase.moveBook(book.id, TENSE.WILL, TENSE.CURRENT);
    }

    /**
     * Moves book in haveBooks state array to be the current book
     * in state and in database
     * @param book object of book that is being moved
     * @param index index of book in the haveBooks array
     */
    moveHaveBook = (book, index) => {
        this.removeHaveBook(index);
        this.setCurrent(book);
        this.props.firebase.moveBook(book.id, TENSE.HAVE, TENSE.CURRENT);
    }

    /**
     * Removes current book from state current object
     * and database 
     */
    removeCurrent = () => {
        this.props.firebase.removeBook(this.state.currentBook.id, TENSE.CURRENT);
        this.setState({ currentBook: {}, hasCurrent: false });
    }

    /**
     * Sets react state currentBook (does not call database)
     * @param book book object to set as currentBook
     */
    setCurrent = (book) => {
        this.setState({ currentBook: book, hasCurrent: true });
    }

    /**
     * Moves current book to the will shelf
     * in state and database
     */
    moveCurrentToWill = () => {
        this.props.firebase.moveBook(this.state.currentBook.id, TENSE.CURRENT, TENSE.WILL);
        this.addWillBook(this.state.currentBook);
        this.removeCurrent();
    }

    /**
     * Moves current book to have shelf
     * in state and database
     */
    moveCurrentToDone = () => {
        this.props.firebase.moveBook(this.state.currentBook.id, TENSE.CURRENT, TENSE.HAVE);
        this.addHaveBook(this.state.currentBook);
        this.removeCurrent();
    }

    updateStyles = () => {
        this.setState({ isMobile: window.innerWidth <= 800 });
    }

    componentWillMount() {
        window.addEventListener("resize", this.updateStyles.bind(this));
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.updateStyles.bind(this));
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className={this.state.isMobile ? "ContentMobile" : "Content"}>
                    <div className="Header">
                        <div className="Logo">
                            <h1 >breadshelf</h1>
                        </div>
                        <div className="SignOutButton">
                            <SignOutButton />
                        </div>
                    </div>
                    <div className="Shelf">
                        <CurrentRead 
                            book={this.state.currentBook} 
                            hasBook={this.state.hasCurrent}
                            moveCurrentToWill={this.moveCurrentToWill}
                            moveCurrentToDone={this.moveCurrentToDone}
                            isMobile={this.state.isMobile} />
                        <div className={this.state.isMobile ? "BreadshelfListContentMobile" : "BreadshelfListContent"}>
                            <WillRead 
                                tense="will"
                                hasCurrent={this.state.hasCurrent}
                                books={this.state.willBooks} 
                                addBook={this.addWillBook}
                                removeBook={this.removeWillBook}
                                moveBook={this.moveWillBook}
                                isMobile={this.state.isMobile}/>
                            <HaveRead 
                                tense="have"
                                hasCurrent={this.state.hasCurrent}
                                books={this.state.haveBooks} 
                                addBook={this.addHaveBook}
                                removeBook={this.removeHaveBook}
                                moveBook={this.moveHaveBook}
                                isMobile={this.state.isMobile}/>
                        </div>
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