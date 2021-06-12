var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');


/* GET home page. */
router.get('/', auth.isSignedIn, auth.fetchUsers, (req, res)=>{
    console.log(req.borrowers, req.lenders);
    if(req.session.user.role === "borrower"){
       res.render('users/borrowerHome', {user:req.session.user, lenders: req.lenders, borrowers: req.borrowers});
    }else if(req.session.user.role === "admin"){
        res.render('admin/adminHome', {user:req.session.user}); 
    }else{
        res.render('users/lenderHome', {user:req.session.user, lenders: req.lenders, borrowers: req.borrowers});

    }
});

module.exports = router;
