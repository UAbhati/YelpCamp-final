var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/",function(req,res){
  Campground.find({},function(err, allcamp){
    if (err) {
      console.log(err);
    } else {
      res.render("campground/index",{campgrounds:allcamp});
    }
  });
});
//NEW Route
router.post("/", middleware.isLoggedIn, function(req,res){
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newcamp = {name: name,price: price, image: image, description: desc, author: author};
  Campground.create(newcamp,function(err, newlycamp){
    if (err) {
      console.log(err);
    } else{
       res.redirect("/campgrounds");
    }
  });
});
//Create Route for campground
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campground/new");
});
//SHOW Route
router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err || !foundCampground) {
       req.flash("error","Campground does not exit");
       return res.redirect("back");
    } else {
        res.render("campground/show",{campground: foundCampground});
    }
  });
});
//Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
          res.render("campground/edit",{campground: foundCampground});
    });
});
//Update
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
