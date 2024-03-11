const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Quiz, Question } = require("../models/quizzes"); // Assuming you have defined Quiz and Question models
const quizRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require("cors");

quizRouter.use(bodyParser.json());

quizRouter
  .route("/quizzes")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Quiz.find({})
      .populate('questions')
      .then(
        (quizzes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quizzes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Quiz.create(req.body)
      .then(
        (quiz) => {
          console.log("Quiz created", quiz);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quiz);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

quizRouter
  .route("/quizzes/:quizId")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Quiz.findById(req.params.quizId)
      .populate('questions')
      .then(
        (quiz) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quiz);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Quiz.findByIdAndUpdate(
      req.params.quizId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (quiz) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(quiz);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Quiz.findByIdAndDelete(req.params.quizId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

quizRouter
  .route("/questions")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Question.find({})
      .then(
        (questions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(questions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Question.create(req.body)
      .then(
        (question) => {
          console.log("Question created", question);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(question);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

quizRouter
  .route("/questions/:questionId")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Question.findById(req.params.questionId)
      .then(
        (question) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(question);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Question.findByIdAndUpdate(
      req.params.questionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (question) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(question);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Question.findByIdAndDelete(req.params.questionId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

  quizRouter.route("/quizzes/:quizId/populate")
  .get(cors(), async (req, res, next) => {
    try {
      const { quizId } = req.params;

      // Find the quiz by ID
      const quiz = await Quiz.findById(quizId).populate('questions');
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      // Get the list of associated question IDs
      const questionIds = quiz.questions.map(question => question._id);

      // Find all questions that have the word "capital" in their keywords or text
      const questions = await Question.find({
        $or: [
          { keywords: 'capital' }, // Assuming 'capital' is a keyword
          { text: { $regex: 'capital', $options: 'i' } } // Case-insensitive search in the text
        ]
      });

      // Filter questions based on the associated question IDs of the quiz
      const filteredQuestions = questions.filter(question => questionIds.includes(question._id));

      res.status(200).json(filteredQuestions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = quizRouter;
