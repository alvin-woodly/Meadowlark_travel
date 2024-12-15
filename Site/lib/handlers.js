const fortuneValue = require("./fortune");

const pathUtils = require("path");
const fs = require("fs");

const db = require("../mongodb/db");

//create a directory to store vacationphotos:
const dataDir = pathUtils.resolve(__dirname,"..","data");
const vacationPhotosDir = pathUtils.resolve(dataDir,"vacation-photos");
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if(!fs.existsSync(dataDir)) fs.mkdirSync(vacationPhotosDir);


function saveContestEntry(contestName,email,year,month,photoPath)
{
   //todo this comes later
}

// we'll want these promise-based versions of fs functions later
const{promisify} = require("util");
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);




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

 exports.api.vacationPhotoContest = async (req,res,fields,files)=>{
   const photo = files.photo[0];
   const dir = vacationPhotosDir + "/" + Date.now();
   const path = dir + "/" + photo.originalFilename;
   await mkdir(dir);
   await rename(photo.path,path);
   saveContestEntry("vacation-photo",fields.email,req.params.year,req.params.month,path);
   res.send({result:"success"});
 }


 exports.listVacations = async(req,res)=>{
   const vacations= await db.getVacations({available:true});
   const context={
         vacations : vacations.map(vacation=>({
         sku:vacation.sku,
         name:vacation.name,
         description:vacation.description,
         price:"$" + vacation.price.toFixed(2),
         inSeason:vacation.inSeason
      }))
   }
   res.render("vacations",context);
 }


 exports.notifyWhenInSeasonForm =(req,res)=>{
   res.render("notify-me-when-in-season",{sku: req.query.sku});
 }


 exports.notifyWhenInSeasonProcess = async (req,res)=>{
   const{email,sku} = req.body;
   await db.addVacationInSeasonListener(email,sku);
   return res.redirect(303,"/vacations");
 }