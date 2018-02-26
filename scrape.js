var cheerio = require('cheerio');
var rp      = require('request-promise');


module.exports.set = function(app, db) {
    app.get('/scrape', function(req, res) {
        requestUrl(res, db);
    });

    exports.getScrape = function scrapeData(html) {
        var $ = cheerio.load(html);
        var posts = [];
    
        // Finally, we'll define the variables we're going to capture
        $('.EntityList-item--Regular').filter(function() {
            posts.push($(this).data("options").id);
        });
    
        return posts;
    }
}

function requestUrl(res, db) {
    url = 'https://www.njuskalo.hr/iznajmljivanje-stanova/varazdinska';
    db.getRequests(function(data) {
        res.send(JSON.stringify(data));
    });
    rp(url)
    .then((data) => {
        scrapeData(data);
        
    })
    .catch((err) => {
		console.log(err);
    });
}
