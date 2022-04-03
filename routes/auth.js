var express = require('express');
var router = express.Router();
const AUTH = require("../controllers/auth")

router.post('/', AUTH.login)
router.post('/signup', AUTH.signup)

module.exports = router;
