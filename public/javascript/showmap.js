mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container:'map',
    style:'mapbox://styles/mapbox/satellite-streets-v11',
    center:icecream.geometry.coordinates,
    zoom:13
})

new mapboxgl.Marker()
.setLngLat(icecream.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${icecream.title}</h3><p>${icecream.location}</p>`
        )
)
.addTo(map)