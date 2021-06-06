var express = require('express');
var router = express.Router();

const {getLoansForAdmin, getAcceptedLoansForAdmin} = require('../controllers/admin');

/* GET users listing. */
router.get('/home', function(req, res) {
    res.render('admin/welcome');
});

router.get('/loan_requests',getLoansForAdmin, function(req, res) {
    res.render('admin/loanRequest', {loanRequests: res.loan});

});
router.get('/accepted_loans',getAcceptedLoansForAdmin, function(req, res) {
    res.render('admin/acceptedLoans', {loanRequests: res.loan});

});

module.exports = router;
