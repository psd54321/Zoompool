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
    /*var hr = (new Date()).getHours();
    var advanceslots;
    var advanceslottime;
    if (hr < 10) {
        advanceslots = ["07:00:00", "07:15:00", "07:30:00", "07:45:00", "08:00:00", "08:15:00", "08:30:00", "08:45:00", "09:00:00", "09:15:00", "09:30:00", "09:45:00", "10:00:00"];
        advanceslottime = ["07:00 am", "07:15 am", "07:30 am", "07:45 am", "08:00 am", "08:15 am", "08:30 am", "08:45 am", "09:00 am", "09:15 am", "09:30 am", "09:45 am"];
    }
    else if (hr >= 16 && hr <= 19) {
        advanceslots = ["16:15:00", "16:30:00", "16:45:00", "17:00:00", "17:15:00", "17:30:00", "17:45:00", "18:00:00", "18:15:00", "18:30:00", "18:45:00", "19:00:00"];
        advanceslottime = ["16:15 pm", "16:30 pm", "16:45 pm", "17:00 pm", "17:15 pm", "17:30 pm", "17:45 pm", "18:00 pm", "18:15 pm", "18:30 pm", "18:45 pm", "19:00 pm"];
    }*/
    res.render('home', {
        title: 'Express'
    });
});
module.exports = router;