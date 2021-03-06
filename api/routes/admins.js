var express = require('express');
var router = express.Router();

const {getLoansForAdmin, getAcceptedLoansForAdmin, getLoan, getIssuer, getLender, approveLoan, getApprovedLoansForAdmin, getActiveLoansForAdmin, getComplaints, getTax, updateTax, redeemLoan} = require('../controllers/admin');
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

router.get('/approved_loans',getApprovedLoansForAdmin, function(req, res) {
    res.render('admin/approvedLoans', {loanRequests: res.loan});

});

router.get('/active_loans',getActiveLoansForAdmin, function(req, res) {
    res.render('admin/activeLoans', {loanRequests: res.loan});

});

router.get('/view/loan_request/:loan_id',getLoan, getIssuer, function(req, res) {
    res.render('admin/viewLoanRequest', {loanRequest: res.loan, Issuer: res.issuer});

});

router.get('/view/accepted_loan/:loan_id',getLoan, getIssuer, getLender, function(req, res) {
    res.render('admin/viewAcceptedLoan', {loanRequest: res.loan, Issuer: res.issuer, Lender: res.lender});

});

router.get('/view/approved_loan/:loan_id',getLoan, getIssuer, getLender, function(req, res) {
    res.render('admin/viewApprovedLoan', {loanRequest: res.loan, Issuer: res.issuer, Lender: res.lender});

});
router.get('/view/active_loan/:loan_id',getLoan, getIssuer, getLender, getComplaints, function(req, res) {
    res.render('admin/viewActiveLoan', {loanRequest: res.loan, Issuer: res.issuer, Lender: res.lender, complaints: res.complaints});

});

router.get('/tax', getTax, function(req, res) {
    res.render('admin/tax', {tax: res.tax});
});
router.post('/tax', updateTax);


router.get('/approve/:loan_id', getTax, approveLoan)
router.get('/redeem/:loan_id', redeemLoan)

module.exports = router;
