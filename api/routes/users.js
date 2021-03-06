var express = require('express');
var router = express.Router();
const {register, invokeTransaction, issueLoan, invokeLoan, getLoans, getLoansForLender, acceptLoan, getLendsForLender, getLoan, getIssuer, getLender, getActiveLoan, getActiveLoansForLender, complaint, getComplaints, payEmi, payTax} = require('../controllers/users');
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

router.get('/lender/acceptedLoans', getLendsForLender, function(req, res) {
  res.render('users/viewAcceptedLoan', {myLoan: res.loan});
});

router.get('/lender/activeLoans', getActiveLoansForLender, function(req, res) {
  res.render('users/activeLends', {myLoan: res.loan});
});

router.get('/lender/activeLoan/:loan_id', getLoan, getIssuer, function(req, res) {
  res.render('users/activeLend', {myLoan: res.loan, issuer: res.issuer});
});

router.get('/lender/loans/:loan_id', acceptLoan);

router.post('/register', register);
router.post('/channels/:channelName/chaincodes/:chaincodeName', invokeTransaction)

router.get('/view/borrower/:loan_id',getLoan, getLender, function(req, res) {
  res.render('users/viewLoan', {myLoan: res.loan, lender: res.lender});

});

router.get('/lender/view/loan/:loan_id',getLoan, getIssuer, function(req, res) {
  res.render('users/viewRequestedLoan', {myLoan: res.loan, issuer: res.issuer});

});

router.get('/lender/view/lend/:loan_id',getLoan, getIssuer, function(req, res) {
  res.render('users/viewLend', {myLoan: res.loan, issuer: res.issuer});

});

router.post('/lender/complaints', complaint)

router.get('/lender/complaints', getComplaints, function(req, res){
  res.render('users/complaints', {complaints: res.complaints})

})
router.post('/borrower/emi', payEmi, function(req, res){
  res.redirect('/borrower/active_loan');
})

router.post('/lender/tax', payTax, function(req, res){
  res.redirect('/');

})


module.exports = router;
