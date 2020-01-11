const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    user_id: {
      type: String,
      required: "required" 
    },
    text: {
      type: String
    },
    post_id: {
      type: String
    }
    
  });

  const Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;