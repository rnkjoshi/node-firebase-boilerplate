const { db } = require('../Utility/admin')
const firebaseConfig = require('../Utility/config')
const firebase = require('firebase')
const { validateSignup, validateLogin } = require('../Utility/validation')
firebase.initializeApp(firebaseConfig)

exports.signup = (req,res) => {
    const newUser = {
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        handle:req.body.handle
    };
    //TODO validate user
    const {errors,valid} = validateSignup(newUser);
    if(!valid)
        return res.status(400).json({errors});
    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({handle:'This user handle is already taken'});
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token=idToken;
        const userCredentials = {
            handle:newUser.handle,
            email:newUser.email,
            createdAt:new Date().toISOString(),
            userId
        };
        db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({token});
    })
    .catch((err) => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({email:'email is already in use'})
        }
        else{
            return res.status(500).json({error:err.code});
        }
    })
}

exports.login =  (req,res) => {
    const user = {
        email:req.body.email,
        password:req.body.password
    };
    
    const {valid,errors} = validateLogin(user);
    if(!valid)
        return res.status(400).json({errors});
    
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data => {
        let info;
        db.collection('users').get().then(
            (data) => {
                data.map((doc)=>{
                    if(doc.data().userId == data.user.uid)
                        info=doc.data(); 
                })
            }
        )
        return {...data.user,info};
    }).then(token => {
        return res.status(201).json({token});
    }).catch(err => {
        console.log(err);
        if(err.code==='auth/wrong-pssword'){
            return res.status(403).json({general:'wrong credentials, please try again'});
        }else return res.status(500).json({error : err.code});
    })
}