var mongoose = require("mongoose");
var commentsSchema = mongoose.Schema({
  text: String,
  author: {
    id:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("comments", commentsSchema);
