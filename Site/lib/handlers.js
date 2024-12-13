const fortuneValue = require("./fortune");

const pathUtils = require("path");
const fs = require("fs");

//create a directory to store vacationphotos:
const dataDir = pathUtils.resolve(__dirname,"..","data");
const vacationPhotosDir = pathUtils.resolve(dataDir,"vacation-photos");


exports.getHome = (req,res)=>{
    // const userfortune = fortunes[Math.floor(Math.random() * fortunes.length)];
     res.render("home"); // we can pass an options object as second parameter, which will get used by a view
     //the view must have a {{variable_name}} that matches this a property of this object
     //in this example "fortune" is used in the view
     //check the home.handlebars page
 };

 exports.getAbout = (req,res)=>{
    res.render("about",{fortune: fortuneValue.getFortune()});
    
 };

 exports.getPageError = (req,res)=>{
    res.render("404");
 };

 /* eslint-disable no-unused-vars */
 exports.getServerError = (err,req,res,next)=>{
   res.status(500).render("500",{error:err});
    /* eslint-disable no-unused-vars */
 };

 exports.newsletterSignUp = (req,res)=>{
   res.render("newsletter-signup",{csrf:"CSRF token goes here"});
 };

 exports.api = {
   newsletterSignUp:(req,res)=>{
      console.log(`CSRF (hidden) : ${req.body._csrf}`);
      console.log(`Name (visble): ${req.body.name}`);
      console.log(`email (visible): ${req.body.email}`);
      res.send({result: "success"});
   }
 }

 exports.vacationPhotoContestProcess =(req,res,fields,files)=>{
    console.log(`fields: ${fields}`);
    console.log(`files: ${files}`);
   res.send({result:"Success"});
 }