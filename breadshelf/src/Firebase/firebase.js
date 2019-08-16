import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as TENSE from './../constants/tense.js';

const firebaseConfig = {
    apiKey: "AIzaSyCYkBwLvzE-hWo35smeIj2Y1QuraSXJxCQ",
    authDomain: "breadshelf.firebaseapp.com",
    databaseURL: "https://breadshelf.firebaseio.com",
    projectId: "breadshelf",
    storageBucket: "",
    messagingSenderId: "93936832869",
    appId: "1:93936832869:web:a4cb8da2ad81df9b"
};

class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    /** 
     * AUTHENTICATION API 
     */

     /**
      * Perform auth sign in with email and password
      * @param email email associated with account
      * @param password password associated with account
      */
    doSignInWithEmailAndPassword = (email, password) => (
        this.auth.signInWithEmailAndPassword(email, password)
    );

    /**
     * Creates user in firebase authentication,
     * creates user document in firestore users collection, and 
     * creates shelf document in firestore shelves collection
     * @param userData user data object with email, password, first and last name, username, and uid
     * @returns Promise so we know that account has been created
     */
    doCreateUser = async (userData) => {
       return await this.auth
            .createUserWithEmailAndPassword(userData.email, userData.password)
            .then(user => {
                this.db.collection("users").doc(user.user.uid).set({
                    email: userData.email,
                    first: userData.firstname,
                    last: userData.lastname,
                    username: userData.username,
                    uid: user.user.uid
                }).then(userCreate => {
                    this.db.collection("shelves").doc(user.user.uid).set({
                        current: null,
                        have: [],
                        will: [],
                        user: this.db.collection("users").doc(user.user.uid)
                    }).then(shelfCreate => {
                        this.db.collection("users").doc(user.user.uid).set({
                            shelf: this.db.collection("shelves").doc(user.user.uid)
                        }, { merge: true });
                    });
                });
            })
    }

    /**
     * performs authentication sign out
     */
    doSignOut = () => this.auth.signOut();

    /**
     * perform command onAuthStateChanged
     * @param command function that performs some action
     */
    checkOnAuthStateChanged = (command) => this.auth.onAuthStateChanged(command);

    /**
     * gets user based on username
     * @param username username of user
     * @returns Promise with query of user document
     */
    getUserByUsername = (username) => (
        this.db.collection('users')
            .where("username", "==", username)
            .get()
    );


    /**
     * gets user base on email
     * @param email email associated with user
     * @returns Promise with query of user document
     */
    getUserByEmail = (email) => (
        this.db.collection('users')
            .where("email","==", email)
            .get()
    );

    /**
     * BOOK API
     */

     /**
      * Adds book to an author's list of books
      * @param book book object
      * @param bookRef document reference associated with book object
      * @returns Promise
      */
     addBookToAuthor = (book, bookRef) => {
        let authorsRef = this.db.collection('authors');
        let authorQuery = authorsRef.where("name", "==", book.authorName);
        let self = this;

        authorQuery
            .get()
            .then(function(querySnapshot) {
                if(querySnapshot.empty) {
                    return self.createAuthor(book.authorName);
                } else {
                    return querySnapshot.docs[0].ref;
                }
            })
            .then(authorRef => {
                authorRef.update({
                    books: firebase.firestore.FieldValue.arrayUnion(bookRef)
                }); 
            });
     }

     /**
      * Creates a new author
      * @param name name of author
      * @returns document reference to new author
      */
     createAuthor = (name) => {
         let authorsRef = this.db.collection('authors');
         var singleAuthorRef = authorsRef.doc();

         singleAuthorRef.set({
            name: name
         });
        
         return singleAuthorRef;
     }

     /**
      * Adds book to firestore books collection
      * @param book book object
      * @returns Promise containing document reference of book
      */
    addBookToCollection = async (book) => {
        var booksRef = this.db.collection('books');
        var bookQuery = booksRef.where("title", "==", book.title).where("authorName", "==", book.authorName);

        return await bookQuery.get().then(querySnapshot => {
            var singleBookRef;
            if(querySnapshot.empty) {
                singleBookRef = booksRef.doc();
                
                singleBookRef.set({
                    title: book.title,
                    authorName: book.authorName,
                    id: singleBookRef.id
                });
            } else {
                singleBookRef = querySnapshot.docs[0].ref;
            }
            return singleBookRef;
        });
     }

     /**
      * Adds book to correct book array in firebase user document
      * @param bookRef document reference of book
      * @param tense tense of shelf (will, have, or current)
      */
     addBookToUser = (bookRef, tense) => {
        let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);

        switch(tense) {
            case TENSE.HAVE:
                shelfRef.update({
                    have: firebase.firestore.FieldValue.arrayUnion(bookRef)
                });
                break;
            case TENSE.WILL:
                shelfRef.update({
                    will: firebase.firestore.FieldValue.arrayUnion(bookRef)
                });
                break;
            case TENSE.CURRENT:
                shelfRef.update({
                    current: bookRef
                });
                break;
            default:
                break;
        }

     }

     /**
      * Adds reference to user in firebase book document 
      * in correct book array
      * @param bookRef document reference to book
      * @param tense tense of shelf (will, have, or current)
      */
     addUserToBook = (bookRef, tense) => {
         let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);

         switch(tense) {
             case TENSE.HAVE:
                bookRef.update({
                    have: firebase.firestore.FieldValue.arrayUnion(shelfRef)
                });
                break;
            case TENSE.WILL:
                bookRef.update({
                    will: firebase.firestore.FieldValue.arrayUnion(shelfRef)
                });
                break;
            case TENSE.CURRENT:
                bookRef.update({
                    current: firebase.firestore.FieldValue.arrayUnion(shelfRef)
                })
                break;
            default:
                break;
         }
     }

     /**
      * Adds new book to firestore database
      * @param book book object
      * @param tense tense of shelf book is in (will, have, or current)
      * @returns Promise with id of bookRef
      */
     addNewBook = async (book, tense) => {
        return await this.addBookToCollection(book)
            .then((bookRef) => {
                this.addBookToUser(bookRef, tense);
                this.addUserToBook(bookRef, tense);
                this.addBookToAuthor(book, bookRef);
                return bookRef.id;
            })
            .catch((error) => {
                console.log("error: " + error);
            });
     }

     /**
      * Moves book from one shelf to another
      * @param bookId id of book to move
      * @param fromTense current shelf book is in (will, have, or current)
      * @param toTense shelf to move book to (will, have, or current)
      */
     moveBook = (bookId, fromTense, toTense) => {
        let bookRef = this.db.collection("books").doc(bookId);
        
        this.removeBook(bookId, fromTense);
        this.addBookToUser(bookRef, toTense);
        this.addUserToBook(bookRef, toTense);

     }

     /**
      * Removes book from shelf document
      * @param bookId id of book document to move
      * @param tense shelf to add book to (will, have, or current)
      */
     removeBook = (bookId, tense) => {
        let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);
        let bookRef = this.db.collection('books').doc(bookId);

        switch(tense) {
            case TENSE.HAVE:
                shelfRef.update({
                   have: firebase.firestore.FieldValue.arrayRemove(bookRef) 
                });
                break;
            case TENSE.WILL:
                shelfRef.update({
                    will: firebase.firestore.FieldValue.arrayRemove(bookRef) 
                });
                break;
            case TENSE.CURRENT:
                shelfRef.update({
                    current: null 
                });
                break;
            default:
                break;
        }
     }

     /**
      * Gets every book object from a given array
      * @param bookRefArray array of book references
      * @returns Promise containing array of book objects
      */
     getBooksFromShelf = async (bookRefArray) => {
        var books = [];

        for(let bookRef of bookRefArray) {
            await this.getBookFromRef(bookRef)
                .then(book => {
                    books.push(book);
                });
        }

        return books;
     }

     /**
      * Gets a single book from a book reference
      * @param bookRef reference to book document
      * @returns Promise containing a book object
      */
     getBookFromRef = async (bookRef) => {
        var book = {title: null, authorName: null, id: null};
        
        return await bookRef
            .get()
            .then(bookObj => {
                book = {
                    title: bookObj.data().title,
                    authorName: bookObj.data().authorName,
                    id: bookObj.data().id
                }
                return book; 
            });
     }

     /**
      * Gets entire breadshelf object
      * @returns Promise contains breadshelf object
      */
     getBreadshelf = async () => {
        let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);
        var shelfDoc = null;
        var breadshelf = {};

        return await shelfRef.get()
            .then((doc) => {
                shelfDoc = doc;
                return this.getBooksFromShelf(shelfDoc.data().will);
            })
            .then((willBooks) => {
                breadshelf.willBooks = willBooks;
                return this.getBooksFromShelf(shelfDoc.data().have);
            })
            .then((haveBooks) => {
                breadshelf.haveBooks = haveBooks;
                if(shelfDoc.data().current !== null && shelfDoc.data().current !== undefined) {
                    return this.getBookFromRef(shelfDoc.data().current);  
                } else {
                    return Promise.resolve({title: null, authorName: null, id: null});
                }
            })
            .then((currentBook) => {
                breadshelf.currentBook = currentBook;
                return breadshelf;
            })
            .catch(error => {
                console.log("error: " + error);
            });
     }
     
}

export default Firebase;