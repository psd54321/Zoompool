var maps = require('google-maps');
var map_config = require('../config/keys');

maps.KEY = keys.mapsKey;

maps.load(function (google){
	new google.maps.Map(el,options);
});

/*function displayRoute() {

    var start = new google.maps.LatLng(28.694004, 77.110291);
    var end = new google.maps.LatLng(28.72082, 77.107241);

    var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService(); 
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}*/