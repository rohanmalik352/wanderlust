document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  // GeoJSON format: [lng, lat]
  const [lng, lat] = mapDiv.dataset.coordinates
    .split(",")
    .map(Number);

  // Leaflet needs: [lat, lng]
  const coordinates = [lat, lng];

  const title = mapDiv.dataset.title;

  const map = L.map("map").setView(coordinates, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker(coordinates)
    .addTo(map)
    .bindPopup("Exact location will be provided after booking")
    .openPopup();
});
