const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// User
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const user = require('./models/user');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));



//// USER START ////

// User: set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// User: initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// User: initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somesecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

// User: This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

// User: middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }    
};

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

//Mongoose connection ** HAVE TO EDIT URI ***
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/myapp');

// mongoose.connect(
//     process.env.MONGODB_URI ||  "mongodb://localhost:27017/codelaborate", {
//  });

mongoose.connect('mongodb://codelabouser:codelabopass1@ds131954.mlab.com:31954/heroku_1m80w7kx', { useNewUrlParser: true });


 //// USER END ////


// OLD Mongoose
// mongoose.connect('mongodb://localhost/codelaborate', {
//   useNewUrlParser: true
// });

// Routes
require('./sockets/sockets')(io);
require('./routes/api-routes')(app);
require('./routes/html-routes')(app);

// User: route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Error, can't find ")
});


// Start the server
server.listen(PORT, function () {
  console.log(`App running on port ${PORT}`);
});

