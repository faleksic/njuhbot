const
    request = require('request'),
    scrape = require('../scrape'),
    message = require('../message'),
    rp      = require('request-promise');
var mydb;
require('dotenv').config();

module.exports.set = function (app, db) {
    mydb = db;
    app.post('/url', (req, res) => {
        if (req.body.URL) {
            var re = new RegExp('^https://www.njuskalo.hr');
            if (re.test(req.body.URL)) {
                let url = req.body.URL;
                mydb.getRequest(url, function(data) {
                    if(data.length > 0) {
                        message.urlSuccess(res);
                    } else {
                        rp(url)
                        .then((data) => {
                            if(scrape.getScrape(data).length > 0) {
                                db.insertRequest(url, function() {
                                    message.urlSuccess(res);
                                });
                            } else {

                            }
                            
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                });
            }
        }
    });
    app.post('/webhook', (req, res) => {

        let body = req.body;

        // Checks this is an event from a page subscription
        if (body.object === 'page') {

            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {
                if (entry.standby) {
                    switch (entry.standby[0].postback.title) {
                        case "Može!":
                            createTwoAnswerCard(entry.standby[0].sender.id, "Naslov", "Može!", "Ne");
                            break;
                        case "Ne, hvala.":
                            console.log(entry.standby[0].sender.id);
                            handleMessage(entry.standby[0].sender.id, "Šteta, ako me budeš trebao tu sam 😊");
                            break;
                    }
                    return;
                }
                // Gets the message. entry.messaging is an array, but 
                // will only ever contain one message, so we get index 0
                let webhook_event;
                if (entry.messaging) {
                    webhook_event = entry.messaging[0];
                    if (webhook_event.message && webhook_event.message.text) {
                        let sender = webhook_event.sender.id;
                        //handleMessage(sender, message);
                        createTwoAnswerCard(sender,
                            "Pozdrav, ja sam NjuhBot 🐶 Moj posao je da te obavještavam o novim oglasima s Njuškala.",
                            "Može!",
                            "Ne, hvala."
                        );
                    }
                }
            });

            // Returns a '200 OK' response to all requests
            res.status(200).send('EVENT_RECEIVED');
        } else {
            // Returns a '404 Not Found' if event is not from a page subscription
            res.sendStatus(404);
        }
    });

    // Adds support for GET requests to our webhook
    app.get('/webhook', (req, res) => {

        // Your verify token. Should be a random string.
        let VERIFY_TOKEN = "7hTTeTKK1K6ZPkzYctFw"

        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        // Checks if a token and mode is in the query string of the request
        if (mode && token) {

            // Checks the mode and token sent is correct
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);

            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    });

    scrape.set(app, db);
    message.set(app, db);
}

function handleMessage(senderPsid, receivedMessage) {
    let response;

    // Checks if the message contains text
    if (receivedMessage != "") {
        // Creates the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": receivedMessage
        }
    }

    // Sends the response message
    callSendAPI(senderPsid, response);
}

function callSendAPI(senderPsid, response) {
    const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
    // Construct the message body
    let requestBody = {
        "recipient": {
            "id": senderPsid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": requestBody
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function userKnown(psid) {
    console.log(psid);
    mydb.getUser(psid, function (data) {
        console.log(data);
        if (data.length == 0) {
            response = {
                "text": `Izgleda da se nikad nismo upoznali!`
            };
        } else {
            response = {
                "text": `Ma mi smo kompici vec!`
            };
        }

        callSendAPI(psid, response);
    });
}

function createTwoAnswerCard(sender, title, firstButton, secondButton) {
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": title,
                        "buttons": [
                            {
                                "type": "postback",
                                "payload": "aasdasd",
                                "title": firstButton,
                            }, {
                                "type": "postback",
                                "title": secondButton,
                                "payload": "aaaa"
                            }
                        ]
                    }
                ]
            }
        }
    };

    callSendAPI(sender, response);
}