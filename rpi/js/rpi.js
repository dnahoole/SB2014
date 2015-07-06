// Melting image section
const vlc_server = "http://192.168.200.93/";
var targ;

function init() {
    var vlc = document.getElementById("vlc");
    vlc.audio.toggleMute();
}

function camera(cmd) {
    var request = vlc_server;
    
    switch (cmd) {
    case "Start":
        request += "cgi-bin/vidstream.php?command=http";
        break;
    case "Stop":
        request += "cgi-bin/vidstream.php?command=stop";
        break;
    }

    asyncRequest=new XMLHttpRequest();

    // set up callback function and store it
    asyncRequest.addEventListener("readystatechange",
                                  function(){ cameraCB(asyncRequest) }, true);

    asyncRequest.open( "GET", request, true ); 
    asyncRequest.setRequestHeader("Accept", "text/html; charset=utf-8" );
    asyncRequest.send();
}

function cameraCB(asyncRequest) {
    if (asyncRequest.readyState==4 && asyncRequest.status==200) {
        document.getElementById("camera_status").innerHTML = asyncRequest.responseText;
    }
}

function stream(cmd) {
    var request = vlc_server;
    
    switch (cmd) {
    case "Play":
        request += "requests/status.xml?command=pl_play&id=4";
        break;
    case "Pause":
        request += "requests/status.xml?command=pl_pause&id=4";
        break;
    case "Stop":
        request += "requests/status.xml?command=pl_stop";
        break;
    }

    
    asyncRequest=new XMLHttpRequest();

    // set up callback function and store it
    asyncRequest.addEventListener("readystatechange",
                                  function(){ streamCB(asyncRequest) }, true);

    asyncRequest.open( "GET", request, true ); 
    asyncRequest.setRequestHeader("Accept", "application/xml; charset=utf-8" );
    asyncRequest.setRequestHeader("Accept", "Access-Control-Allow-Origin");
    asyncRequest.send();
}

function streamCB(asyncRequest) {
    if (asyncRequest.readyState==4 && asyncRequest.status==200) {
        var data = asyncRequest.responseXML;
        
        if (window.DOMParser) {
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(data,"text/xml");
        } else {
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async=false;
          xmlDoc.loadXML(data); 
        }
        
//        var txt=xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
        document.getElementById("stream_status").innerHTML = xmlDoc;
    }
}

function registerVLCEvent(event, handler) {
    var vlc = getVLC("vlc");
    if (vlc) {
        if (vlc.attachEvent) {
            // Microsoft
            vlc.attachEvent (event, handler);
        } else if (vlc.addEventListener) {
            // Mozilla: DOM level 2
            vlc.addEventListener (event, handler, false);
        } else {
            // DOM level 0
            vlc["on" + event] = handler;
        }
    }
}

// stop listening to event
function unregisterVLCEvent(event, handler) {
    var vlc = getVLC("vlc");
    if (vlc) {
        if (vlc.detachEvent) {
            // Microsoft
            vlc.detachEvent (event, handler);
        } else if (vlc.removeEventListener) {
            // Mozilla: DOM level 2
            vlc.removeEventListener (event, handler, false);
        } else {
            // DOM level 0
            vlc["on" + event] = null;
        }
    }
}

// event callback function for testing
function handleEvents(event) {
    if (!event) {
        event = window.event; // IE
        if (event.target) {
            // Netscape based browser
            targ = event.target;
        } else if (event.srcElement) {
            // ActiveX
            targ = event.srcElement;
        } else {
            // No event object, just the value
            alert("Event value" + event );
            return;
        }
        if (targ.nodeType == 3) { // defeat Safari bug
            targ = targ.parentNode;
            alert("Event " + event.type + " has fired from " + targ );
        }
    }
}

// handle mouse grab event from video filter
function handleMouseGrab(event,X,Y) {
    if (!event)
        event = window.event; // IE
        alert("new position (" + X + "," + Y + ")");
}

// Register a bunch of callbacks.
registerVLCEvent('MediaPlayerNothingSpecial', handleEvents);
registerVLCEvent('MediaPlayerOpening', handleEvents);
registerVLCEvent('MediaPlayerBuffering', handleEvents);
registerVLCEvent('MediaPlayerPlaying', handleEvents);
registerVLCEvent('MediaPlayerPaused', handleEvents);
registerVLCEvent('MediaPlayerForward', handleEvents);
registerVLCEvent('MediaPlayerBackward', handleEvents);
registerVLCEvent('MediaPlayerEncounteredError', handleEvents);
registerVLCEvent('MediaPlayerEndReached', handleEvents);
registerVLCEvent('MediaPlayerTimeChanged', handleEvents);
registerVLCEvent('MediaPlayerPositionChanged', handleEvents);
registerVLCEvent('MediaPlayerSeekableChanged', handleEvents);
registerVLCEvent('MediaPlayerPausableChanged', handleEvents);

window.addEventListener("load", init, false);