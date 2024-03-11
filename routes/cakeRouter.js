const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Cakes = require("../models/cakes");
const cakeRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require("cors");

cakeRouter.use(bodyParser.json());

cakeRouter
  .route("/")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Cakes.find({})
      .then(
        (cakes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cakes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Cakes.create(req.body)
      .then(
        (cake) => {
          console.log("Cake created", cake);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /cakes");
  })
  .delete(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Cakes.deleteMany({})
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

cakeRouter
  .route("/:cakeId")
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Cakes.findById(req.params.cakeId)
      .then(
        (cake) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /cakes/" + req.params.cakeId);
  })
  .put(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Cakes.findByIdAndUpdate(
      req.params.cakeId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (cake) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cake);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors(), authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Cakes.findByIdAndDelete(req.params.cakeId)
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

module.exports = cakeRouter;

// cakeRouter
//   .route("/:cakeId/comments")
//   .get((req, res, next) => {
//     Cakes.findById(req.params.cakeId)
//       .then(
//         (dish) => {
//           if (dish != null) {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.json(dish.comments);
//           } else {
//             const err = new Error("Dish " + req.params.cakeId + " not found");
//             err.status = 404;
//             return next(err);
//           }
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   })
//   .post((req, res, next) => {
//     Cakes.findById(req.params.cakeId)
//       .then((dish) => {
//         if (dish != null) {
//           dish.comments.push(req.body);
//           dish
//             .save()
//             .then((dish) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(dish.comments);
//             })
//             .catch((err) => next(err));
//         } else {
//           const err = new Error("Dish " + req.params.cakeId + " not found");
//           err.status = 404;
//           return next(err);
//         }
//       })
//       .catch((err) => next(err));
//   })
//   .delete((req, res, next) => {
//     Cakes.findById(req.params.cakeId)
//       .then((dish) => {
//         if (dish != null) {
//           for (var i = dish.comments.length - 1; i >= 0; i--) {
//             dish.comments.id(dish.comments[i]._id).deleteOne();
//           }
//           dish
//             .save()
//             .then((dish) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(dish);
//             })
//             .catch((err) => next(err));
//         } else {
//           const err = new Error("Dish " + req.params.cakeId + " not found");
//           err.status = 404;
//           return next(err);
//         }
//       })
//       .catch((err) => next(err));
//   });
// cakeRouter
//   .route("/:cakeId/comments/:commentId")
//   .get((req, res, next) => {
//     Cakes.findById(req.params.cakeId)
//       .then(
//         (dish) => {
//           if (dish != null && dish.comments.id(req.params.commentId) != null) {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             res.json(dish.comments.id(req.params.commentId));
//           } else if (dish == null) {
//             const err = new Error("Dish " + req.params.cakeId + " not found");
//             err.status = 404;
//             return next(err);
//           } else {
//             const err = new Error(
//               "Comment " + req.params.commentId + " not found"
//             );
//             err.status = 404;
//             return next(err);
//           }
//         },
//         (err) => next(err)
//       )
//       .catch((err) => next(err));
//   })
//   .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end(
//       "POST operation not supported on /Cakes/" +
//         req.params.cakeId +
//         "/comments/" +
//         req.params.commentId
//     );
//   });

module.exports = cakeRouter;
