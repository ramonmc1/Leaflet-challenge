// Creating the map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5
});


// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data. Last 7 days data
var quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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

// Get the data with d3.
d3.json(quakeData).then(function(data) {
  
  L.geoJSON(data, {
    style: style,
    onEachFeature: function(feature, layer) {
             layer.bindPopup("<b>Date/Time: </b>" + new Date(feature.properties.time) + "<br><b>Magnitude: </b>" +  feature.properties.mag + "<br><b>Location: </b>" +
           feature.properties.place +"<br><b>Depth: </b>" +
             feature.geometry.coordinates[2]+"km");
           },
            pointToLayer: function(geoJsonPoint, latlng) {
               return L.circleMarker(latlng);
           },
}).addTo(myMap);


});

var legend = L.control({ position: "bottomright" });
  
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