/**
 *  文章定义及数据库操作
 *
 *  @author <a href="mailto:billy7x17@gmail.com">billy119</a>
 *  @version 1.0 2016-06-21 16:28
 */
var mongodb = require('./db');
var Uuid = require('uuid');

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
        id: Uuid.v1(),
        title: this.title,
        content: this.content,
        lastUpdateTime: this.lastUpdateTime,
        location: this.location
    };

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
};

Article.getAll = function get(callback) {

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

            collection.find().sort({lastUpdateTime: -1}).toArray(function (err, articles) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, articles);
                }

            });

        })

    })

};

Article.get = function get(uuid, callback) {

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

            var query = {
                id: uuid
            };

            collection.findOne(query, function (err, article) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, article);
                }

            });

        })

    })

};