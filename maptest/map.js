var mapkey = require('../config/mapconfig');
var GoogleMapsAPI = require('googlemaps');
var polyline = require('polyline');

var publicConfig = {
    key: mapkey.key,
    encode_polylines: false
}

var gmAPI = new GoogleMapsAPI(publicConfig);


var directionParams = {
    origin: '-33.89192157947345,151.13604068756104',
    destination: '-33.69727974097957,150.29047966003418',
    travelMode: 'DRIVING'
};

gmAPI.directions(directionParams, function(err, results) {
      console.log(polyline.decode(results.routes[0].overview_polyline.points).length);
    //gmAPI.geometry.encoding.decodePath()
  });
