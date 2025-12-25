// listingform.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("listing-form");
  const locationInput = document.getElementById("location");
  const countryInput = document.getElementById("country");
  const latInput = document.getElementById("lat");
  const lngInput = document.getElementById("lng");

  // Stop execution if required elements are missing
  if (!form || !locationInput || !countryInput || !latInput || !lngInput) {
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = locationInput.value.trim();
    const country = countryInput.value.trim();

    if (!location || !country) {
      alert("Please enter location and country");
      return;
    }

    try {
      // Convert location before submitting
      await convertLocationToCoordinates(location, country);

      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);

      if (isNaN(lat) || isNaN(lng)) {
        alert("Invalid coordinates. Please try again.");
        return;
      }

      // Safe submission
      form.submit();
    } catch (err) {
      alert("Location conversion failed. Please enter a valid place.");
    }
  });
});
