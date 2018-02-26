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
        this.con.query(sql, function (err, result, fields) {
            if (err) throw err;
            callback(result);
          });
    }

    getUsers(callback) {
        var sql = "SELECT id, name, psid FROM user";
        this.request(sql, function(data) {
                callback(data); 
        });
    }

    getUser(psid, callback) {
        var sql = "SELECT id, name, psid FROM user WHERE psid=" + this.con.escape(psid);
        this.request(sql, function(data) {
                callback(data); 
        });
    }

    insertUser(psid, name) {

    }

    deleteUser(psid) {

    }

    getRequests(callback) {
        var sql = "SELECT id, url, last_ping FROM request";
        this.request(sql, function(data) {
                callback(data); 
        });
    }

    getRequest(url, callback) {
        var sql = "SELECT id, url, last_ping FROM request WHERE url=" + this.con.escape(url);
        this.request(sql, function(data) {
                callback(data); 
        });
    }

    insertRequest(url, callback) {
        var date = new Date();
        let now  = date.getUTCFullYear() + "-" 
        + twoDigits(1 + date.getUTCMonth()) 
        + "-" + twoDigits(date.getUTCDate()) 
        + " " + twoDigits(date.getUTCHours()) 
        + ":" + twoDigits(date.getUTCMinutes()) 
        + ":" + twoDigits(date.getUTCSeconds());

        var sql = "INSERT INTO request(url, last_ping) VALUES(" + this.con.escape(url) + ", '" + now +"')";
        this.request(sql, function(data) {
                callback(data); 
        });
    }

    deleteRequest(url) {

    }

    getUsersForRequest(url) {

    }

    getRequestsForUser(psid) {

    }
}

module.exports.DB = DB;

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}