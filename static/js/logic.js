// Stored the 'One Week' data option url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get data via d3
d3.json(queryUrl).then(function (data) {
  console.log(data)
  //Send data in the features attribute through the createFeatures function. 
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  //Take in data sent from API request ^. This function will create our markers and popups to have ready when the map is generated below. 

 ///Before doing L.geoJSON() we will generate the popup (Location, depth), 
 //create a function to color based on depth, and then create a "styles" object based using these two functions to pass in to the L.geoJSON() arguments. 


  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>(M)agnitude - Location:<br>" + feature.properties.title + "<br><h3>Depth:<br>" + feature.geometry.coordinates[2])
  }

  function selectColor(depth) {
    if (depth < 10 && depth >= -10) return "green"
      else if (depth < 30 && depth >= 10) return "greenyellow"
      else if (depth < 50 && depth >= 30) return "yellow"
      else if (depth < 70 && depth >= 50) return "orange"
      else if (depth < 90 && depth >= 70) return "orangered"
    else return "red"
  }

  function styles(feature) {
    return {
        stroke: true,
        fillOpacity: 0.9,
        color: "black",
        fillColor: selectColor(feature.geometry.coordinates[2]),
        radius: Math.sqrt(feature.properties.mag) * 10
    };
  }

  //Use L.geoJSON and pass in functions created above that will specify marker/popup info for each data point. 
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styles,
    onEachFeature: onEachFeature

  })
  createMap(earthquakes);
}

function createMap(earthquakes) {

  //Added two tile layers that can be toggled (this was from the Day 1 activities map that I thought was cool)

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create basemamps
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  //Create the overlay
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Make the map on the div with id = 'map- Coordinates added are just ones I found online that are recommended for centering on the US map
  let myMap = L.map("map", {
    center: [
      39.8283, -98.5795
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });


  // This adds the toggle for street map versus topographical map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


//Adding the Legend was tough and the leaflet docs didn't offer a simple way to match the challenge example.
// I used LLM to help recreate what the legend in the challenge example looks like.  We use a control to add a scale based on our colors used. 
//Added two classes to the CSS folder to style the legend.

  let legend = L.control({
    position: "bottomright"
});


legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["green", "greenyellow", "yellow", "orange", "orangered", "red"];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            "<i style='background:" + colors[i] + "'></i> " +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
};

legend.addTo(myMap);

}



