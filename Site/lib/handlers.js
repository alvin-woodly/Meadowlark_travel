const fortuneValue = require("./fortune");

exports.getHome = (req,res)=>{
    // const userfortune = fortunes[Math.floor(Math.random() * fortunes.length)];
     res.render("home"); // we can pass an options object as second parameter, which will get used by a view
     //the view must have a {{variable_name}} that matches this a property of this object
     //in this example "fortune" is used in the view
     //check the home.handlebars page
 }

 exports.getAbout = (req,res)=>{
    res.render("about",{fortune: fortuneValue.getFortune()});
 }

 exports.getPageError = (req,res)=>{
    res.render("404");
 }

 exports.getServerError = (err,req,res,next)=>{
    res.render("500");
 }