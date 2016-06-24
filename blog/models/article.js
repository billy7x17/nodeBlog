/**
 * Created by billy on 2016-06-21.
 */
var mongodb = require('./db');
var markdown = require('./micromarkdown.min');

function Article(article) {
    this.title = article.title;
    this.content = article.content;
    this.lastUpdateTime = article.lastUpdateTime;
    this.location = article.location;
}
module.exports = Article;

Article.prototype.save = function save (callback) {

    var article = {
        title : this.title,
        content : this.content,
        lastUpdateTime : this.lastUpdateTime,
        location : this.location
    }

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection
    })
}