const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));

// Connect to the Mongo DB using the codelaborate database (will be created if it doesn't exist)
mongoose.connect('mongodb://localhost/codelaborate', {
  useNewUrlParser: true
});

// Routes
require('./sockets/sockets')(io);
// API Routes (require from routes file and pass in Express app)
require('./routes/api-routes')(app);
// HTML Routes (require from routes file and pass in Express app)
require('./routes/html-routes')(app);

// Start the server
server.listen(PORT, function () {
  console.log(`App running on port ${PORT}`);
});


