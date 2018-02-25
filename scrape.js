var express = require('express');
var cheerio = require('cheerio');
var app     = express();
var rp      = require('request-promise');
var mysql   = require('mysql'); 

var posts = [];

app.listen('8081')

console.log('Magic happens on port 8081');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "njuhbot"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT * FROM user;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});

app.get('/scrape', function(req, res) {
    requestUrl();
});

function requestUrl() {
    url = 'https://www.njuskalo.hr/iznajmljivanje-stanova/varazdinska';

    rp(url)
    .then((data) => {
        scrapeData(data);
        console.log(posts);
    })
    .catch((err) => {
		console.log(err);
    });
}

function scrapeData(html) {
    var $ = cheerio.load(html);

    // Finally, we'll define the variables we're going to capture
    $('.EntityList-item--Regular').filter(function() {
        posts.push($(this).data("options").id);
    });
}
