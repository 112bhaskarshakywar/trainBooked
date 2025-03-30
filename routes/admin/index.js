var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello');
});
router.use('/users',require('./users') );

// router.use('/trains',require('../train') );

module.exports = router;
