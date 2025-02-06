const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/signup')
    .get(userController.getSignUpPage)
    .post(userController.signUpUser);

router
    .route('/login')
    .get(userController.getLoginPage)
    .post(userController.loginUser);

module.exports = router;
