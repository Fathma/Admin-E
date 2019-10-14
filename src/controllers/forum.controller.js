// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the forum related controllers/ functions

// loads post model
const Post = require('../models/posts.model')


// gets all posts
exports.getPosts = ( req, res ) =>{ 
    Post.find()
    .populate('user')
    .populate('postCategory')
    .exec((err, posts)=>{
        posts.map(post=>{
            post.total_likes = post.likes.length
            post.total_comments = post.comments.length
        })

     res.render('forum/allPosts', { posts })
    })
}

// blocks a post
exports.blockPost = ( req, res )=>{
    Post.update({ _id: req.params.id },{ $set:{ status: 'Blocked' } }, (err, post)=>{
        res.redirect('/forum/posts')
    })
}

// makes a post active
exports.activePost = async ( req, res )=>{
    await Post.update({ _id: req.params.id },{ $set:{ status: 'Active' } })
    res.redirect('/forum/posts')
}

// shows all the posts with status 'new'
exports.viewNewPost = async (req, res)=>{
    await Post.find({ status: 'New'})
    res.render('forum/allPosts', { posts })
}