// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the forum related routes 
const router = require('express').Router()
const forum = require('../controllers/forum.controller')

router.get('/posts', forum.getPosts)
router.get('/posts/block/:id', forum.blockPost)
router.get('/posts/active/:id', forum.activePost)
router.get('/viewNewPost', forum.viewNewPost)

module.exports = router