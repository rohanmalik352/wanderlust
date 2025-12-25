const user=require("../models/user.js");
module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const newUser = new user({ username, email });
      const registeredUser = await user.register(newUser, password);

  

      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome to Wanderlust!");
        return res.redirect("/listing");
      });

    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/signup");
    }
  }
  module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login=(req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
     let redirectUrl=req.session.saveRedirectUrl||"/listing";
     
    res.redirect(redirectUrl);   
  }
  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); 
    }
    req.flash("success", "You are logged out");
    res.redirect("/listing");
  });
}