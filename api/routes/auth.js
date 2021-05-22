const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.post('/signin', auth.signin);
router.post('/signup', auth.signup);
router.get("/signout", auth.signout);

router.get("/testroute",  auth.isSignedIn, auth.isAuthenticated)

module.exports = router;    