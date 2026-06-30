/*=========================================================
    RAMNAD SITE MANAGEMENT v1.0
    script.js
    PART 1 / 6
=========================================================*/

/*=========================================================
    GLOBAL VARIABLES
=========================================================*/

const RAMNAD_CENTER = [9.3639, 78.8395];
const DEFAULT_ZOOM = 10;

let map;

// Site data
let sites = [];
let filteredSites = [];

// Marker storage
let markers = [];
let markerLayer = L.layerGroup();

// Active selection
let activeMarker = null;
let activeSite = null;

// Measure Tool
let measureMode = false;
let measurePoints = [];
let measurePolyline = null;
let measureMarkers = [];

// DOM Elements
const sidebar = document.getElementById("sidebar");
const siteList = document.getElementById("siteList");
const siteCount = document.getElementById("siteCount");
const searchInput = document.getElementById("searchInput");

const menuButton = document.getElementById("menuButton");
const closeSidebar = document.getElementById("closeSidebar");

const locateBtn = document.getElementById("locateBtn");
const measureBtn = document.getElementById("measureBtn");
const resetBtn = document.getElementById("resetBtn");

const infoTitle = document.getElementById("infoTitle");
const infoBody = document.getElementById("infoBody");

/*=========================================================
    INITIALIZE MAP
=========================================================*/

function initializeMap() {

    map = L.map("map", {

        zoomControl: true,

        attributionControl: true

    });

    map.setView(RAMNAD_CENTER, DEFAULT_ZOOM);

    markerLayer.addTo(map);

}

/*=========================================================
    TILE LAYER
=========================================================*/

function loadTileLayer() {

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 20,

            attribution:

            "&copy; OpenStreetMap contributors"

        }

    ).addTo(map);

}

/*=========================================================
    CUSTOM NUMBER MARKER
=========================================================*/

function createNumberMarker(number) {

    return L.divIcon({

        className: "custom-div-icon",

        html: `

        <div class="custom-marker">

            ${number}

        </div>

        `,

        iconSize: [38,38],

        iconAnchor: [19,19],

        popupAnchor: [0,-18]

    });

}

/*=========================================================
    LOAD JSON
=========================================================*/

async function loadSites() {

    try {

        const response = await fetch("sites.json");

        if (!response.ok) {

            throw new Error("Unable to load sites.json");

        }

        sites = await response.json();

        filteredSites = [...sites];

        siteCount.textContent =
            `Total Sites : ${sites.length}`;

        renderSidebar(filteredSites);

        addMarkers(filteredSites);

    }

    catch(error){

        console.error(error);

        siteList.innerHTML = `

            <div class="loading">

                Failed to load sites.

            </div>

        `;

    }

}

/*=========================================================
    SIDEBAR
=========================================================*/

function renderSidebar(data){

    siteList.innerHTML = "";

    if(data.length===0){

        siteList.innerHTML=`

            <div class="loading">

                No Sites Found

            </div>

        `;

        return;

    }

    data.forEach(site=>{

        const card=document.createElement("div");

        card.className="site-card fade-in";

        card.dataset.site=site.siteNo;

        card.innerHTML=`

            <div class="site-number">

                ${site.siteNo}

            </div>

            <div class="site-content">

                <div class="site-name">

                    ${site.siteName}

                </div>

                <div class="site-village">

                    ${site.village}

                </div>

            </div>

        `;

        card.addEventListener("click",()=>{

            focusSite(site.siteNo);

        });

        siteList.appendChild(card);

    });

}

/*=========================================================
    SEARCH
=========================================================*/

searchInput.addEventListener("input",()=>{

    const keyword = searchInput.value
                    .trim()
                    .toLowerCase();

    if(keyword===""){

        filteredSites=[...sites];

    }

    else{

        filteredSites=sites.filter(site=>{

            return(

                String(site.siteNo)
                .includes(keyword)

                ||

                site.siteName
                .toLowerCase()
                .includes(keyword)

                ||

                site.village
                .toLowerCase()
                .includes(keyword)

            );

        });

    }

    renderSidebar(filteredSites);

    addMarkers(filteredSites);

});

/*=========================================================
    PLACEHOLDER FUNCTIONS
    (Implemented in Part 2)
=========================================================*/

function addMarkers(data){

    // Part 2

}

function focusSite(siteNo){

    // Part 2

}

/*=========================================================
    APPLICATION START
=========================================================*/

initializeMap();

loadTileLayer();

loadSites();
