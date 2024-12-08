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

//importing our custom fortune cookies module:
const fortune = require("./lib/fortune");


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

//disable x-powere-by to prevent express from sending server info:
app.disable("x-powered-by");


/*eslint-disable no-undef */
app.use(express.static(__dirname + "/public"));

//configure cookie parser middleware:
app.use(cookieparser(credentials.cookieSecret));

//configure express-session /* //*AFTER */ cookie parser:
//!note that the docs say its no longer required.
app.use(express_session({resave:false,saveUninitialized:false, secret:credentials.cookieSecret})); 


//configure body parser so we can parse encoded HTTP to JSON:
app.use(bodyparser.json());

/* //*configure body parser so we can parse encoded HTTP body payloads:
app.use(bodyparser.urlencoded({extended:true}));
*/
/*eslint-disable no-undef */
//using express to get the "about file" as requested in the get http request
//http get handled by express takes 2 parameters, the path and a function:
app.get("/",handlers.getHome);


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

//tell express to listen on a port:
//app.listen(port,()=>{console.log(`Express started on http://localhost:${port} press ctrl+c to terminate`)});
if(require.main === module)
{
    app.listen(port,()=>{console.log(`Express started on http://localhost:${port} press ctrl+c to terminate`)});
}
else{
    module.exports = app;
}