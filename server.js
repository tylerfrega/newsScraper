var cheerio = require("cheerio");
var request = require("request");
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");
var exphbs = require('express-handlebars'); 


var Comments = require("./models/comments.js");
var Article = require("./models/articles.js");

var PORT = process.env.PORT || 3000;

// Init App
var app = express();


app.engine('handlebars', 
exphbs({defaultLayout: 'main'})); app.set('view engine', 'handlebars');
// Use morgan and body parser with our app

app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper");
var db = mongoose.connection;


function scrape(){

console.log(`
---------------------------------
Grabbing latest r/coys  articles
---------------------------------
`);

request("https://www.reddit.com/r/coys", function(error, response, html) {
  var $ = cheerio.load(html);

  $("a.title").each(function(i, element) {

    var result = {};

    result.title = $(element).text();
    result.link = $(element).attr("href");

    var post = new Article(result);

    post.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });

});

}


app.get('/', function(req,res){
    Article.find({}, function(error, data) {
        // Log any errors
        if (error) {
          console.log(error); 
        }
        // Or send the doc to the browser as a json object
        else {
          res.render('index', {data});
         
        }
      });
});


// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComment = new Comments(req.body);

  // And save the new note the db
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.update({ "_id": req.params.id }, {$push: { "comment": doc._id }})
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


app.listen(PORT, function(){
    console.log('...listening');
})


scrape();