import { grid2googleMaps } from "../grid2googleMaps.js";
import { koordinates } from '../hard-coded-data/exact-plunge.js';

function initMap() {

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 55.916339, lng: 21.8381671 },
    mapTypeId: "satellite",
  });



  for (const [key, value] of Object.entries(koordinates)) {
    const paths = value.map(grid2googleMaps);
    const label = key.replace('sklypas','');
    CreatePolygon(map, paths, "#FF0000", label);
  }

}

function CreatePolygon(map, paths, color, labelText, editable) {
  if (!color)
    color = "#FF0000"; 

  const polygon = new google.maps.Polygon({
    paths: paths,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
    editable: editable ? true : false
  });

  polygon.setMap(map);
  if(!labelText)
    return;

  const labelLocation = GetCenter(paths);
  AddMarker(map, labelLocation, labelText);

  return polygon;
}

function GetCenter(paths){
    const bounds = new google.maps.LatLngBounds();
    paths.forEach(path => bounds.extend(path));
    return bounds.getCenter();
}



function AddMarker(map, position, labelText){
  new google.maps.Marker({
    position: position,
    map: map,
    icon: {
      url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1 transparent image
      size: new google.maps.Size(1, 1),
    },
    label: {
      text: labelText,
      fontSize: "2em",
      fontWeight: "bold",
      color: "white"
    }
  });
}





window.initMap = initMap;


