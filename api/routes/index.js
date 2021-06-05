var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');


/* GET home page. */
router.get('/', auth.isSignedIn, (req, res)=>{
    if(req.session.user.role === "borrower"){
    res.render('users/borrowerHome', {user:req.session.user});
    }else if(req.session.user.role === "admin"){
        res.render('admin/adminHome', {user:req.session.user}); 
    }else{
        res.render('users/lenderHome', {user:req.session.user});

    }
});

module.exports = router;
