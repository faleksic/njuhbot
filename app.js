'use strict';


require('dotenv').config();
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.urlencoded({extended: true})), // creates express http server
  controllers = require('./controllers'),
  db          = require('./db');



// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

var myDB = new db.DB(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_DATABASE);
myDB.connect();

controllers.set(app, myDB);