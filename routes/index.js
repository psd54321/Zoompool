var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/signup', function (req, res, next) {
    res.render('signup', {
        title: 'Express'
    });
});
router.get('/home', function (req, res, next) {
    res.render('home', {
        title: 'Express'
    });
});
router.get('/address', function (req, res, next) {
    res.render('address', {
        title: 'Express'
    });
});
module.exports = router;