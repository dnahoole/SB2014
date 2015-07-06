var ge;
var tour = null;
var geocoder;
var mybase;
var targetId;
var layers = [];

google.load("earth", "1");
google.load("maps", "2");

function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
    ge = instance;
    ge.getWindow().setVisibility(true);
    geocoder = new google.maps.Geocoder();
    mybase = document.getElementById("mybase").getAttribute("href");

    // add a navigation control
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
    document.getElementById('installed-plugin-version').innerHTML = ge.getPluginVersion().toString();

    document.getElementById('tour1').addEventListener('click', kmlLoad, false);
    document.getElementById('tour2').addEventListener('click', kmlLoad, false);
    document.getElementById('tour3').addEventListener('click', kmlLoad, false);
    document.getElementById('waypoints1').addEventListener('click', kmlLoad, false);
    document.getElementById('waypoints2').addEventListener('click', kmlLoad, false);
    document.getElementById('waypoints3').addEventListener('click', kmlLoad, false);
    if (document.getElementById("myMusic")) {
        var theMusic=document.getElementById("selMusic").options[0].value;
        changeMusic(theMusic);
    }
}

function failureCB(errorCode) {}

function buttonClick() {
    var address = document.getElementById("location").value;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0].geometry.location);
            var point = results[0].geometry.location;
            var lookAt = ge.createLookAt('');
            lookAt.set(point.lat(), point.lng(), 10, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 60, 1250);
            ge.getView().setAbstractView(lookAt);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function updateOptions() {
    var options = ge.getOptions();
    var form = document.getElementById("cbox");

    options.setStatusBarVisibility(form.statusbar.checked);
    options.setGridVisibility(form.grid.checked);
    options.setScaleLegendVisibility(form.scaleLegend.checked);
    options.setAtmosphereVisibility(form.atmosphere.checked);
    
    if (form.borders.checked) {
        ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
    } else {
        ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
    }
    if (form.roads.checked) {
        ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
    } else {
        ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, false);
    }
}

function kmlLoad(e) {
    if (e.target.checked) {
        var href = "";
        targetId = e.target.id;
        
        switch(e.target.id) {
        case "tour1":
            href = mybase + "kml/PaelokoTour1.kml";
            google.earth.fetchKml(ge, href, kmlTour);
            break;
        case "tour2":
            href = mybase + "kml/PaelokoTour2.kml";
            google.earth.fetchKml(ge, href, kmlTour);
            break;
        case "tour3":
            href = mybase + "kml/PaelokoTour3.kml";
            google.earth.fetchKml(ge, href, kmlTour);
            break;
        case "waypoints1":
            href = mybase + "kml/PaelokoWaypoints1.kml";
            google.earth.fetchKml(ge, href, kmlTrack);
            break;
        case "waypoints2":
            href = mybase + "kml/PaelokoWaypoints2.kml";
            google.earth.fetchKml(ge, href, kmlTrack);
            break;
        case "waypoints3":
            href = mybase + "kml/PaelokoWaypoints3.kml";
            google.earth.fetchKml(ge, href, kmlTrack);
            break;
        default:
            return;
        }
    } else {
        if (tour) {
            ge.getTourPlayer().setTour(null);
            tour = null;
        }
        ge.getFeatures().removeChild(layers[e.target.id]);
    }
}

function kmlTrack(kmlObject) {
    layers[targetId] = kmlObject;
    ge.getFeatures().appendChild(kmlObject);
}

function kmlTour(kmlObject) {
  if (!kmlObject) {
    // wrap alerts in API callbacks and event handlers
    // in a setTimeout to prevent deadlock in some browsers
    setTimeout(function() {
      alert('Bad or null KML.');
    }, 0);
    return;
  }

  // Show the entire KML file in the plugin.
  layers[targetId] = kmlObject;
  ge.getFeatures().appendChild(kmlObject);

  // Walk the DOM looking for a KmlTour
  walkKmlDom(kmlObject, function() {
    if (this.getType() == 'KmlTour') {
       tour = this;
       return false; // stop the DOM walk here.
    }
  });

    if (tour) {
        ge.getTourPlayer().setTour(tour);
        ge.getTourPlayer().play();
    } else {
        alert('No tour data found!');
    }
}

function failureCallback(errorCode) {
}
function changeMusic(theMusic)
{
    // alert(theMusic);
    document.getElementById("mySel").setAttribute("src", theMusic);
    document.getElementById("myMusic").load();
    document.getElementById("myMusic").play();
}

google.setOnLoadCallback(init);
