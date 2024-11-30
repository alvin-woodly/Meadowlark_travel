//import express
const express = require("express");
//create an instance of express:
const app = express();
//import express-handlebars:
const expressHandlebars = require("express-handlebars");
//importing our custom fortune cookies module:
const fortune = require("./lib/fortune");


//configure a port for the server to listen to:
const port = process.env.PORT ||3000;

//variable for dynamic functionality, in this case an array
const fortunes =["Conquer your fears or they will conquer you.",
"Rivers need springs.",
"Do not fear what you don't know.",
"You will have a pleasant surprise.",
"Whenever possible, keep it simple.",];


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

app.use(express.static(__dirname + "/public"));
//using express to get the "about file" as requested in the get http request
//http get handled by express takes 2 parameters, the path and a function:
app.get("/",(req,resp)=>{
   // const userfortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    resp.render("home",{fortune: fortune.getFortune()}); // we can pass an options object as second parameter, which will get used by a view
    //the view must have a {{variable_name}} that matches this a property of this object
    //in this example "fortune" is used in the view
    //check the home.handlebars page
})

app.get("/about",(req,resp)=>{
    resp.render("about");
    //the .render function will render views.
})

//use express to write a custom 404 page response
app.use((req,resp)=>{
    resp.status(404);
    resp.render("404");
});

//using express to write a custom error 500 page
app.use((err,req,resp,next)=>{
    resp.status(500);
    resp.render("500");
});

//tell express to listen on a port:
app.listen(port,()=>{console.log(`Express started on http://localhost:${port} press ctrl+c to terminate`)});
