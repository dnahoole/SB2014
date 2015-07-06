// Melting image section
const MELT = 'sect1';

function init() {
}

function mouseOver() {
    document.getElementById(MELT).className = "moveImg";
}

function mouseOut() {
    document.getElementById(MELT).className = "noClass";
}

function changeText() {
    var hdr_text = document.getElementById('txtHdr').value ;
    document.getElementById('title').innerHTML = hdr_text;
}

function changeMusic(urlMusic)
{
// alert(urlMusic);
   document.getElementById("mySel").setAttribute("src", urlMusic); 
   document.getElementById("myMusic").load();
   document.getElementById("myMusic").play();
}


window.addEventListener("load", init, false);