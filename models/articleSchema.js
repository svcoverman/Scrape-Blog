const mongoose = require("mongoose");

  const articlesSchema = new mongoose.Schema({
    title: {String,
    },
    category: String,
    sneakpeak: String,
    url: String,
    comments: Array
  })

 
const Article = mongoose.model("Article", articlesSchema);

module.exports = Article;