const express = require('express')
const path=require("path");
const mongoose=require("mongoose");
var bodyParser = require('body-parser');  
// parse application/x-www-form-urlencoded
mongoose.connect("mongodb+srv://mongodb:Arun1117@cluster0.spwl1.mongodb.net/iotlabquery?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(function(){
  console.log("connnection successfull");
})
.catch(function(){
  console.log(" eroor in mongo db");
})


const iotlabschema=new mongoose.Schema({
  name:String,
  email:String,
  query:String
})

const Query=new mongoose.model("Query",iotlabschema);




const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
const staticPath=path.join(__dirname,"public");
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(staticPath));
app.get('/', (req, res) => {
  res.render("index.ejs");
})

app.post("/newquery",function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var query=req.body.query;

  console.log(name+" "+ email +" "+ query);

  const newquery=new Query({
    name:name,
    email:email,
    query:query
  })

  newquery.save(function(){
    console.log("data added");
  })
res.render("index.ejs");

  
});



app.get("/querytable",function(req,res){
  
  res.render("querytable.ejs",{error:""});
})


app.post("/check",async function(req,res){
  
  var result= await Query.find();
  var password=req.body.password;
  if(password=="Scratchnest"){
    res.render("querytableshow.ejs",{datas:result});
  
  }
  else{
    res.render("querytable.ejs",{error:"show the error"});
  }
  console.log(result);

  
})

app.get("*",function(req,res){
  res.render("wrong.ejs");
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

})