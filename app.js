var express =  require('express');
var fs = require("fs");
var bodyParser = require("body-parser");

var server = express();

server.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})


server.use(express.static("public"));
var postRequestMiddleware=bodyParser.urlencoded({extended:false});


//server.get("/",function(req,resp){
 // resp.render("index.ejs");
//});


server.post("/save",postRequestMiddleware,function(req,resp){
  console.log("The Content is: " + req.body.textcontent)
  fs.writeFile("./doc.txt",req.body.textcontent,function(err) {
    if(err) {
        return console.log(err);
    }
    resp.send("ok saved");
  })
});


//Checking for the file update and response in the long pooling
server.get("/updates",function(req,resp){
  //console.log(req.query.lastmod);
  function checkFile(){
    fs.stat("./doc.txt",function(err,stat){
      if(stat.mtime.getTime() > req.query.lastmod){
        var response ={};
        response.content = fs.readFileSync('./doc.txt').toString();
        response.lastmod = stat.mtime.getTime();
        resp.send(response);
      }else{
        setTimeout(checkFile,1000);
      }
    })
  }
  checkFile();
})

server.set("view engine","ejs");
server.set("views","./views");
server.listen(9090,function(){
  console.log("Starting.....");
});
