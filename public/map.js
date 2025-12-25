// map.js
// This file MUST be loaded BEFORE listingform.js

async function convertLocationToCoordinates(location, country) {
  const query = `${location}, ${country}`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      {
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }

    // Set hidden input values
    const latInput = document.getElementById("lat");
    const lngInput = document.getElementById("lng");

    if (!latInput || !lngInput) {
      throw new Error("Latitude/Longitude inputs not found");
    }

    latInput.value = data[0].lat;
    lngInput.value = data[0].lon;

    return { lat: data[0].lat, lng: data[0].lon };
  } catch (err) {
    console.error("convertLocationToCoordinates error:", err);
    throw err;
  }
}
