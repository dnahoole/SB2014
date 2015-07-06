function GIS(node) {
this.ge = null;
this.tour = null;
this.geocoder = null;
this.mybase = null;
this.targetId = 0;
this.layers = [];
this.container = node;

this.init = function() {
    google.earth.createInstance(this.container, this.initCB, this.failureCB);
};

this.initCB = function(instance) {
    this.ge = instance;
    this.ge.getWindow().setVisibility(true);
    this.geocoder = new google.maps.Geocoder();
    this.mybase = document.getElementById("mybase").getAttribute("href");

    // add a navigation control
    this.ge.getNavigationControl().setVisibility(this.ge.VISIBILITY_AUTO);
    document.getElementById('installed-plugin-version').innerHTML = this.ge.getPluginVersion().toString();

    document.getElementById('tour1').addEventListener('click', kmlLoad, false);
    document.getElementById('waypoints1').addEventListener('click', kmlLoad, false);
    document.getElementById('waypoints2').addEventListener('click', kmlLoad, false);
};

this.failureCB = function(errorCode) {};

this.buttonClick = function() {
    var address = document.getElementById("location").value;
    this.geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0].geometry.location);
            var point = results[0].geometry.location;
            var lookAt = this.ge.createLookAt('');
            lookAt.set(point.lat(), point.lng(), 10, this.ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 60, 1250);
            this.ge.getView().setAbstractView(lookAt);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
};

this.updateOptions = function() {
    var options = this.ge.getOptions();
    var form = document.getElementById("cbox");

    options.setStatusBarVisibility(form.statusbar.checked);
    options.setGridVisibility(form.grid.checked);
    options.setScaleLegendVisibility(form.scaleLegend.checked);
    options.setAtmosphereVisibility(form.atmosphere.checked);
    
    if (form.borders.checked) {
        this.ge.getLayerRoot().enableLayerById(this.ge.LAYER_BORDERS, true);
    } else {
        ge.getLayerRoot().enableLayerById(this.ge.LAYER_BORDERS, false);
    }
    if (form.roads.checked) {
        this.ge.getLayerRoot().enableLayerById(this.ge.LAYER_ROADS, true);
    } else {
        this.ge.getLayerRoot().enableLayerById(this.ge.LAYER_ROADS, false);
    }
};

this.kmlLoad = function(e) {
    if (e.target.checked) {
        var href = "";
        this.targetId = e.target.id;
        
        switch(e.target.id) {
        case "tour1":
            href = this.mybase + "kml/HaleakalaTour.kml";
            google.earth.fetchKml(this.ge, href, kmlTour);
            break;
        case "waypoints1":
            href = this.mybase + "kml/HaleakalaWaypoints.kml";
            google.earth.fetchKml(this.ge, href, kmlTrack);
            break;
        case "waypoints2":
//            href = this.mybase + "kml/HokuleaWaypoints.kml";
            href = this.mybase + "kml/hokulea_mapsdata2.kml";
            google.earth.fetchKml(this.ge, href, kmlTrack);
            break;
        default:
            return;
        }
    } else {
        if (this.tour) {
            this.ge.getTourPlayer().setTour(null);
            this.tour = null;
        }
        this.ge.getFeatures().removeChild(this.layers[e.target.id]);
    }
};

this.kmlTrack = function(kmlObject) {
    this.layers[this.targetId] = kmlObject;
    this.ge.getFeatures().appendChild(kmlObject);
};

this.kmlTour = function(kmlObject) {
  if (!kmlObject) {
    // wrap alerts in API callbacks and event handlers
    // in a setTimeout to prevent deadlock in some browsers
    setTimeout(function() {
      alert('Bad or null KML.');
    }, 0);
    return;
  }

  // Show the entire KML file in the plugin.
  this.layers[this.targetId] = kmlObject;
  this.ge.getFeatures().appendChild(kmlObject);

  // Walk the DOM looking for a KmlTour
  walkKmlDom(kmlObject, function() {
    if (this.getType() == 'KmlTour') {
       this.tour = this;
       return false; // stop the DOM walk here.
    }
  });

    if (this.tour) {
        this.ge.getTourPlayer().setTour(this.tour);
        this.ge.getTourPlayer().play();
    } else {
        alert('No tour data found!');
    }
};

this.failureCallback = function(errorCode) {
};

};

