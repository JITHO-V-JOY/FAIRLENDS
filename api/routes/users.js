var express = require('express');
var router = express.Router();
const {register, invokeTransaction, issueLoan, invokeLoan, getLoans, getLoansForLender, acceptLoan, getAcceptedLoansForLender, getLoan, getIssuer, getLender, getActiveLoan} = require('../controllers/users');
const {getLoanById} = require('../controllers/loan');

router.param("loan_id", getLoanById)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/loan', function(req, res, next) {
  res.render('users/applyLoan');
});

router.post('/loan', issueLoan, invokeLoan);

router.get('/borrower/myloans', getLoans, function(req, res) {
  res.render('users/viewLoanBorrower', {myLoan: res.loan});
});

router.get('/borrower/active_loan', getActiveLoan, getIssuer, getLender, function(req, res) {
  res.render('users/activeLoan', {myLoan: res.loan, issuer: res.issuer, lender: res.lender});
});

router.get('/lender/loans', getLoansForLender, function(req, res) {
  res.render('users/viewLoanLender', {myLoan: res.loan});
});

router.get('/lender/acceptedLoans', getAcceptedLoansForLender, function(req, res) {
  res.render('users/viewAcceptedLoan', {myLoan: res.loan});
});

router.get('/lender/loans/:loan_id', acceptLoan);

router.post('/register', register);
router.post('/channels/:channelName/chaincodes/:chaincodeName', invokeTransaction)

router.get('/view/loan_request/:loan_id',getLoan, getIssuer, function(req, res) {
  res.render('users/viewLoan', {loanRequest: res.loan, Issuer: res.issuer});

});

module.exports = router;
