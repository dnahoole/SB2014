function init() {
    document.getElementById('btnHdr').addEventListener('click', changeText, false);
    if (document.getElementById("myMusic")) {
        var theMusic=document.getElementById("selMusic").options[0].value;
        changeMusic(theMusic);
    }
}

function mouseOver(e) {
    e.target.className = "moveImg";
}

function mouseOut(e) {
    e.target.className = "noClass";
}

function changeText(e) {
    var hdr_text = document.getElementById('txtHdr').value ;
    document.getElementById('title').innerHTML = hdr_text;
}

function changeMusic(theMusic)
{
    // alert(theMusic);
    document.getElementById("mySel").setAttribute("src", theMusic);
    document.getElementById("myMusic").load();
    document.getElementById("myMusic").play();
}

window.addEventListener("load", init, false);