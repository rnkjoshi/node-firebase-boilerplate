const isEmpty = (string) => {
    if (string.length === 0)
        return true;
    return false;
}

const isEmail = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(regex))
        return true;
    else return false;
}

exports.validateSignup = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.mail = 'Email must not be empty.';
    }else if(!isEmail(data.email)){
        errors.email = 'must be a valid email.';
    }
    if(isEmpty(data.password)){
        errors.password = 'must not be empty'
    }
    if(toString(data.password) !== toString(data.confirmPassword))
        errors.confirmPassword = 'password must match';
    if(isEmpty(data.handle)) errors.handle = 'must not be empty';

    return {errors,valid:Object.keys(errors).length === 0 ?true:false}
}

exports.validateLogin = (data) => {
    let errors = {};

    if(isEmpty(data.email))
        errors.email='Must not be empty.';
    if(isEmpty(data.password))
        errors.password='Must not be empty.';
    return {errors,valid:Object.keys(errors).length === 0 ?true:false}


}