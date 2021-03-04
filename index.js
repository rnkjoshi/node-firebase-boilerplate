const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const { getAllPosts, createPost } = require('./Handlers/posts')
app.use(cors());
const { signup, login } = require('./Handlers/users');
const FBAuth = require('./Utility/FBAuth');

app.get('/posts', getAllPosts);
app.post('/posts', FBAuth, createPost);

//Signup Route
app.post('/signup',signup);
//Login
app.post('/login',login);


exports.api = functions.https.onRequest(app);