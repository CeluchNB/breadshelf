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
                        current: [],
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

     addBookToAuthor = (book, bookRef, tense) => {
        var authorsRef = this.db.collection('authors');
        var authorQuery = authorsRef.where("name", "==", book.authorName);

        authorQuery
            .get()
            .then(function(querySnapshot) {
                if(querySnapshot.empty) {
                    return createAuthor(book.authorName);
                } else {
                    return doc.ref;
                }
            })
            .then(authorRef => {
                if(tense === TENSE.HAVE) {
                    authorRef.set({
                        have: bookRef
                    });
                } 
                else if (tense === TENSE.WILL) {
                    authorRef.set({
                        will: bookRef
                    })
                }
            });
     }

     createAuthor = (name) => {
         var authorsRef = this.db.collection('authors');
         var singleAuthorRef = authorsRef.doc();

         singleAuthorRef.set({
            name: name
         });
        
         return singleAuthorRef;
     }

     addBookToCollection = (book) => {
        var booksRef = this.db.collection('books');
        var bookQuery = booksRef.where("title", "==", book.title).where("authorName", "==", book.authorName);

        bookQuery.get().then(querySnapshot => {
            var singleBookRef = null;
            if(querySnapshot.empty) {
                singleBookRef = booksRef.doc();
                singleBookRef.set({
                    title: book.title,
                    authorName: book.authorName,
                    id: singleBookRef.id
                });
            } else {
                querySnapshot.forEach(doc => {
                    singleBookRef = doc.ref;
                });
            }
            return singleBookRef;
        });
     }

     addBookToUser = (bookRef, tense) => {
        var shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);

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
         var id = this.auth.currentUser.uid;
         if(tense === TENSE.HAVE) {
            bookRef.update({
                have: firebase.firestore.FieldValue.arrayUnion(id)
            });
         }
         else if (tense === TENSE.WILL) {
            bookRef.update({
                have: firebase.firestore.FieldValue.arrayUnion(id)
            });
         }
     }

     addWillBook = (book) => {

     }
    /*addWillBook = (book) => {
        var booksRef = this.db.collection('books');
        var shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);
        var singleBookRef = booksRef.doc();

        var authorsRef = this.db.collection('authors');
        var singleAuthorRef;

        authorsRef.where("name", "==", book.author)
            .get()
            .then(function(querySnapshot) {
                if(querySnapshot.empty) {
                    singleAuthorRef = authorsRef.doc();
                    singleAuthorRef.set({
                        name: book.author,
                        books: [singleBookRef]
                    });
                } else {
                    querySnapshot.forEach(function(doc) {
                        singleAuthorRef = doc.ref;
                        doc.ref.update({
                            books: firebase.firestore.FieldValue.arrayUnion(singleBookRef)
                        });

                        booksRef.where("title", "==", book.title)
                            .where("author", "==", )
                            .get()
                            .then(function(querySnapshot) {
                                if(querySnapshot.empty) {
                                    singleBookRef.set({ 
                                            title: book.title, 
                                            author: singleAuthorRef,
                                            will: [shelfRef]
                                    });
                                    shelfRef.update({
                                    will: firebase.firestore.FieldValue.arrayUnion(singleBookRef) 
                                    });
                                } else {
                                    querySnapshot.forEach(function(doc) {
                                        doc.ref.update({
                                            will: firebase.firestore.FieldValue.arrayUnion(shelfRef)
                                        });
                                        shelfRef.update({ 
                                            will: firebase.firestore.FieldValue.arrayUnion(singleBookRef)
                                        });
                                    });
                                }
                            });
                    });
                }
            });

        
    }

    removeWillBook = (book) => {
        var booksRef = this.db.collection('books');
        var shelfRef = this.db.collection('shelves').doc(this.auth.currentUser.uid);
        var singleBookQuery = booksRef.where("title", "==", book.title).where("author", "==", book.author);

        singleBookQuery.get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.update({
                       will: firebase.firestore.FieldValue.arrayRemove(shelfRef) 
                    });
                    shelfRef.update({
                        will: firebase.firestore.FieldValue.arrayRemove(doc.ref) 
                     });
                });
            });
        
        

    }*/
     
}

export default Firebase;