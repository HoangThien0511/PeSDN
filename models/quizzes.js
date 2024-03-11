const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Question Schema
const questionSchema = new Schema({
  
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  }
});

// Define Quiz Schema
const quizSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    required: true
  }
});

// Create Question model
const Question = mongoose.model("Question", questionSchema);

// Create Quiz model
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { Quiz, Question };
