/*
   Import Node Modules
*/

const express = require('express');
const app = express();
const router = express.Router(); //Creates new router object
const mongoose = require('mongoose'); //Node tool for MongoDB
const config = require('./config/database'); //mongoose config
const path = require('path'); //file paths
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);

const bodyParser = require('body-parser'); //parse incoming request bodies in a middleware before your handlers, availabile under req.body
const cors = require('cors'); //providing a Connect/Express middleware that can be used to enable CORS with various options.

// DATABASE CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('DATABASE NOT CONNNECTED')
  } else {
    console.log('DATABASE CONNECTED')
  }
});

// MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:4200'
}))
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist/')); // Provide static directory for frontend
app.use('/authentication', authentication);
app.use('/blogs', blogs);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'client/dist/index.html'));
})

app.listen(3000, () => {
  console.log('LIIISSSTEENNN')
})
