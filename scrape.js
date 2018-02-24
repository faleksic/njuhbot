var express = require('express');
var cheerio = require('cheerio');
var app     = express();
var rp      = require('request-promise');
var mysql   = require('mysql'); 

var posts = [];

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
        var data = $(this);
        posts.push(data.data("options").id);
    });

    var title, release, rating;
    var json = { title : "", release : "", rating : ""};
}


app.listen('8081')

console.log('Magic happens on port 8081');