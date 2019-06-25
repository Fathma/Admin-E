// author: Fathma siddique
// lastmodified: 16/6/2019
// description: the file has all the forum related controllers/ functions
const Post = require('./posts.model')

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

exports.blockPost = ( req, res )=>{
    Post.update({ _id: req.params.id },{ $set:{ status: 'Blocked' } }, (err, post)=>{
        res.redirect('/forum/posts')
    })
}

exports.activePost = ( req, res )=>{
    Post.update({ _id: req.params.id },{ $set:{ status: 'Active' } }, (err, post)=>{
        res.redirect('/forum/posts')
    })
}