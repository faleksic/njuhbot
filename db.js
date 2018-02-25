var mysql   = require('mysql'); 
require('dotenv').config();

class DB 
{
    constructor(host, user, password, database) {
        this.con = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
    }

    connect() {
        this.con.connect(function(err) {
            if (err) throw err;
            console.log("Connected to mysql!");
        });
    }

    request(sql, callback) {
        this.con.query("SELECT * FROM request", function (err, result, fields) {
            if (err) throw err;
            callback(result);
          });
    }

    getUsers() {

    }

    getUser(psid) {

    }

    insertUser(psid, name) {

    }

    deleteUser(psid) {

    }

    getRequests(callback) {
        var sql = "SELECT * FROM request";
       this.request(sql, function(data) {
            callback(data); 
       });

    }

    getRequest(id) {

    }

    insertRequest(url) {

    }

    deleteRequest(url) {

    }

    getUsersForRequest(url) {

    }

    getRequestsForUser(psid) {

    }
}

module.exports.DB = DB;