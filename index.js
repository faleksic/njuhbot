'use strict';


require('dotenv').config();
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()), // creates express http server
  controllers = require('./controllers');

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

controllers.set(app);