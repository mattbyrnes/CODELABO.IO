const express = require("express");
const mongoose = require("mongoose");    
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const user = require('./models/user');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somesecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});


// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }    
};



// // passport config
// const User = require('./models/user');
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



//Mongoose connection ** HAVE TO EDIT URI ***
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/myapp');
mongoose.connect(
  
  process.env.MONGODB_URI ||  "mongodb://localhost:27017/codelaborate", {

 }
 );


// USER SIGNUP route
app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/register.html');
    })
    .post((req, res) => {
        user.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/register');
        });
    });



    // USER LOGIN ROUTE
app.route('/login')
.get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})
.post((req, res) => {
    var username = req.body.username,
        password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
        if (!user) {
            res.redirect('/login');
        } else if (!user.validPassword(password)) {
            res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        }
    });
});


// // route for user's dashboard
// app.get('/dashboard', (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//       res.sendFile(__dirname + '/public/dashboard.html');
//   } else {
//       res.redirect('/login');
//   }
// });


// // route for user logout
// app.get('/logout', (req, res) => {
//   if (req.session.user && req.cookies.user_sid) {
//       res.clearCookie('user_sid');
//       res.redirect('/');
//   } else {
//       res.redirect('/login');
//   }
// });

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Error, can't find ")
});





app.listen(PORT, function() {
  console.log(`App running on port ${PORT}`);
});