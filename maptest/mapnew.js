var mapkey = require('../config/mapconfig');
var GoogleMapsAPI = require('googlemaps');
var polyline = require('polyline');
var async = require('async');
var publicConfig = {
    key: mapkey.key
    , encode_polylines: false
}
var gmAPI = new GoogleMapsAPI(publicConfig);
<<<<<<< Updated upstream
/*Distance and duration can be calculated from the source to destination
=======



//Distance and duration can be calculated from the source to destination
>>>>>>> Stashed changes

var distanceParams = {
    origin: '40.61862, -74.03071',
    destination: '40.70609, -73.99686',
    mode: 'driving'
};
<<<<<<< Updated upstream
gmAPI.distance(distanceParams, function (err, results){
    console.log(getMiles(results.rows[0].elements[0].distance.value));
    console.log(results.rows[0].elements[0].duration.value);
});*/
=======
gmAPI.directions(distanceParams, function (err, results){
    console.log(getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results.routes[0].overview_polyline.points),40.63241, -74.02958)));
   // console.log(results.rows[0].elements[0].duration.value);
});

>>>>>>> Stashed changes
var drivers = {
    "Paul": [[40.61862, -74.03071], [40.70609, -73.99686]]
    , "Alice": [[40.83275, -72.99247], [40.71278, -74.00594]]
};
var riders = {
    "Swena": [[40.63241, -74.02958], [40.69462, -73.98563]]
    , "Ashwin": [[40.77113, -73.97419], [40.82563, -73.93024]]
    , "Prathamesh": [[40.84520, -73.87388], [40.84520, -73.87388]]
    , "Harsh": [[40.69462, -73.98563], [40.75901, -73.98447]]
    , "Raj": [[40.68418, -73.97517], [40.75901, -73.98447]]
};

var range = {
    "1": "tp1",
    "2": "waste"
}
var drivermemo = {};
//allocateRiders();
<<<<<<< Updated upstream
/*var allocateRiders = function (callback) {
    async.forEachOf(riders, function (ridervalue, ridername, callback) {
        drivermemo[ridername] = {};
        async.forEachOf(drivers, function (drivervalue, drivername, callback) {
            getDistance(drivername, ridername, function (dis) {
                drivermemo[ridername][drivername] = dis;
=======
var waypoint = "";
var count = 1;

var allocateRiders = function (callback) {
    async.forEachOf(drivers, function (drivervalue, drivername, callback) {
        waypoint = "";
        min = -1;
        r = "";
        coordinates = -1;
        drivermemo[drivername] = [];
        console.log("driver -> " + drivername);
        async.forEachOf(range, function (rangevalue, rangename, callback) {
            console.log("Range -> " + rangename);
            count = 1;
            async.forEachOf(riders, function (ridervalue, ridername, callback) {
                console.log("rider -> " + ridername);
                var directionParams = {};
                var dis = [];
                if (waypoint == "") {
                    directionParams = {
                        origin: drivers[drivername][0][0] + "," + drivers[drivername][0][1],
                        destination: drivers[drivername][1][0] + "," + drivers[drivername][1][1],
                        //waypoints: 'optimize:true|via:40.77113, -73.97419|40.84520, -73.87388',
                        travelMode: 'DRIVING'
                    };
                } else {
                    directionParams = {
                        origin: drivers[drivername][0][0] + "," + drivers[drivername][0][1],
                        destination: drivers[drivername][1][0] + "," + drivers[drivername][1][1],
                        waypoints: 'optimize:true|via:' + waypoint,
                        travelMode: 'DRIVING'
                    };
                }
                gmAPI.directions(directionParams, function (err, results) {
                    //This will calculate the closest distance of a point from a line.cons
                    if (ridername in riders) {
                        //console.log(JSON.stringify(results));
                        var dbeg = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results.routes[0].overview_polyline.points), riders[ridername][0][0], riders[ridername][0][1]));
                        var dend = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results.routes[0].overview_polyline.points), riders[ridername][1][0], riders[ridername][1][1]));
                        console.log("DONE");
                        dis = [dbeg > dend ? dend : dbeg, dbeg > dend ? 1 : 0];
                        if ((dis[0] <= 1 && min == -1) || (dis[0] <= 1 && dis < min)) {
                            min = dis[0];
                            r = ridername;
                            coordinates = dis[1];
                        }
                        console.log(r);
                        console.log(Object.keys(riders).length);
                        if (count++ == Object.keys(riders).length && (r in riders)) {
                            console.log('r -> ' + r);
                            drivermemo[drivername].push(r);
                            waypoint = riders[r][coordinates][0] + "," + riders[r][coordinates][1];
                            delete riders[r];

                            count = 1;
                        }
                    }
                    //callback();
                });

            }, function (err) {



>>>>>>> Stashed changes
                callback();
            });
        }, function (err) {
            // inner loop complete give call to outer loop
            console.log("wsq");
            callback();
        });
    }, function (err) {
        // All items are processed
        // Here is the finished result
        callback(undefined, drivermemo);
    });
<<<<<<< Updated upstream
};*/
var allocateRiders = function (callback) {
=======
};

/*var allocateRiders = function (callback) {
>>>>>>> Stashed changes
    async.forEachOf(drivers, function (drivervalue, drivername, callback) {
        waypoint = "";
        min = -1;
        r = "";
        coordinates = -1;
        drivermemo[drivername] = [];
<<<<<<< Updated upstream
        count = 0;
        async.whilst(function () {
            return count < 2;
        }, function (callback) {
            count++;
            async.forEachOf(riders, function (ridervalue, ridername, callback) {
                getDistance(drivername, ridername, waypoint, function (dis) {
=======
        console.log(drivername);
        console.log('start');
        async.forEachOf(range, function (rangevalue, rangename, callback) {
            async.forEachOf(riders, function (ridervalue, ridername, callback) {
                //console.log(ridername);
                getDistance(drivername, ridername, waypoint, function (dis) {

>>>>>>> Stashed changes
                    if ((dis[0] <= 1 && min == -1) || (dis[0] <= 1 && dis < min)) {
                        min = dis[0];
                        r = ridername;
                        coordinates = dis[1];
                    }
                    callback();
                });
            }, function (err) {
                // inner loop complete give call to outer loop
                drivermemo[drivername].push(r);
<<<<<<< Updated upstream
                delete riders[ridername];
                waypoint = riders[ridername][coordinates][0] + "," + riders[ridername][coordinates][1];
                callback(null, count);
            });
        }, function (err, n) {
            // 5 seconds have passed, n = 5
            callback();
        });
=======
                waypoint = riders[r][coordinates][0] + "," + riders[r][coordinates][1];
                delete riders[r];
                console.log('after inner for done');

                callback();

            });
        }, function (err) {
            callback();
        });

>>>>>>> Stashed changes
    }, function (err) {
        // All items are processed
        // Here is the finished result
        console.log('end');
        callback(undefined, drivermemo);
    });
};*/
//This will make an object having each driver's shortest distance from rider. 
//Rider will be allocated to the driver who has the least shortest distance and more over who has the distance < 1 mile. 
//If none of the drivers is < 1 mile away, then rider won't be allocated to any driver.
//The driver won't be checked for a rider if two riders are already allocated to them
/*function allocateRiders()
{
   for(rider in riders)
   {
        drivermemo[rider]={};
        for(driver in drivers)
        {
            getDistance(driver,rider,function (dis){
                drivermemo[rider][driver]=dis;
            });
        }

   }
   console.log(drivermemo);

}*/
allocateRiders(function (err, matches) {
    // users here
    console.log(matches);
});
/*allocateRiders(function (err, matches) {
    // users here
    //console.log(matches);
    var driverAllocation = {};
    for(driver in drivers)
    {
        driverAllocation[driver] = [];
        var min = -1;
        var selectedrider = "";
        for(var i=0;i<2;i++)
        {
            min = -1;
            flag=0;
            for(rider in matches)
            {
                if(min==-1 && selectedrider!=rider && matches[rider][driver]<=1)
                {
                    min = matches[rider][driver];
                    selectedrider = rider;
                    flag=1;
                }
                else if(matches[rider][driver] <min && selectedrider!=rider && matches[rider][driver]<=1)
                {
                    min=matches[rider][driver];
                    selectedrider=rider;
                    flag=1;
                }
                /*if(matches[rider][driver]>1)
                {
                    selectedrider = "";
                }*/
/* }
            if(flag==1)
            {
                driverAllocation[driver].push(selectedrider);
            //console.log(matches);
                delete matches[selectedrider];
            }
        }
    }
    console.log(driverAllocation);
});*/
//This calculates rider's shortest distance from driver's polyline
function getDistance(driver, rider, waypoint, callback) {
<<<<<<< Updated upstream
=======
    //console.log('in '+rider);

>>>>>>> Stashed changes
    var directionParams = {};
    if (waypoint == "") {
        directionParams = {
            origin: drivers[driver][0][0] + "," + drivers[driver][0][1]
            , destination: drivers[driver][1][0] + "," + drivers[driver][1][1], //waypoints: 'optimize:true|via:40.77113, -73.97419|40.84520, -73.87388',
            travelMode: 'DRIVING'
        };
<<<<<<< Updated upstream
    }
    else {
        directionParams = {
            origin: drivers[driver][0][0] + "," + drivers[driver][0][1]
            , destination: drivers[driver][1][0] + "," + drivers[driver][1][1]
            , waypoints: 'optimize:true|via:' + waypoint
            , travelMode: 'DRIVING'
=======
    } else {
        directionParams = {
            origin: drivers[driver][0][0] + "," + drivers[driver][0][1],
            destination: drivers[driver][1][0] + "," + drivers[driver][1][1],
            waypoints: 'optimize:true|via:' + waypoint,
            travelMode: 'DRIVING'
>>>>>>> Stashed changes
        };
    }
    gmAPI.directions(directionParams, function (err, results) {
        //This will calculate the closest distance of a point from a line.
        var dbeg = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results.routes[0].overview_polyline.points), riders[rider][0][0], riders[rider][0][1]));
        var dend = getMiles(bdccGeoDistanceToPolyMtrs(polyline.decode(results.routes[0].overview_polyline.points), riders[rider][1][0], riders[rider][1][1]));
<<<<<<< Updated upstream
=======
        console.log("DONE");
>>>>>>> Stashed changes
        callback([dbeg > dend ? dend : dbeg, dbeg > dend ? 1 : 0]);
    });
}

function getMiles(i) {
    return i * 0.000621371192;
}

function bdccGeo(lat, lon) {
    var theta = (lon * Math.PI / 180.0);
    var rlat = bdccGeoGeocentricLatitude(lat * Math.PI / 180.0);
    var c = Math.cos(rlat);
    this.x = c * Math.cos(theta);
    this.y = c * Math.sin(theta);
    this.z = Math.sin(rlat);
}
bdccGeo.prototype = new bdccGeo();
// internal helper functions =========================================
// Convert from geographic to geocentric latitude (radians).
function bdccGeoGeocentricLatitude(geographicLatitude) {
    var flattening = 1.0 / 298.257223563; //WGS84
    var f = (1.0 - flattening) * (1.0 - flattening);
    return Math.atan((Math.tan(geographicLatitude) * f));
}
// Returns the two antipodal points of intersection of two great
// circles defined by the arcs geo1 to geo2 and
// geo3 to geo4. Returns a point as a Geo, use .antipode to get the other point
function bdccGeoGetIntersection(geo1, geo2, geo3, geo4) {
    var geoCross1 = geo1.crossNormalize(geo2);
    var geoCross2 = geo3.crossNormalize(geo4);
    return geoCross1.crossNormalize(geoCross2);
}
//from Radians to Meters
function bdccGeoRadiansToMeters(rad) {
    return rad * 6378137.0; // WGS84 Equatorial Radius in Meters
}
//from Meters to Radians
function bdccGeoMetersToRadians(m) {
    return m / 6378137.0; // WGS84 Equatorial Radius in Meters
}
// properties =================================================
bdccGeo.prototype.getLatitudeRadians = function () {
    return (bdccGeoGeographicLatitude(Math.atan2(this.z, Math.sqrt((this.x * this.x) + (this.y * this.y)))));
}
bdccGeo.prototype.getLongitudeRadians = function () {
    return (Math.atan2(this.y, this.x));
}
bdccGeo.prototype.getLatitude = function () {
    return this.getLatitudeRadians() * 180.0 / Math.PI;
}
bdccGeo.prototype.getLongitude = function () {
        return this.getLongitudeRadians() * 180.0 / Math.PI;
    }
    // Methods =================================================
    //Maths
bdccGeo.prototype.dot = function (b) {
        return ((this.x * b.x) + (this.y * b.y) + (this.z * b.z));
    }
    //More Maths
bdccGeo.prototype.crossLength = function (b) {
        var x = (this.y * b.z) - (this.z * b.y);
        var y = (this.z * b.x) - (this.x * b.z);
        var z = (this.x * b.y) - (this.y * b.x);
        return Math.sqrt((x * x) + (y * y) + (z * z));
    }
    //More Maths
bdccGeo.prototype.scale = function (s) {
        var r = new bdccGeo(0, 0);
        r.x = this.x * s;
        r.y = this.y * s;
        r.z = this.z * s;
        return r;
    }
    // More Maths
bdccGeo.prototype.crossNormalize = function (b) {
        var x = (this.y * b.z) - (this.z * b.y);
        var y = (this.z * b.x) - (this.x * b.z);
        var z = (this.x * b.y) - (this.y * b.x);
        var L = Math.sqrt((x * x) + (y * y) + (z * z));
        var r = new bdccGeo(0, 0);
        r.x = x / L;
        r.y = y / L;
        r.z = z / L;
        return r;
    }
    // point on opposite side of the world to this point
bdccGeo.prototype.antipode = function () {
        return this.scale(-1.0);
    }
    //distance in radians from this point to point v2
bdccGeo.prototype.distance = function (v2) {
        return Math.atan2(v2.crossLength(this), v2.dot(this));
    }
    //returns in meters the minimum of the perpendicular distance of this point from the line segment geo1-geo2
    //and the distance from this point to the line segment ends in geo1 and geo2 
bdccGeo.prototype.distanceToLineSegMtrs = function (geo1, geo2) {
        //point on unit sphere above origin and normal to plane of geo1,geo2
        //could be either side of the plane
        var p2 = geo1.crossNormalize(geo2);
        // intersection of GC normal to geo1/geo2 passing through p with GC geo1/geo2
        var ip = bdccGeoGetIntersection(geo1, geo2, this, p2);
        //need to check that ip or its antipode is between p1 and p2
        var d = geo1.distance(geo2);
        var d1p = geo1.distance(ip);
        var d2p = geo2.distance(ip);
        //window.status = d + ", " + d1p + ", " + d2p;
        if ((d >= d1p) && (d >= d2p)) return bdccGeoRadiansToMeters(this.distance(ip));
        else {
            ip = ip.antipode();
            d1p = geo1.distance(ip);
            d2p = geo2.distance(ip);
        }
        if ((d >= d1p) && (d >= d2p)) return bdccGeoRadiansToMeters(this.distance(ip));
        else return bdccGeoRadiansToMeters(Math.min(geo1.distance(this), geo2.distance(this)));
    }
    // distance in meters from GLatLng point to GPolyline or GPolygon poly
function bdccGeoDistanceToPolyMtrs(poly, lat, lang) {
    var d = 999999999;
    var i;
    var p = new bdccGeo(lat, lang);
    for (i = 0; i < (poly.length - 1); i++) {
        var p1 = poly[i];
        //console.log(p1[0],p1[1]);
        var l1 = new bdccGeo(p1[0], p1[1]);
        var p2 = poly[i + 1];
        var l2 = new bdccGeo(p2[0], p2[1]);
        var dp = p.distanceToLineSegMtrs(l1, l2);
        if (dp < d) d = dp;
    }
    return d;
}