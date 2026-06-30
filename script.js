// ======================
// Create Map
// ======================

const map = L.map("map", {
    zoomControl: false
}).setView([9.32, 78.30], 9);

// Move Zoom Controls
L.control.zoom({
    position: "bottomright"
}).addTo(map);

// ======================
// OpenStreetMap
// ======================

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap Contributors",
        maxZoom: 19
    }
).addTo(map);

// ======================
// Elements
// ======================

const siteList = document.getElementById("siteList");
const searchBox = document.getElementById("searchBox");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const showSidebar = document.getElementById("showSidebar");
const locateBtn = document.getElementById("locateBtn");

let myLocationMarker = null;    

let sites = [];
let markers = [];

// ======================
// Load JSON
// ======================

fetch("sites.json")
.then(res => res.json())
.then(data=>{

    sites=data;

    loadSites(sites);

    const group=L.featureGroup(markers);

    map.fitBounds(group.getBounds().pad(0.15));

});

// ======================
// Load Sites
// ======================

function loadSites(list){

    siteList.innerHTML="";

    markers.forEach(m=>map.removeLayer(m));

    markers=[];

    list.forEach(site=>{

        const pinIcon = L.divIcon({
    className: "custom-pin",
    html: `
        <div class="pin">
            <span>${site.id}</span>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

const marker = L.marker(
    [site.lat, site.lng],
    { icon: pinIcon }
).addTo(map);

       marker.bindPopup(`

        <h3>${site.name}</h3>

         <b>Site No :</b> ${site.id}<br>

        <b>Village :</b> ${site.village || "-"}<br>

        <b>Latitude :</b> ${site.lat}<br>

         <b>Longitude :</b> ${site.lng}<br><br>

        <a
        target="_blank"
        href="https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}">
        🧭 Navigate
        </a>

`);

        markers.push(marker);

        const li=document.createElement("li");

        li.innerHTML=
        `<span class="siteNo">${site.id}</span> ${site.name}`;

        li.onclick=()=>{

            map.flyTo(

                [site.lat,site.lng],

                15,

                {

                    animate:true,

                    duration:1.5

                }

            );

            marker.openPopup();

        };

        siteList.appendChild(li);

    });

}

// ======================
// Search
// ======================

searchBox.addEventListener("keyup",()=>{

    const value=searchBox.value.toLowerCase();

    const filtered = sites.filter(site =>

        site.name.toLowerCase().includes(value)

        ||

        site.id.toString().includes(value)

        ||

        (site.village || "").toLowerCase().includes(value)  

    );

    loadSites(filtered);

});

// ======================
// Hide Sidebar
// ======================

toggleBtn.onclick=()=>{

    sidebar.classList.add("hide");

    showSidebar.style.display="block";

    setTimeout(()=>{

        map.invalidateSize();

    },350);

};

// ======================
// Show Sidebar
// ======================

showSidebar.onclick=()=>{

    sidebar.classList.remove("hide");

    showSidebar.style.display="none";

    setTimeout(()=>{

        map.invalidateSize();

    },350);

};
// =========================
// LIVE LOCATION
// =========================

locateBtn.onclick=()=>{

if(!navigator.geolocation){

alert("Geolocation not supported");

return;

}

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat=position.coords.latitude;

const lng=position.coords.longitude;

if(myLocationMarker){

map.removeLayer(myLocationMarker);

}

myLocationMarker=L.circleMarker([lat,lng],{

radius:10,

fillColor:"#2196F3",

color:"#fff",

weight:3,

fillOpacity:1

}).addTo(map);

myLocationMarker
.bindPopup(`
<b>📍 Your Location</b><br><br>

Latitude : ${lat.toFixed(6)}<br>

Longitude : ${lng.toFixed(6)}<br><br>

Accuracy : ${Math.round(position.coords.accuracy)} m

`)
.openPopup();

map.flyTo([lat,lng],16,{

animate:true,

duration:1.5

});

},

(error)=>{

console.log(error);

switch(error.code){

case error.PERMISSION_DENIED:
alert("Location permission denied.");
break;

case error.POSITION_UNAVAILABLE:
alert("Location unavailable.");
break;

case error.TIMEOUT:
alert("Location request timed out.");
break;

default:
alert("Unknown location error.");

}

},

{

enableHighAccuracy:true

}

);

};
