var map;
var markers = [];
var mobile = false;




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

