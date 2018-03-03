const
    request = require('request'),
    scrape = require('../scrape'),
    message = require('../message'),
    rp      = require('request-promise');
var mydb;
require('dotenv').config();

module.exports.set = function (app, db) {
    mydb = db;

    //Request that gets called with url in its body
    //Used for saving new url and connecting user to it
    app.post('/url', (req, res) => {
        if (req.body.URL) {
            let successURLMessage = "Zapamtio sam URL! Od sad kad dođe novi oglas na ovaj URL ću ti javiti.";
            let re = new RegExp('^https://www.njuskalo.hr');
            if (re.test(req.body.URL)) {
                let url = req.body.URL;
                //check if request exists in database
                mydb.getRequest(url, function(data) {
                    //if it exists tell user you rememberd it
                    if(data.length > 0) {
                        message.urlSuccess(res, successURLMessage);
                    } else {
                        //scrape requests to see if it has any posts
                        rp(url).then((data) => {
                            //if it does insert to database and tell user you did it
                            if(scrape.getScrape(data).length > 0) {
                                db.insertRequest(url, function() {
                                    message.urlSuccess(res, successURLMessage);
                                });
                            } else {
                                //tell user that URL is not right
                                message.urlFailure(res, "URL koji si mi poslao nažalost nije dobar, na njemu ne postoji ni jedan oglas.");
                            }
                        })
                        //if scraping fails
                        .catch((err) => {
                            console.log(err);
                            message.urlFailure(res, "Imam problema s provjerom URL-a, trebalo bi obavjestiti programera.");
                        });
                    }
                });
            } else {
                message.urlFailure(res, "URL koji si mi poslao nažalost nije dobar, mora počinjati sa https://www.njuskalo.hr");
            }
        } else {
            console.log("Request doesn't have URL parameter");
            message.urlFailure(res, "Imam problema s dohvaćanjem URL-a, trebalo bi obavjestiti programera.");
        }
    });

    scrape.set(app, db);
    message.set(app, db);
}