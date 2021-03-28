// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map, heatmap;


function initMap() {
  let dp = getPoints();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: {
      lat: 0,
      lng: 0,
    },
    mapTypeId: "terrain",
  });
  getPoints();

  
}

function getCircle(cases, normDta) {
  const {max, min} = normDta;
  const ctscaled = (cases - min)/(max - min);
  
  return{
    path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 0.15 * (ctscaled+1),
      fillColor: "red",
      scale: 12*(1+ctscaled)+(ctscaled * 50),
      strokeColor: "white",
      strokeWeight: ctscaled,
      name: "weightedCirc",
  };
}
function getMaxCount(locations){
  let max = locations[0].latest;
  let min = locations[0].latest;
  locations.forEach(loc => {
    if(max<loc.latest) max = loc.latest;
    if(min>loc.latest) min = loc.latest;
  });
  return {max: max, min:min};
}

function getPoints() {
  
  let icons = [];
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api-covid-nineteen.herokuapp.com/confirmed");
  xhr.onload = function () {
    let responseData = JSON.parse(xhr.responseText);
    const normDta = getMaxCount(responseData.locations);
    responseData.locations.forEach((data) => {
      let datCir = new google.maps.Marker({
        map: map,
        icon: getCircle(data.latest,normDta),
        position: {
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
        },
        label: {
          text: `${data.latest}`,
          color: "#FFF",
          fontSize: "10"
    }
      });
      if (!icons[datCir.getIcon().scale])
        icons[datCir.getIcon().scale] = datCir.getIcon();
    });
    return icons;
  };
  xhr.send();
}
