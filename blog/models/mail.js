/**
 * Created by Administrator on 2017/2/23.
 */
module.exports = Mail;

var sysCfg = require('../systemConfig');
var mongodb = require('./db');
var pubParam = require('./pubParam');
var querystring = require('querystring');
var http = require('http');
function Mail(mail) {
    this.name = mail.name;
    this.email = mail.email;
    this.subject = mail.subject;
    this.message = mail.message;
}

Mail.prototype.save = function (callback) {
    mail = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.subject
    }

    mongodb.open(function (err, db) {
        if (err)
            return callback(err);

        db.collection('mail', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(mail, function (err, mail) {
                mongodb.close();
                callback(err, mail);
            });
        });
    });
};

Mail.prototype.send = function (callback) {

    var params = {
        Action: "SingleSendMail",
        Subject: this.subject,
        HtmlBody: "name: " + this.name + "<br>" +
        "email: " + this.email + "<br>" +
        "subject: " + this.subject + "<br>" +
        "message: " + this.message
    };

    params = pubParam.commonParams(params);

    var post_data = querystring.stringify(params);

    var auth = new Buffer('li-zr:Huskarbitch119').toString('base64');

    var post_opt;

    if (sysCfg.useProxy) {
        post_opt = {
            host: "proxy.neusoft.com",
            port: 8080,
            method: "POST",
            path: "dm.aliyuncs.com",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data),
                'Proxy-Authorization': 'Basic ' + auth
            }
        };
    } else {
        post_opt = {
            host: "dm.aliyuncs.com",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
    }

    var post_req = http.request(post_opt, function (res) {
        console.log('STATUS:' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
        });
        callback();
    });
    post_req.write(post_data);
    post_req.end();

};