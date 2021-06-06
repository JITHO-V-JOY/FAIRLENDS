var express = require('express');
var router = express.Router();

const {getLoansForAdmin, getAcceptedLoansForAdmin, getLoan, getIssuer} = require('../controllers/admin');
const {getLoanById} = require('../controllers/loan');

router.param("loan_id", getLoanById)
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

router.get('/view/loan_request/:loan_id',getLoan, getIssuer, function(req, res) {
    res.render('admin/viewLoanRequest', {loanRequest: res.loan, Issuer: res.issuer});

});

module.exports = router;
