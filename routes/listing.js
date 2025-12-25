const express = require("express");
const router = express.Router();
const multer = require("multer");
const{storage}=require('../cloudconfig.js');

const upload = multer({ storage });

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const { isloggedin, isOwner } = require("../middleware");
const listingcontroller = require("../controllers/listing.js");

router.use(express.urlencoded({ extended: true }));

// Validate listing
const validateListing = (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "No listing data provided");
    }
    const { error } = listingSchema.validate({ listing: req.body.listing });
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(
        isloggedin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingcontroller.createlisting)
    );

router.get("/new", isloggedin, listingcontroller.rendernewform);

router.route("/:id")
    .get(wrapAsync(listingcontroller.show))
    .put(
        isloggedin,
        isOwner, upload.single("listing[image]"),
        validateListing,
        
    
        wrapAsync(listingcontroller.updatelisting),    
    )
    .delete(
        isloggedin,
        isOwner,
        wrapAsync(listingcontroller.destroy)
    );

router.get("/:id/edit",
    isloggedin,
    isOwner,
    wrapAsync(listingcontroller.renderEditform)
);

module.exports = router;
