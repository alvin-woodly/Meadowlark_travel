//import express
const express = require("express");
//create an instance of express:
const app = express();
//import express-handlebars:
const expressHandlebars = require("express-handlebars");
//import handlers.js (contains our functionality for handling http requests):
const handlers = require("./lib/handlers");
//import bodyparser:
const bodyparser = require("body-parser");
//import multiparty (for file uploads in HTML forms):
const multiparty = require("multiparty");
//import credentials our cookie secret is stored here:
const {credentials} = require("./config");
//import cookie-parser:
const cookieparser = require("cookie-parser");
//import express-session , preferable over cookies, it does require a cookie:
const express_session = require("express-session");
//import nodemailer for emails:
const nodemailer = require("nodemailer");
const nodemailersendgrid = require("nodemailer-sendgrid");
//import morgan for environment logging:
const morgan = require("morgan");
//import fs for morgan logging
const fs = require("fs");
//import db.js for db initialization:
//require("./mongodb/db.js");

//import our sequelize db init script to run an authentication:
require("./sql/initdb");

//import clusters:
/*
proof clusters are handling requests (probably wont change often because node is optimized):
const cluster = require("cluster");

app.use((req,res,next)=>{
    console.log(`$ Worker ${cluster.worker.id} received request`);
    next();
});
*/

//configure morgan depending on environment
switch(app.get("env")){
    case "development":
        app.use(morgan("dev"));
        break;
    
    case "production":
        try{
            const stream = fs.createWriteStream(__dirname +"/access.log",{flags:'a'});
            app.use(morgan("combined",{stream:stream}));
        }
        catch(err)
        {
            console.log(`${err} , ${err.message}`);
        }
        break;
}



//create instance:
const transport = nodemailer.createTransport(nodemailersendgrid({apiKey:credentials.sendgrid.API_KEY}));
//test mail to one sender:
/* //*disabled for now
(async()=>{
    try{
      const result =   await transport.sendMail({
            from:"alvinwoodly@outlook.com",
            to:"alvinwoodly@gmail.com",
            subject:"Your Meadowlark travel tour",
            html:"<h1>Your meadowlark booking was successful!</h1> <br> <p>Thank you for booking with us!</p>",
           text:"Thank you for booking a trip with meadowlark travel, we look forward to your visit!"
        });
        console.log(`mail was sent  ${result.accepted}`);
    }
    catch(err)
    {
        console.error(`error occurred , ${err} , ${err.message}`);
    }
 })();
*/


//importing our custom fortune cookies module:
const fortune = require("./lib/fortune");

//importing simple-middleware:
const simplemiddleware = require("./lib/middleware/simple-middleware");
const { error } = require("console");
const { nextTick } = require("process");

//configure a port for the server to listen to:
const port = process.env.PORT ||3000;
/*
variable for dynamic functionality, in this case an array
const fortunes =["Conquer your fears or they will conquer you.",
"Rivers need springs.",
"Do not fear what you don't know.",
"You will have a pleasant surprise.",
"Whenever possible, keep it simple.",];
*/

/*
*it is important to know that app.get and app.user have different uses.
*app.get is used for GET http methods.
*app.use is used for configuring middleware, it can have a path specified,if no path is given it will work on ALL http requests.
*/
 

//configure a custom template engine (we are using express-handlebars):
app.engine('handlebars',expressHandlebars.engine({
    defaultLayout:"main"
}));
//this function basically lets us use the handelbar views without specifying the .handlebars extention
app.set('view engine', 'handlebars');

//this enables server-side view caching, so it wont recompile the view,only when it changes. 
app.set("view cache",true);

/*eslint-disable no-undef */
app.use(express.static(__dirname + "/public"));

//configure cookie parser middleware:
app.use(cookieparser(credentials.cookieSecret));

//configure express-session /* //*AFTER */ cookie parser:
//!note that the docs say its no longer required.
app.use(express_session({resave:false,saveUninitialized:false, secret:credentials.cookieSecret})); 

//configure body parser so we can parse encoded HTTP to JSON:
app.use(bodyparser.json());

//disable x-powere-by to prevent express from sending server info:
app.disable("x-powered-by");
/* //*configure body parser so we can parse encoded HTTP body payloads:
app.use(bodyparser.urlencoded({extended:true}));
*/
/*eslint-disable no-undef */
//using express to get the "about file" as requested in the get http request


//!testing middleware:
/*
app.use(simplemiddleware.simplelog);

app.use(simplemiddleware.terminator);

app.use(simplemiddleware.neverCalled);
*/

/*
app.use((req,res,next)=>{
    console.log("\n\nALLWAYS");
    next();
});

app.get('/a', (req, res) => {
    console.log('/a: route terminated');
    res.send('a');
});

app.get('/a', (req, res) => {
    console.log('/a: never called');
});

app.get('/b', (req, res, next) => {
    console.log('/b: route not terminated');
    next();
});
app.use((req, res, next) => {
    console.log('SOMETIMES');
    next();
});

app.get('/b', (req, res, next) => {
    console.log('/b (part 2): error thrown' );
    throw new Error('b failed');
});

app.use('/b', (err, req, res, next) => {
    console.log('/b error detected and passed on');
    next(err);
});

app.get('/c', (err, req) => {
    console.log('/c: error thrown');
    throw new Error('c failed');
});

app.use('/c', (err, req, res, next) => {
    console.log('/c: error detected but not passed on');
    next();
});

app.use((err, req, res, next) => {
    console.log('unhandled error detected: ' + err.message);
    res.send('500 - server error');
});

app.use((req, res) => {
    console.log('route not handled');
    res.send('404 - not found');
});
    
*/





//http get handled by express takes 2 parameters, the path and a function:
app.get("/",handlers.getHome);


//get vacations using mongodb
app.get("/vacations", handlers.listVacations);

//testing uncaught exceptions:
//simple (this isnt so bad):
app.get("/fail",(req,res)=>{
    throw new Error("Nope!");
});


app.get("/epic-fail",(req,res)=>{
    process.nextTick(()=> {throw new Error("kaboom!");});
});

//cookie testing:
app.get("/cookies",(req,res)=>{
    res.type("text/plain")
    res.cookie("cookie_monster","nom nom",{httpOnly:true});
    res.cookie("signed_monster","nom nom",{signed:true , httpOnly:"true"});
    res.send("cookies set");
});

app.get("/cookies/values",(req,res)=>{
    res.type("text/plain");
    res.send(`the normal cookie is : ${req.cookies.cookie_monster} and the signed is ${req.signedCookies.signed_monster}`);
});

app.get("/cookies/clear",(req,res)=>{
    res.type("text/plain");
    res.clearCookie("cookie_monster");
    res.clearCookie("signed_monster");
    res.send("cookies cleared");
});

//session testing
app.get("/sessions",(req,res)=>{
    req.session.color = "blue";
    req.session.name = "Arnie";
})


//testing what headers a request has:
app.get("/headers",(req,res)=>{
    res.type("text/plain")
    const headers = Object.entries(req.headers).map(([key,value])=> `${key} : ${value}`);
    res.send(headers.join("\n"));
});

app.get("/about",handlers.getAbout
    //the .render function will render views.
)

//handle form data:
app.get("/signup-newsletter", handlers.newsletterSignUp);

//process form data:
app.post("/api/newsletter-signup",handlers.api.newsletterSignUp);
/*
*this is the old way to handle forms,modernized handling uses FETCH API
get path for getting the form view
app.get("/signup-newsletter", handlers.newsletterSignUp);

 post path for when form is submitted:
app.post("newsletter-signup/process", handlers.newsletterSignupProcess);

 after submission redirect with 303:
app.get("newsletter-signup/thank-you", handlers.newsletterSignupThankYou);
*/


//form with file option:
app.get("/contest/vacation-photo",(req,res)=>{
    res.render("contest/vacation-photo",{year:2024,month:12,csrf:"token"});
});

//handle forms with MIME type files (images,audio etc.):
app.post("/contest/vacation-photo/:year/:month",(req,res)=>{
    const form = new multiparty.Form();
    form.parse(req,(err,fields,files)=>{
        if(err)res.status(500).send({err:err.message});
        handlers.vacationPhotoContestProcess(req,res,fields,files);
    })
}) 


//use express to write a custom 404 page response
app.use(handlers.getPageError);
//using express to write a custom error 500 page
app.use(handlers.getServerError);

/*uncaught exceptionhandling //*(always implement this!): */
process.on("uncaughtException",err=>{
    console.error(`Fatal error: uncaught exception, server shut down \n ${err.stack}`);
    // do any cleanup you need to do here...close database connections, etc.
    process.exit(1);
});


//tell express to listen on a port:
//app.listen(port,()=>{console.log(`Express started on http://localhost:${port} press ctrl+c to terminate`)});

//function for starting server
function startServer(port)
{
    app.listen(port,()=>{console.log(`Express started in ${app.get("env")} mode, on http://localhost:${port} press ctrl+c to terminate`)});
}


if(require.main === module)
{
   startServer(port);
}
else{
    module.exports = startServer;
}