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

/**
 * 存储文章
 * @param callback 回调函数
 */
Article.prototype.save = function save(callback) {

    /* 文章属性 */
    var article = {
        title: this.title,
        content: this.content,
        lastUpdateTime: this.lastUpdateTime,
        location: this.location
    }

    /* 数据库操作 */
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(article, {safe: true}, function (err, article) {
                mongodb.close();
                callback(err, article);
            })
        })
    })
}

Article.get = function get(title, callback) {

    var mongodb = require('./db');

    mongodb.open(function (err, db) {
        if (err) {
            callback(err);
        }

        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                callback(err);
            }

            var query = {};
            if (title) {
                query.title = title;
            }

            collection.findOne(function (err, articles) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, articles);
                }

            });

        })

    })

}