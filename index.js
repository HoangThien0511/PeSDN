const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors'); // Import the CORS middleware
const cakeRouter = require('./routes/cakeRouter');
const quizRouter = require('./routes/quizRouter');

const dishRouter = require('./routes/dishRouter');
const userRouter = require('./routes/userRouter');
const uploadRouter = require('./routes/uploadRouter');
const authenticate = require('./authenticate');
const config = require('./config');

const app = express();
const port = 3000;

// Connect to MongoDB
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  (db) => {
    console.log('Connected to the database');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  },
  (err) => {
    console.error('Error connecting to the database:', err);
  }
);

// Session 
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS for all routes
app.use(cors());
app.use(express.static(__dirname + '/public'));

// Mount routers
app.use('/users', userRouter);
app.use("/cakes", cakeRouter);
app.use('/', quizRouter);

// app.use(authenticate.verifyUser); // Using JWT for authentication
app.use('/dishes', dishRouter);
app.use('/imageUpload', uploadRouter);




//Cookie
// app.use(cookieParser('12345-67890')); 
// function auth (req, res, next) {
//   if (!req.signedCookies.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         next(err);
//         return;
//     }
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var user = auth[0];
//     var pass = auth[1];
//     if (user == 'admin' && pass == 'password') {
//         res.cookie('user','admin',{signed: true});
//         next(); // authorized
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         next(err);
//     }
//   }
//   else {
//       if (req.signedCookies.user === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }



