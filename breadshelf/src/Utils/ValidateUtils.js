export function validateName(name) {
    var re = /^[a-z -]+$/i;
    return re.test(String(name).toLowerCase());
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validateUsername(username) {
    var re = /^[a-z0-9._-]+$/i;
    return re.test(String(username).toLowerCase());
}

export function validatePassword(password) {
    var re = /^[a-z0-9.!@#$%^&*()\[\]_-]+$/i;
    return re.test(String(password).toLowerCase());
}


export function isWeakPassword(password) {

    if(password.length < 6) {
        return true;
    }

    var noUpper = true;
    var noLower = true;
    var noNumber = true;

    for(var i = 0; i < password.length; i++) {
        if(/^[A-Z]+$/.test(password.charAt(i))) {
            noUpper = false;
        }
        if(/^[a-z]+$/.test(password.charAt(i))) {
            noLower = false;
        }
        if(!isNaN(password.charAt(i) * 1)) {
            noNumber = false;
        }
    }

    return noUpper || noLower || noNumber;
}