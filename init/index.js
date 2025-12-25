const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("connection successful");
}

main().catch(err => console.log(err));

const initDb = async () => {
    await Listing.deleteMany({});

    const listings = data.data.map(obj => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("693e551236ef44f23d39256c")
    }));

    await Listing.insertMany(listings);
    console.log("data was initialized");
};

initDb();
