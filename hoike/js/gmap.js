function GIS() {

const apikey = 'AIzaSyCqZvNGEW2Wo_UtukN9jl3YLUe3WK2h8wY';
const WAILUKU_LAT = 20.8911111;
const WAILUKU_LON = -156.5047222;

//--- Object attributes
var geocoder = null;
var map = null;

var layer1 = null;          // HosmersGrove Track layer
var layer2 = null;          // HosmersGrove Waypoints layer
var layer3 = null;          // Hokulea Waypoints layer

var mybase = null;

var that = this;

this.init = function() {
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        center: new google.maps.LatLng(WAILUKU_LAT, WAILUKU_LON),
        mapTypeId:google.maps.MapTypeId.TERRAIN,
        zoom: 10
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    document.getElementById('goto').addEventListener('click', that.codeAddress, false);
    mybase = document.getElementById("mybase").getAttribute("href");

    init1();
    init2();
    init3();
}

// Haleakala Track layer
function init1() {
    layer1 = new google.maps.KmlLayer({ url: mybase+'kml/HosmersGroveTrack.kml' });
    document.getElementById('layer1').addEventListener('click', that.showLayer1, false);
}

// Haleakala Waypoints layer
function init2() {
    layer2 = new google.maps.KmlLayer({ url: mybase+'kml/HosmersGroveWaypoints.kml' });
    document.getElementById('layer2').addEventListener('click', that.showLayer2, false);
}

// Hokulea Waypoints layer
function init3() {
    layer3 = new google.maps.KmlLayer({ url: mybase+'kml/HokuleaWaypoints.kml' });
    document.getElementById('layer3').addEventListener('click', that.showLayer3, false);
}

this.showLayer1 = function() {
    var flag = document.getElementById("layer1").checked;
    if (flag) {
        layer1.setMap(map);
    } else {
        layer1.setMap(null);
    }
}

this.showLayer2 = function() {
    var flag = document.getElementById("layer2").checked;
    if (flag) {
        layer2.setMap(map);
    } else {
        layer2.setMap(null);
    }
}

this.showLayer3 = function() {
    var flag = document.getElementById("layer3").checked;
    if (flag) {
        layer3.setMap(map);
    } else {
        layer3.setMap(null);
    }
}

this.codeAddress = function() {
    var address = document.getElementById("address").value;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            
            var infoText = createInfoText(address, results[0]);
            
            var infowindow = new google.maps.InfoWindow({
                content: infoText,
                map: map,
                position: results[0].geometry.location
            });
            
            infowindow.open(map);

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function createInfoText(address, result) {
    var infoText = "<p class='info-win'>" +
    "<h3>" + address + "</h3>" +
    "<strong>Latitude</strong>: " +
    result.geometry.location.lat() +
    "<br><strong>Longitude</strong>: " +
    result.geometry.location.lng() + "</p>";

    return infoText;
}

} //--- end of custom GIS object

var gis = new GIS();
google.maps.event.addDomListener(window, 'load', gis.init);
