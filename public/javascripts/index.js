var map;
var markers = [];
var mobile = false;

function initMap() {
    // Create the map with no initial style specified.
    // It therefore has default styling.

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.729383,
            lng: -73.997148
        },
        zoom: 17,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        streetViewControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });

    map.setOptions({
        styles: styles['hiding']
    });

    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        
    });


    getByTag('library');
}


$(document).ready(function () {

});




function clearOverlays() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function isMobileWidth() {
    return $('#mobile-indicator').is(':visible');
}

var styles = {
    'hiding': [
        {
            featureType: 'poi.business',
            stylers: [{
                visibility: 'off'
            }]
      },
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
      }
    ]
};

