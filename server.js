// Dependencies
const express = require("express");
const mongojs = require("mongojs");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const app = express(), PORT = process.env.PORT || 3000;

// CHEERIO AND AXIOS CALL
var cheerio = require("cheerio");
var axios = require("axios");

// Models
const Article = require('./models/articleSchema');
const Comment = require('./models/commentSchema');

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Mongoose

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/metalDB";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} );

// let databaseUrl = "metalDB";
// let collections = ["blog"];

const db = mongoose.connection;
db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once("open", () => {
  console.log("Database connected")
})

app.get("/", function(req, res) {
  res.render("home");
});

// Scrape data from one site and place it into the mongodb db
app.get("/articles", (req, res) => {

  console.log("\n***********************************\n" +
            "Grabbing every Article name,link, and category\n" +
            "from Metal Injection!:" +
            "\n***********************************\n");

  axios.get("https://metalinjection.net/").then(response => {
    // Load the html body from axios into cheerio
    const $ = cheerio.load(response.data);
    // For each element with a "title" class
    $("div.content").each(function(i, element) {
      let title = $(element).children('h2.title').children("a").text();
      let category = $(element).children('span.category').children("a").text();
      let sneakpeak = $(element).children("p").text();
      let url = $(element).children('h2.title').children("a").attr("href");


      // If this found element had both a title and a link
          if (title && category && sneakpeak && url) {
        // Insert the data in the scrapedData db
          let newArticleObj = {
            title,
            category,
            sneakpeak,
            url
          }
          Article.findOneAndUpdate({url},newArticleObj, {upsert: true})
          // .then(article => console.log(article))
          .catch(err => console.log(err))
        }
    });
  // Send a "Scrape Complete" message to the browser
  // res.send("Scrape Complete");
});

Article.find({}, function (err, articles){
      
  if (err) {
    console.log(err)
  } else {
     let hbsObject = {
        articles
      };
      // console.log("Here" + hbsObject.articles);
      res.render("index", hbsObject)
  }
}); 
});

app.get("/comments/:postId", (req, res) => {
   
  let postId = req.params.postId;
  let hbsObject = {};
 
     Article.find({_id: postId} , function (err, post){
       if (err) {
         console.log(err)
       } else {
         hbsObject.post = post;
         // res.render("comments", hbsObject)
       } 
     });
 


  Comment.find({post_id: postId}, /*null, {sort: {timestate: -1}}, */ function (err, comments) {
   if (err) {
         console.log(err)
       } else {
         hbsObject.comments = comments;
          console.log(hbsObject); 
         res.render("comments", hbsObject)
       }
 })
})


// API

app.post("/api/comments/", (req,res) => {
  let 
   post_id = req.body.post_id,
   user_id = 'DEFAULT USER',
   text = req.body.user_comment;

 console.log("Posting Comment");
 

   let newCommentObj = {
           user_id,
           text,
           post_id
         } 
   Comment.create(newCommentObj)
     .then(comment => {
       console.log("Here is a new comment"+comment);
     })
     .then(() => res.redirect('back'))
     .catch(err => console.log(err));

})

app.get("/api/comments/delete/:postId", (req, res) => {
 let postId = req.params.postId;

 console.log("deleting comment" + postId);

 Comment.deleteOne({_id: postId})
   .then(() => res.redirect('back'))
   .catch(err => console.log(err));


})

/*************************
*****Server STARTED*****
**************************/
app.listen(PORT, () => {
 console.log(`App running on http://localhost:${PORT}`);
});

 