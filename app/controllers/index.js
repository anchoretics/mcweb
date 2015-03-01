var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('session, user');
  console.log(req.session);
  console.log(req.user);
  res.render('index', { title: '首页' });
});

module.exports = router;
