
var quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var boundaries = "static/data/GeoJSON/PB2002_boundaries.json";

// Get the data with d3.

d3.json(boundaries).then(function(data){
  tecto = L.geoJSON(data);
 });


d3.json(quakeData).then(function (data) {
  createFeatures(data.features);
});



function createFeatures(eqdata) {
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<b>Date/Time: </b>" + new Date(feature.properties.time) + "<br><b>Magnitude: </b>" +  feature.properties.mag + "<br><b>Location: </b>" +
    feature.properties.place +"<br><b>Depth: </b>" +
      feature.geometry.coordinates[2]+"km");    
  }
  
  var earthquakes = L.geoJSON(eqdata, {
      style: style,
      onEachFeature: onEachFeature,
      pointToLayer: function(geoJsonPoint, latlng) {
                 return L.circleMarker(latlng);
             },       
  });
  createMap(earthquakes);
 
  }


function createMap(earthquakes) {

var standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


var grey = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


 // Create a baseMaps object.
 var baseMaps = {
  "Standard": standard,
  "Topographic Map": topo,
  "Grayscale Map": grey,
  "Dark Map": dark
};

 // Create an overlay object to hold our overlay.
 var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tecto
};


var myMap = L.map("map", {
  center: [33.75, -84.4],
  zoom: 3,
  layers: [standard, earthquakes] //initial load of layers
});


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright"});
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");	    
    div.innerHTML = 
          '<b>Earthquake Depth</b><br><br>' +
          '<i style="background-color: #00429d"></i>500km+<br><br>' +
          '<i style="background-color: #2e59a8"></i>400-500km<br><br>' +
          '<i style="background-color: #4771b2"></i>300-400km<br><br>' +
          '<i style="background-color: #5d8abd"></i>200-300km<br><br>' +
          '<i style="background-color: #73a2c6"></i>100-200km<br><br>' +
          '<i style="background-color: #8abccf"></i>50-100km<br><br>' +
          '<i style="background-color: #a5d5d8"></i>10-50km<br><br>' +
          '<i style="background-color: #c5eddf"></i>5-10km<br><br>' +
          '<i style="background-color: #ffffe0"></i>0 - 5km';
    return div;
  };
  
  // Adding the legend to the map
  legend.addTo(myMap);

}



var color = ['#00429d', '#2e59a8', '#4771b2', '#5d8abd', '#73a2c6', '#8abccf', '#a5d5d8', '#c5eddf', '#ffffe0']

function getColor(d) {
  if(d > 500) return color[0]; else
  if(d > 400) return color[1]; else
  if(d > 300) return color[2]; else
  if(d > 200) return color[3]; else 
  if(d > 100) return color[4]; else
  if(d > 50) return color[5]; else
  if(d > 10) return color[6]; else 
  if(d > 5) return color[7]; else 
      return color[8];
}

function getRadius(m) {
  return m*10;
}

function style(feature) {
  return {
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      weight: 0.5,
      opacity: 1,
      color: "grey",
      fillOpacity: 0.7
  };
}





