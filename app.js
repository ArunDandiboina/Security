
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.use(bodyparser.urlencoded({
  extended : true
}));

app.set('view engine', 'ejs');


// Database
mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

// Level 1 authentiation(email and password - create account and store fields)
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

// database encryption (Level 2 authentiation, encryption)
var secret = "thisIsOurSecret";
UserSchema.plugin(mongooseEncryption, { secret: secret , encryptedFields: ["password"]});
// save - encrypt
// find - decrypt (when checking password)

const User = new mongoose.model("User",UserSchema);


app.get('/',function(req,res){
  res.render("home");
});

app.get('/login',function(req,res){
  res.render("login");
});

app.get('/register',function(req,res){
  res.render("register");
});




app.post('/register',function(req,res){
   user = new User({
     username : req.body.username,
     password : req.body.password
   });

   user.save(function(err){
     if(err){
       console.log(err);
     } else{
       res.render('secrets');
     }
   });
});

app.post('/login',function(req,res){

   const username = req.body.username;
   const password = req.body.password;

   User.findOne({username:username}, function(err,docs){
     if(err){
       console.log(err);
     } else{
        if(docs){
          if(docs.password === password){
            res.render("secrets");
          }
        }
     }
   })

});








app.listen(3000,function(){
    console.log("server is running");
})
