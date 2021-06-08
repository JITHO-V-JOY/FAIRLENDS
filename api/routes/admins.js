var express = require('express');
var router = express.Router();

const {getLoansForAdmin, getAcceptedLoansForAdmin, getLoan, getIssuer, getLender, approveLoan} = require('../controllers/admin');
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

router.get('/view/accepted_loan/:loan_id',getLoan, getIssuer, getLender, function(req, res) {
    res.render('admin/viewAcceptedLoan', {loanRequest: res.loan, Issuer: res.issuer, Lender: res.lender});

});

router.get('/approve/:loan_id', approveLoan)

module.exports = router;
