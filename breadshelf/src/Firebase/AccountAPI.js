import fire, { auth } from 'firebase';

export function doSignInWithEmailAndPassword( email, password ) {
    var errorCode = 0;
    auth.signInWithEmailAndPassword( email, password )
        .catch(function(error) {
            errorCode = 1;
        });
    return errorCode;
}

export function doSignUpWithEmailAndPassword( email, password ) {
    var errorCode = 0;
    auth.signUpWithEmailAndPassword( email, password )
        .catch(function(error) {
            errorCode = 1;
        });
    return errorCode;
}