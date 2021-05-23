var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');


/* GET home page. */
router.get('/', auth.isSignedIn, auth.isAuthenticated);

module.exports = router;
