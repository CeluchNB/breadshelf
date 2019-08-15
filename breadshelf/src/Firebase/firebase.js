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
    doSignInWithEmailAndPassword = (email, password) => (
        this.auth.signInWithEmailAndPassword(email, password)
    );

    doCreateUser = (userData) => {
        this.auth
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

    doSignOut = () => this.auth.signOut();

    checkOnAuthStateChanged = (command) => this.auth.onAuthStateChanged(command);

    getUserByUsername = (username) => (
        this.db.collection('users')
            .where("username", "==", username)
            .get()
    );

    getUserByEmail = (email) => (
        this.db.collection('users')
            .where("email","==", email)
            .get()
    );

    /**
     * BOOK API
     */

     addBookToAuthor = async (book, bookRef) => {
        let authorsRef = this.db.collection('authors');
        let authorQuery = authorsRef.where("name", "==", book.authorName);
        let self = this;

        return authorQuery
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

     createAuthor = (name) => {
         let authorsRef = this.db.collection('authors');
         var singleAuthorRef = authorsRef.doc();

         singleAuthorRef.set({
            name: name
         });
        
         return singleAuthorRef;
     }

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
                singleBookRef = querySnapshot.docs[0];
            }
            return singleBookRef;
        });
     }

     addBookToUser = (bookRef, tense) => {
        let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);

        if(tense === TENSE.HAVE) {
            shelfRef.update({
                have: firebase.firestore.FieldValue.arrayUnion(bookRef)
            });
        }
        else if (tense === TENSE.WILL) {
            shelfRef.update({
                will: firebase.firestore.FieldValue.arrayUnion(bookRef)
            });
        }

     }

     addUserToBook = (bookRef, tense) => {
         let id = this.auth.currentUser.uid;
         let shelfRef = this.db.collection('shelves');

         if(tense === TENSE.HAVE) {
            bookRef.update({
                have: firebase.firestore.FieldValue.arrayUnion(shelfRef.doc(id))
            });
         }
         else if (tense === TENSE.WILL) {
            bookRef.update({
                will: firebase.firestore.FieldValue.arrayUnion(shelfRef.doc(id))
            });
         }
     }

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

     /*moveBook = (bookId, fromTense, toTense) => {
        let bookRef = this.db.collection("books").doc(bookId);
        let shelfRef = this.db.collection("shelves").doc(this.auth.currentUser.uid);
        

     }*/

     removeBook = (bookRef, tense) => {
        let shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);

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
                    return Promise.resolve({title: null});
                }
            })
            .then((currentBook) => {
                breadshelf.currentBook = currentBook;
                return breadshelf;
            })
            .catch(error => {
                console.log(error);
            });
     }
     
}

export default Firebase;