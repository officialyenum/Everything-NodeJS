const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const userController = require('../controllers/user');
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /user/status
router.get('/status', isAuth, userController.getStatus);
// PUT /user/status
router.put('/status', isAuth, [
    body('status').trim().not().isEmpty()
], userController.updateStatus);
module.exports = router;