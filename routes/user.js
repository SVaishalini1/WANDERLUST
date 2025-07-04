const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");
const LocalStratergy = require("passport-local");
const path = require("path");

const {saveRedirectUrl }= require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup")
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        let registeredUser =await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust !")
            res.redirect("/listings");
        })
      
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login", failureFlash : true}),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully logged out!!");
        
    });
    res.redirect("/listings");
})


module.exports = router;