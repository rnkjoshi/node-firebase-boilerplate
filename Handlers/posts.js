const { db } = require('../Utility/admin')

exports.getAllPosts = (req,res)=>{
    db
    .collection('Posts')
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let posts = [];
        data.forEach(doc => {
            posts.push({
                postId : doc.id,
                body : doc.data().body,
                userHandle : doc.data().userHandle,
                createdAt:doc.data().createdAt
            });
        })
        return res.json(posts)
    })
    .catch(err => console.error(err));
}

exports.createPost = (request,response) => {
    if(req.body.body.trim()===''){
        return response.status(400).json({body:'Body must not be empty.'});
    }

    const data = {
        body : request.body.body,
        userHandle : request.user.handle,
        createdAt : new Date().toISOString()
    }
    db.collection('Posts').add(data).then(doc => {
        return response.json({message:`document ${doc.id} created successfully`})
    })
    .catch(err => {response.status(500).json({error:"Something went wrong"})})
}