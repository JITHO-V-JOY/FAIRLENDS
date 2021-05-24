const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');
const users = require('../controllers/users');

router.get('/login', function(req, res){
    res.render('users/login', {err:false, loggedin:false})
})
router.post('/signin', auth.signin);

router.get('/register', function(req, res){
    res.render('users/register', {err:false, loggedin:false})
})

router.post('/signup', auth.signup, users.register, users.invokeTransaction);

router.get("/signout", auth.signout);

router.get("/testroute",  auth.isSignedIn)

module.exports = router;    