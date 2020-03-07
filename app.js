const express = require("express");
const app = express();
const port = 3000;
var bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/UserSchema"),
    Campground              = require("./models/campground"),
    Comments                = require("./models/comments"),
    seedDB                  = require("./seed");
//requring routes
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_campv3";
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
//Password Config
app.use(require("express-session")({
    secret: "Rusty once Again......",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT,process.env.IP,function(req,res){
  console.log("Server starting at " + port);
});
