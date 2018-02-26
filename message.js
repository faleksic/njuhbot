
module.exports.set = function(app, db) {
    exports.urlSuccess = function urlSuccess(res) {
        var message = {
            "messages": [
              {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                    "text": "Zapamtio sam URL! Od sad kad dođe novi oglas na ovaj URL ću ti javiti.",
                    "buttons": [
                      {
                        "type": "show_block",
                        "block_names": ["Welcome message"],
                        "title": "Ponovo"
                      }
                    ]
                  }
                }
              }
            ]
        }

        res.send(message);
    }
}