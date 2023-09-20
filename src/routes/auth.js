const express = require('express');
const { signup, signin } = require('../controller/auth');
// const {check, validationRequest} = require('express-validator')

const {validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth')
const {requireSignin} = require('../common middleware/index')
const router = express.Router()


router.post('/signup', validateSignupRequest, isRequestValidated, signup);

router.post('/signin', validateSigninRequest, isRequestValidated, signin);



module.exports = router