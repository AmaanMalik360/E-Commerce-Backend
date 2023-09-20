const express = require('express');
const router = express.Router()
const User = require('../../modals/user');
const {requireSignin} = require('../../common middleware/index')
const { adminSignup, adminSignin} = require('../../controller/admin/auth');


router.post('/admin/signup', adminSignup);

router.post('/admin/signin', adminSignin);




module.exports = router