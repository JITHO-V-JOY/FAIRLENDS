var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');


/* GET home page. */
router.get('/', auth.isSignedIn, (req, res)=>{
    res.render('users/home', {user:req.session.user});
});

module.exports = router;
