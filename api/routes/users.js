var express = require('express');
var router = express.Router();
const {register, invokeTransaction, issueLoan, invokeLoan, getLoans, getLoansForLender} = require('../controllers/users');

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

router.get('/lender/loans', getLoansForLender, function(req, res) {
  res.render('users/viewLoanLender', {myLoan: res.loan});
});

router.post('/register', register);
router.post('/channels/:channelName/chaincodes/:chaincodeName', invokeTransaction)

module.exports = router;
