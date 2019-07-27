import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

}

export default Firebase;