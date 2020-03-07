var Campground = require("../models/campground");
var Comments   = require("../models/comments");
var middlewareObj = {};
middlewareObj.checkCommentOwnership = function(req,res, next){
      if (req.isAuthenticated()) {
        Comments.findById(req.params.comment_id,function(err,foundComment){
          if (err || !foundComment) {
            req.flash("error","Comment not found");
            res.redirect("back");
          }
          else {
            if (foundComment.author.id.equals(req.user._id)) {
               next();
            }
            else {
              req.flash("error","You don't have Permission to do that");
              res.redirect("back");
            }
          }
        });
      } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
      }
}

middlewareObj.checkCampgroundOwnership= function(req,res, next){
      if (req.isAuthenticated()) {
        Campground.findById(req.params.id,function(err,foundCampground){
          if (err || !foundCampground) {
            req.flash("error","Something went wrong");
            res.redirect("back");
          }
          else {
            if (foundCampground.author.id.equals(req.user._id)) {
               next();
              //res.render("campground/edit",{campground: foundCampground});
            }
            else {
              req.flash("error","You don't have Permission to do that");
              res.redirect("back");
            }
          }
        });
      } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
      }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error","You need to be logged in to do that");
  res.redirect("/login");
}

module.exports = middlewareObj
