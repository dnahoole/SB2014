function GIS() {

const WAILUKU_LAT = 20.8911111;
const WAILUKU_LON = -156.5047222;

//--- Object attributes
var geocoder = null;
var map = null;
var layer1 = null;          // Haleakala Track layer
var layer2 = null;          // Haleakala Waypoints layer
var layer3 = null;          // Hokulea Waypoints layer

var traffic = null;
var weather = null;
var clouds = null;

var mybase = null;

var self = this;

this.init = function(myview) {
    self.mybase = "https://googledrive.com/host/0B7wcpcDhycied05Jdk1sbWxwc1k/";
    self.geocoder = new google.maps.Geocoder();
    var mapOptions = {
        center: new google.maps.LatLng(WAILUKU_LAT, WAILUKU_LON),
        zoom: 10
    };
    self.map = new google.maps.Map(document.getElementById(myview), mapOptions);
    document.getElementById('goto').addEventListener('click', self.codeAddress, false);

    // Haleakala Track layer
    self.layer1 = new google.maps.KmlLayer({ url: self.mybase+'kml/HaleakalaTrack.kml' });
    document.getElementById('layer1').addEventListener('click', self.showLayer1, false);

    // Haleakala Waypoints layer
    self.layer2 = new google.maps.KmlLayer({ url: self.mybase+'kml/HaleakalaWaypoints.kml' });
    document.getElementById('layer2').addEventListener('click', self.showLayer2, false);

    // Hokulea Waypoints layer
    self.layer3 = new google.maps.KmlLayer({ url: self.mybase+'kml/HokuleaWaypoints.kml' });
    document.getElementById('layer3').addEventListener('click', self.showLayer3, false);
    
    // Traffic layer
    self.traffic = new google.maps.TrafficLayer();
    document.getElementById('traffic').addEventListener('click', self.trafficLayer, false);
    
    // Weather & Cloud layer
    self.weather = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
    });
    self.clouds = new google.maps.weather.CloudLayer();
    document.getElementById('weather').addEventListener('click', self.weatherLayer, false);
}

this.showLayer1 = function() {
    var flag = document.getElementById("layer1").checked;
    if (flag) {
        self.layer1.setMap(self.map);
    } else {
        self.layer1.setMap(null);
    }
}

this.showLayer2 = function() {
    var flag = document.getElementById("layer2").checked;
    if (flag) {
        self.layer2.setMap(self.map);
    } else {
        self.layer2.setMap(null);
    }
}

this.showLayer3 = function() {
    var flag = document.getElementById("layer3").checked;
    if (flag) {
        self.layer3.setMap(self.map);
    } else {
        self.layer3.setMap(null);
    }
}

this.trafficLayer = function() {
    var flag = document.getElementById("traffic").checked;
    if (flag) {
        self.traffic.setMap(self.map);
    } else {
        self.traffic.setMap(null);
    }
}

this.weatherLayer = function() {
    var flag = document.getElementById("weather").checked;
    if (flag) {
        self.weather.setMap(self.map);
        self.clouds.setMap(self.map);
    } else {
        self.weather.setMap(null);
        self.clouds.setMap(null);
    }
}

this.codeAddress = function() {
    var address = document.getElementById("address").value;
    self.geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            self.map.setCenter(results[0].geometry.location);
            
            var infoText = self.createInfoText(address, results[0]);
            
            var infowindow = new google.maps.InfoWindow({
                content: infoText,
                map: self.map,
                position: results[0].geometry.location
            });
            
            infowindow.open(self.map);

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

this.createInfoText = function(address, result) {
    var infoText = "<p class='info-win'>" +
    "<h3>" + address + "</h3>" +
    "<strong>Latitude</strong>: " +
    result.geometry.location.lat() +
    "<br><strong>Longitude</strong>: " +
    result.geometry.location.lng() + "</p>";

    return infoText;
}

} //--- end of custom GIS object
