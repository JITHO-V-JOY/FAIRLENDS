var express = require('express');
var router = express.Router();
const {register, invokeTransaction, issueLoan, invokeLoan} = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/loan', function(req, res, next) {
  res.render('users/applyLoan');
});

router.post('/loan', issueLoan, invokeLoan);

router.post('/register', register);
router.post('/channels/:channelName/chaincodes/:chaincodeName', invokeTransaction)

module.exports = router;
