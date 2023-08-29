var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + "When: "+ new Date(feature.properties.time) + "</p>" + "<br><h3> Magnitude: " + feature.properties.mag + "</h3>");
  }

 
 function createMarker(feature,latlng){
  let options = {
      radius:feature.properties.mag*5,
      fillColor: chooseColor(feature.properties.mag),
      color: chooseColor(feature.properties.mag),
      weight: 1,
      opacity: .5,
      fillOpacity: 1
  }
  return L.circleMarker(latlng, options);
}

let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: createMarker
});

// Send earthquakes layer to the createMap function
createMap(earthquakes);
}


function chooseColor(mag) {
      if (0.1 <= mag && mag <= 1.0) return "Powderblue";
      else if (1.0 <= mag && mag <= 2.5) return "Skyblue";
      else if (2.5 <= mag && mag <= 4.0) return "deepskyblue";
      else if (4.0 <= mag && mag <= 5.5) return "Royalblue";
      else if (5.5 <= mag && mag <= 8.0) return "blue";
      else if (8.0 <= mag && mag <= 20.0) return "slateblue";
}

// Set up the legend.
var legend = L.control({ position: "bottomleft"});

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Magnitude</h4>";
  div.innerHTML += '<i style="background: Powderblue"></i><span>0.1 - 1.0</span><br>';
  div.innerHTML += '<i style="background: Skyblue"></i><span>1.0 - 2.5</span><br>';
  div.innerHTML += '<i style="background: deepskyblue"></i><span>2.5 - 4.0</span><br>';
  div.innerHTML += '<i style="background: Royalblue"></i><span>4.0 - 5.5</span><br>';
  div.innerHTML += '<i style="background: blue"></i><span>5.5 - 8.0</span><br>';
  div.innerHTML += '<i style="background: slateblue"></i><span>8.0 +</span><br>';

  return div;

};

function createMap(earthquakes){

var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create a baseMaps object to hold the streetmap layer.
var baseMaps = {
"Street Map": streetmap
};

// Create an overlayMaps object to hold the bikeStations layer.
var overlayMaps = {
"Earthquakes": earthquakes
};

// Create the map object with options, zooming and centering to see the whole world on the map
var map = L.map("map", {
center: [19.432080, -4.814873],
zoom: 3,
layers: [streetmap, earthquakes]
});

 // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
 L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);

legend.addTo(map);
}