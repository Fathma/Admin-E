const router = require('express').Router()
const forum = require('./forum.controller')


router.get('/posts', forum.getPosts)
router.get('/posts/block/:id', forum.blockPost)
router.get('/posts/active/:id', forum.activePost)

module.exports = router