
module.exports.set = function(app, db) {
    exports.urlSuccess = function urlSuccess(res, text) {
      let buttons = [
        {
          "type": "show_block",
          "block_names": ["Welcome message"],
          "title": "Ponovo"
        }
      ];
      message(res, text, buttons);
    }



    exports.urlFailure = function urlFailure(res, text) {
      let buttons = [
        {
          "type": "show_block",
          "block_names": ["Welcome message"],
          "title": "Želim pokušati ponovo"
        },
        {
          "type": "show_block",
          "block_names": ["Welcome message"],
          "title": "Vrati me na početak"
        }
      ];

      message(res, text, buttons);
  }
}

function message(res, text, buttons) {
  let message = {
    "messages": [
      {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": text,
            "buttons": buttons,
          }
        }
      }
    ]
  };
  res.send(message);
}