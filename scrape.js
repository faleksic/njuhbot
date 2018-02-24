var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
var app     = express();
var rp = require('request-promise');

app.get('/scrape', function(req, res) {
    url = 'https://www.njuskalo.hr/prodaja-stanova/bjelovarsko-bilogorska';

    rp(url).then((data) => {

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            $('.entity-title').filter(function() {
                var data = $(this);
                console.log(data.children().first().text());
            });

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};
        }
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;