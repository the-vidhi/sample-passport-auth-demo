var express = require('express');
var router = express.Router();
const AUTH = require("../routes/auth")

router.use('/', AUTH)

module.exports = router;
