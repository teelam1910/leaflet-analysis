const url1 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

var map = L.map('map').setView([0, -30], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const init = async () => {
    let data = await d3.json(url1);

    L.geoJSON(data, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            return {
                color: 'black',
                weight: 1,
                radius: mag*3,
                fillOpacity: .65,
                fillColor: 
                    depth < 10 ? 'green' : 
                    depth < 30 ? 'lime' :
                    depth < 50 ? 'yellow':
                    depth < 70 ? 'orange':
                    depth < 90 ? 'darkorange': 'red'           
        };
        }
    }).bindPopup(function ({feature}) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            let time = new Date(feature.properties.time).toLocaleString();
            let place = feature.properties.place;

        console.log(time);
        return `<h3> ${place}<br> magnitude: ${mag} <br> depth: ${depth} <br> ${time} </h3>`;
    }).addTo(map);
};

init();

let legend = L.control({position:'bottomright'});

legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'legend');
    
    let colors = ['green','lime','yellow','orange','darkorange','red'];
    let ranges = ['-10 - 10','10 - 30','30 - 50','50 - 70', '70 - 90','90+'];

    div.innerHTML = '<h3>Depth</h3>';
    ranges.forEach((range,i) => div.innerHTML += `<i style="background:${colors[i]}"></i>${range}<br>`);

    return div;
};

legend.addTo(map);