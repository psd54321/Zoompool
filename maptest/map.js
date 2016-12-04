var mapkey = require('../config/mapconfig');
var GoogleMapsAPI = require('googlemaps');
var polyline = require('polyline');

var publicConfig = {
    key: mapkey.key,
    encode_polylines: false
}

var gmAPI = new GoogleMapsAPI(publicConfig);

//var org = new google.maps.LatLng ( -33.89192157947345,151.13604068756104);
//var dest = new google.maps.LatLng ( -33.69727974097957,150.29047966003418);

var geocodeParams = {
    "address": "121, Curtain Road, EC2A 3AD, London UK",
    "components": "components=country:GB",
    "bounds": "55,-1|54,1",
    "language": "en",
    "region": "uk"
};

//gmAPI.geocode(geocodeParams, function (err, result) {
  //  console.log(result);
//});


var directionParams = {
    origin: '-33.89192157947345,151.13604068756104',
    destination: '-33.69727974097957,150.29047966003418',
    travelMode: 'DRIVING'
};

gmAPI.directions(directionParams, function(err, results) {
      console.log(polyline.decode(results.routes[0].overview_polyline.points).length);
    //gmAPI.geometry.encoding.decodePath()
  });
