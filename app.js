if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const review = require("./routes/review.js")
const userrouter = require("./routes/user.js");
const listing = require("./routes/listing.js")

// App configuration and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo').default;
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");
const Review = require("./models/review.js");

const dbUrl = process.env.ATLASDB_URL;

// Session configuration with connect-mongo v6


app.use(session({
    store: MongoStore.create({
        mongoUrl: dbUrl,
        crypto: { secret: process.env.secret },
        touchAfter: 24 * 3600
    }),
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Database connection
main()
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.curruser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listing");
});

app.use("/listing", listing);
app.use("/listing/:id/reviews", review);
app.use("/", userrouter);

// Fallback route - should be the last route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { message });
});

// Start the server
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});