const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');

const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
router.get('/posts/:postId', isAuth, feedController.getPost);

// POST /feed/posts
router.post('/posts', isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPost);

// Update /feed/posts/:postId
router.put('/posts/:postId', isAuth, [
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
],feedController.updatePost);

// Delete /feed/posts/:postId
router.delete('/posts/:postId', isAuth, feedController.deletePost);

module.exports = router;