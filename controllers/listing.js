const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { search } = req.query;

  let allListing;

  if (search) {
    allListing = await Listing.find({
      title: { $regex: search, $options: "i" } 
    });
  } else {
    allListing = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListing });
};
module.exports.rendernewform = (req, res) => {

    res.render("listings/new.ejs");
}
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author", },
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listing");   // <-- FIX: MUST RETURN
    }

    res.render("listings/show.ejs", { listing });
}
module.exports.createlisting = async (req, res) => {

  if (!req.file) {
    req.flash("error", "Image is required");
    return res.redirect("/listing/new");
  }

  const { lat, lng } = req.body;
  if (!lat || !lng) {
    req.flash("error", "Location is required");
    return res.redirect("/listing/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename
  };

  newListing.geometry = {
    type: "Point",
    coordinates: [Number(lng), Number(lat)]
  };

  await newListing.save();

  req.flash("success", "New listing created");
  res.redirect("/listing");
};


module.exports.renderEditform = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for was not found");
        return res.redirect("/listing");
    }

    res.render("listings/edit.ejs", { listing });
}
module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroy=async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted");
    res.redirect("/listing");
    
}