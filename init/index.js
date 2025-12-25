const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const data = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB Atlas connected");

    await Listing.deleteMany({});

    const listings = data.data.map(obj => ({
      ...obj,
      geometry: {
        type: "Point",
        coordinates: [77.2090, 28.6139] // Delhi (lon, lat)
      },
      owner: new mongoose.Types.ObjectId("693e551236ef44f23d39256c")
    }));

    await Listing.insertMany(listings);
    console.log("Data uploaded successfully");

    await mongoose.connection.close();
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

main();
