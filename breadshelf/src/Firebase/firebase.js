import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCYkBwLvzE-hWo35smeIj2Y1QuraSXJxCQ",
    authDomain: "breadshelf.firebaseapp.com",
    databaseURL: "https://breadshelf.firebaseio.com",
    projectId: "breadshelf",
    storageBucket: "",
    messagingSenderId: "93936832869",
    appId: "1:93936832869:web:a4cb8da2ad81df9b"
};

const fire = firebase.initializeApp(firebaseConfig);
const auth = fire.auth();

export default firebase;
export { auth };