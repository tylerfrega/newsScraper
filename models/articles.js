var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Then, we save the mongoose.Schema class as simply "Schema"
var Schema = mongoose.Schema;

// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});
ArticleSchema.plugin(uniqueValidator);

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;