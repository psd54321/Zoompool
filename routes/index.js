var express = require('express');
var router = express.Router();
var request = require("request");
var mysql = require('mysql');
var dateFormat = require('dateformat');
var PythonShell = require('python-shell');
var mapkey = require('../config/mapconfig');
var GoogleMapsAPI = require('googlemaps');
var polyline = require('polyline');
var async = require('async');
var crypto = require('crypto');
var AWS = require('aws-sdk');
var awsconfig = require('../config/awsconfig');
var publicConfig = {
    key: mapkey.key,
    encode_polylines: false
}
var gmAPI = new GoogleMapsAPI(publicConfig);
var os = require("os");
var path = require('path');


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
    } else {
        res.redirect('/');
    }
});
router.get('/address', function (req, res, next) {
    if (req.session.login == "set") {
        res.render('address', {
            title: 'Express'
        });
    } else {
        res.redirect('/');
    }
});
router.get('/driver', function (req, res, next) {
    if (req.session.login == "set") {
        res.render('driversetup', {
            title: 'Express'
        });
    } else {
        res.redirect('/');
    }
});
var connection = mysql.createConnection({
    host: 'zoompooldb.cjofwze7tr75.us-west-2.rds.amazonaws.com',
    user: 'root',
    password: 'ashwin92',
    database: 'dbzpool'
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

    connection.query('SELECT * FROM customer where email="' + email + '" and password="' + pass + '" and verified = 1', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            req.session.login = "set";
            req.session.email = email;
            res.redirect('/home');
        } else {
            res.render('index', {
                title: 'Zoompool',
                message: 'Please enter valid credentials. If the credentials were correct please check if you verified your email address.',
            });
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
    var company_id = email.split('@');
    var company_address = company_id[1];
    var token;
    var ses = new AWS.SES({
        "accessKeyId": awsconfig.accessKey,
        "secretAccessKey": awsconfig.secretAccessKey,
        "region": 'us-east-1'
    });
    var home = req.body.home;
    var office = req.body.office;
    var homegeo;
    var workgeo;
    var geocodeParams;

    //console.log('SELECT * from verify_email where accepted_email="' + company_address + '"');

    connection.query('SELECT * from verify_email where accepted_email="' + company_address + '"', function (err, rows, fields) {
        if (err) throw err;

        if (rows.length > 0) {
            console.log('Correct address');

            crypto.randomBytes(48, function (err, buffer) {
                token = buffer.toString('hex');
                console.log(token);

                var link = "http://node-express-env.avpvzxmmka.us-east-1.elasticbeanstalk.com/verify/" + token;
                connection.query('Insert into customer(Fullname,Email,Password,Dob,Gender,token,verified) values ("' + fname + '","' + email + '","' + pass + '","' + dob + '","' + gender + '","' + token + '",0)', function (err) {
                    if (err) throw err;
                    res.redirect('/');
                    geocodeParams = {
                        "address": home,
                        "language": "en"
                    };

                    gmAPI.geocode(geocodeParams, function (err, result) {
                        homegeo = result.results[0].geometry.location;

                        console.log(homegeo);
                        connection.query('update customer set homelat ="' + homegeo.lat + '",homelong="' + homegeo.lng + '" where email="' + email + '"', function (err) {
                            if (err) throw err;
                        });
                    });

                    geocodeParams = {
                        "address": office,
                        "language": "en"
                    };

                    gmAPI.geocode(geocodeParams, function (err, result) {
                        workgeo = result.results[0].geometry.location;
                        console.log(workgeo);
                        connection.query('update customer set worklat ="' + workgeo.lat + '",worklong ="' + workgeo.lng + '" where email="' + email + '"', function (err) {
                            if (err) throw err;

                        });
                    });
                });

                var eparam = {
                    Destination: {
                        ToAddresses: ["sg4423@nyu.edu"]
                    },
                    Message: {
                        Body: {
                            Html: {
                                Data: "<p>Welcom to Zoompool</p> <p>Hello, Thanks for signing up! Here is your email verification link " + link + " </p>"
                            },
                            Text: {
                                Data: "Hello, Thanks for signing up! Here is your email verification link " + link
                            }
                        },
                        Subject: {
                            Data: "ZoomPool Email Verification"
                        }
                    },
                    Source: "psd281@nyu.edu",
                    ReplyToAddresses: ["psd281@nyu.edu"],
                    ReturnPath: "psd281@nyu.edu"
                };

                ses.sendEmail(eparam, function (err, data) {
                    if (err) console.log(err);
                    else console.log(data);
                });
            });


        } else {
            console.log('Wrong address');
            res.render('signup', {
                title: 'Express',
                message: 'Please enter a valid email address.',
            });
        }

    });
});
router.post('/advance', function (req, res) {
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
    connection.query('Insert into trip(tripid,ridetype,time1,time2,date,no_of_riders,book_time,email) values (NULL,"' + ridrordrive + '","' + time1 + '","' + time2 + '","' + fomatteddate + '","' + numriders + '","' + dateFormat(now, "yyyy-mm-dd hh:MM:ss") + '","' + email + '")', function (err) {
        if (err) throw err;
        res.redirect('/home');
    });

});
router.post('/instant', function (req, res) {
    var ridrordrive = req.body.riderdrive;
    //var slot = req.body.slot;
    var now = new Date();
    var nowback = now;
    var time1 = dateFormat(now, "hh:MM:ss");
    now.setTime(now.getTime() + 15 * 60 * 1000);
    var time2 = dateFormat(now, "hh:MM:ss");
    var email = req.session.email;
    var date = dateFormat(nowback, "yyyy-mm-dd");
    console.log(dateFormat(nowback, "YYYY-mm-dd hh:MM:ss"));
    //console.log(date);
    var numriders = 2;
    connection.query('Insert into trip(tripid,ridetype,time1,time2,date,no_of_riders,book_time,email) values (NULL,"' + ridrordrive + '","' + time1 + '","' + time2 + '","' + date + '","' + numriders + '","' + dateFormat(nowback, "yyyy-mm-dd hh:MM:ss") + '","' + email + '")', function (err) {
        if (err) throw err;

        connection.query('SELECT tripid FROM customer where book_time="' + dateFormat(nowback, "yyyy-mm-dd hh:MM:ss") + '"', function (err, rows, fields) {

            var options = {
                args: [rows[0].tripid],
                scriptPath: path.join(__dirname, '..')
            };
            if (ridrordrive == "rider")
                PythonShell.run('worker_instant_rider.py', options, function (err, results) {
                    if (err) throw err;
                    // results is an array consisting of messages collected during execution
                    console.log("I am at least till here")
                    console.log('results: %j', results);
                    res.redirect('/bookings');
                });
            else {
                PythonShell.run('worker_instant_driver.py', options, function (err, results) {
                    if (err) throw err;
                    // results is an array consisting of messages collected during execution
                    console.log("I am at least till here")
                    console.log('results: %j', results);
                    res.redirect('/bookings');
                });
            }
        });
        //res.redirect('/home');
    });
});


router.get('/bookings', function (req, res) {

     var options = {
                args: [req.session.email],
             scriptPath: path.join(__dirname, '..')
            };
    
    PythonShell.run('triphistory.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        res.render('bookings', {
            tabletoshow: results[0],
            title: 'Express'
        });
    });
});

router.post('/updateaddress', function (req, res) {
    var home = req.body.home;
    var office = req.body.office;
    var homegeo;
    var workgeo;
    var email = req.session.email;

    console.log(home);
    console.log(office);

    var geocodeParams = {
        "address": home,
        "language": "en"
    };

    gmAPI.geocode(geocodeParams, function (err, result) {
        homegeo = result.results[0].geometry.location;

        console.log(homegeo);
        connection.query('update customer set homelat ="' + homegeo.lat + '",homelong="' + homegeo.lng + '" where email="' + email + '"', function (err) {
            if (err) throw err;
        });
    });

    geocodeParams = {
        "address": office,
        "language": "en"
    };

    gmAPI.geocode(geocodeParams, function (err, result) {
        workgeo = result.results[0].geometry.location;
        console.log(workgeo);
        connection.query('update customer set worklat ="' + workgeo.lat + '",worklong ="' + workgeo.lng + '" where email="' + email + '"', function (err) {
            if (err) throw err;

        });
    });

    res.redirect('/home');
});

router.post('/driversetup', function (req, res) {
    var license = req.body.license;
    var state = req.body.state;
    var model = req.body.model;
    var carnum = req.body.carnum;
    var carcolor = req.body.carcolor;
    var caryear = req.body.caryear;
    var ssn = req.body.ssn;
    var email = req.session.email;
    console.log(license);
    console.log(state);
    console.log(model);
    console.log(carnum);
    console.log(caryear);
    console.log(ssn);
    console.log(email);

    connection.query('Insert into driver(email,license_number,license_state,car_number,car_model,ssn,carcolor) values ("' + email + '","' + license + '","' + state + '","' + carnum + '","' + model + '","' + ssn + '","' + carcolor + '")', function (err) {
        if (err) throw err;
        res.redirect('/home');
    });


});


router.get('/verify/:token', function (req, res) {
    var token = req.params.token;
    console.log('SELECT email from customer where token="' + token + '" and verified = 0 ');
    connection.query('SELECT email from customer where token="' + token + '" and verified = 0 ', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            connection.query('update customer set verified = 1 where email="' + rows[0].email + '"', function (err) {
                if (err) throw err;
                res.redirect('/verified');
            });
        } else {
            res.redirect('/verifyerror');
        }
    });
});

router.get('/verified', function (req, res, next) {
    res.render('verified', {
        title: 'Express'
    });
});
router.get('/verifyerror', function (req, res, next) {
    res.render('verifyerror', {
        title: 'Express'
    });
});

router.get('/signupsuccess', function (req, res, next) {
    res.render('signupsuccess', {
        title: 'Express'
    });
});

router.get('/logout', function (req, res) {
    if (req.session.login == "set") {
        req.session.login = "";
        req.session.email = "";
        res.redirect('/');
    } else {
        res.redirect('/');
    }

});

module.exports = router;
