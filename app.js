
// requiring the external modules.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

// using the app from express.
const app = express();

// using bodyParser to pass urlencoded info.
app.use(bodyParser.urlencoded({extended: true}));

// connecting the mongodb to the server.
mongoose.connect("your_localhost_or_any_url_for_mongoDB", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify : false});

//my database schema.
const articleSchema = new mongoose.Schema({
  title : String,
  content : String
});

// creating the model of my schema.
const Article = mongoose.model("Article", articleSchema);

//using chained routes for the /articles request
app.route("/articles")
  .get(function(req, res){
    Article.find(function(err, result){
      if(!err){
        res.send(result)
      }
      else
        res.send(err);
    });
  })
  .post(function(req, res){
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title : title,
      content : content
    });
    article.save(function(err){
      if(err)
        console.log(err);
      else
      res.send("Got it!");
    });
  })
  .delete(function(req, res){
    Article.deleteMany(function(err){
      if(err)
        console.log(err);
      else
        console.log("Deleted all!");
    });
  });

//using chained routes for the /articles/specific-article request
app.route("/articles/:articleTitle")
  .get(function(req, res){
    Article.findOne({title : req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle)
        res.send(foundArticle);
      else
        res.send("Article Not Found!")
    });
  })
  .post(function(req, res){
    Article.update(
      {title : req.params.articleTitle},
      {title : req.body.title, content : req.body.content},
      {overwrite : true},
      function(err){
        if(err)
          res.send("Error!");
        else
          res.send("Updated!");
      }
    );
  })
  .patch(function(req, res){
    Article.update(
      {title : req.params.articleTitle},
      {$set : req.body},
      function(err){
        if(err)
          res.send(err);
        else
          res.send("Updated!")
      }
    );
  })
  .delete(function(req, res){
    Article.deleteOne(
      {title : req.params.articleTitle},
      function(err){
        if(err)
          res.send(err);
        else
          res.send("Deleted!")
      }
    );
  });

// listening to port local port.
app.listen(/*your port*/, function(){
  console.log("Server started on port 3000...");
});
