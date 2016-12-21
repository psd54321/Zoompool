var express = require('express');
var router = express.Router();
var request = require("request");
var mysql = require('mysql');
var dateFormat = require('dateformat');
var PythonShell = require('python-shell');
var pyshell = new PythonShell('../worker_instant.py');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
    //req.session.login = "set";
});
router.get('/signup', function (req, res, next) {
    res.render('signup', {
        title: 'Express'
    });
});
router.get('/home', function (req, res, next) {
    if (req.session.login == "set") {
        res.render('home', {
            title: 'Express'
        });
    }
    else {
        res.redirect('/');
    }
});
router.get('/address', function (req, res, next) {
    if (req.session.login == "set") {
        res.render('address', {
            title: 'Express'
        });
    }
    else {
        res.redirect('/');
    }
});
router.get('/driver', function (req, res, next) {
    if (req.session.login == "set") {
        res.render('driversetup', {
            title: 'Express'
        });
    }
    else {
        res.redirect('/');
    }
});
var connection = mysql.createConnection({
    host: 'zoompooldb.cjofwze7tr75.us-west-2.rds.amazonaws.com'
    , user: 'root'
    , password: 'ashwin92'
    , database: 'dbzpool'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected to DB with id ' + connection.threadId);
});
router.post('/loginpost', function (req, res) {
    var email = req.body.email;
    var pass = new Buffer(req.body.psw).toString('base64');
    console.log(email + " " + pass);
    var flag = 0;
    connection.query('SELECT * FROM customer where email="' + email + '" and password="' + pass + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            req.session.login = "set";
            req.session.email = email;
            res.redirect('/home');
        }
        else {
            res.redirect('/');
        }
    });
});
router.post('/signupost', function (req, res) {
    console.log(req);
    var fname = req.body.fname;
    var email = req.body.email;
    var pass = new Buffer(req.body.psw).toString('base64');
    var dob = req.body.doby + "-" + req.body.dobm + "-" + req.body.dobd;
    console.log(dob);
    var gender = req.body.gender;
    var flag = 0;
    connection.query('Insert into customer(Fullname,Email,Password,Dob,Gender) values ("' + fname + '","' + email + '","' + pass + '","' + dob + '","' + gender + '")', function (err) {
        if (err) throw err;
        res.redirect('/');
    });
});

router.post('/advance', function(req, res){
    var ridrordrive = req.body.riderdrive;
    var slot = req.body.slot;
    var time1 = req.body.time1;
    var time2 = req.body.time2;
    var email = req.session.email;
    var date = slot.split(" ")[1];
    var fomatteddate = dateFormat(date, "yyyy-mm-dd");
    var now = new Date();
    console.log(date);
    console.log(fomatteddate);
    var numriders = 2;
    
    connection.query('Insert into trip(tripid,ridetype,time1,time2,date,no_of_riders,book_time,email) values (NULL,"' + ridrordrive + '","' + time1 + '","' + time2 + '","' + fomatteddate + '","' + numriders + '","'+dateFormat(now, "yyyy-mm-dd hh:MM:ss")+'","'+ email +'")', function (err) {
        if (err) throw err;
        res.redirect('/home');
    });
    
    
});


router.post('/instant', function(req, res){
    var ridrordrive = req.body.riderdrive;
    //var slot = req.body.slot;
    var now = new Date();
    var nowback =now;
    var time1 = dateFormat(now, "hh:MM:ss");
    now.setTime(now.getTime()+15*60*1000);
    var time2 = dateFormat(now, "hh:MM:ss");
    var email = req.session.email;
    var date = dateFormat(nowback, "yyyy-mm-dd");
    console.log(dateFormat(nowback, "YYYY-mm-dd hh:MM:ss"));
    //console.log(date);
    var numriders = 2;
    
    connection.query('Insert into trip(tripid,ridetype,time1,time2,date,no_of_riders,book_time,email) values (NULL,"' + ridrordrive + '","' + time1 + '","' + time2 + '","' + date + '","' + numriders + '","'+dateFormat(nowback, "yyyy-mm-dd hh:MM:ss")+'","'+ email +'")', function (err) {
        if (err) throw err;
        res.redirect('/home');
    });
    
    
});

module.exports = router;