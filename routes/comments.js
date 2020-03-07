var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comments   = require("../models/comments");
var middleware = require("../middleware/index.js");
//comments
router.get("/new", middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  });
});
router.post("/", middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
     if (err) {
       console.log(err);
       res.redirect("/campgrounds");
     } else {
       Comments.create(req.body.comment,function(err,comment){
         if (err) {
           req.flash("error","Something went wrong");
           console.log(err);
         } else{
           comment.author.id = req.user._id;
           comment.author.username = req.user.username;
           comment.save();
           campground.comments.push(comment);
           campground.save();
           req.flash("success","Succesfully added Comment");
           res.redirect("/campgrounds/" + campground._id);
         }
       });
     }
   });
});
//Edit Comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    if (err || !foundCampground) {
      req.flash("error","Campground not found");
      return res.redirect("back");
    }
    Comments.findById(req.params.comment_id,function(err, foundComment){
      if (err || !foundComment) {
        req.flash("error","Comment not found");
        res.redirect("back");
      } else {
        res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
      }
    });
  });
});
//Update Comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
       if (err) {
         res.redirect("back");
       } else {
         res.redirect("/campgrounds/" + req.params.id);
       }
  })
});
//Delete comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comments.findByIdAndRemove(req.params.comment_id,function(err){
    if (err) {
      req.flash("error","Something went wrong");
      res.redirect("back");
    } else {
      req.flash("success","Succesfully deleted comment");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
