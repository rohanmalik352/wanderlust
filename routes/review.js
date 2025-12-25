
const express=require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");


const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const{reviewSchema}=require("../schema.js");
const { isloggedin ,isReviewAuthor} = require("../middleware.js");
const reviewController=require("../controllers/reviews.js")
const validateReview = (req, res, next) => {
    let { error } =reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
router.post("/",isloggedin,validateReview,wrapAsync(reviewController.createReview));
//delete Review Route
router.delete("/:reviewId",isloggedin,isReviewAuthor, wrapAsync(reviewController.destroy));
module.exports=router;

