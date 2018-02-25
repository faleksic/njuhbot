var cheerio = require('cheerio');
var rp      = require('request-promise');
var posts = [];

module.exports.set = function(app, db) {
    app.get('/scrape', function(req, res) {
        requestUrl(res, db);
    });
}

function requestUrl(res, db) {
    url = 'https://www.njuskalo.hr/iznajmljivanje-stanova/varazdinska';

    rp(url)
    .then((data) => {
        scrapeData(data);
        db.getRequests(function(data) {
            res.send(JSON.stringify(data));
        });
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
