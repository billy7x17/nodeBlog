﻿/*
 * GET home page.
 */
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Article = require('../models/article.js');
var crypto = require('crypto');
var markdown = require('../models/micromarkdown.min');
module.exports = function (app) {
    // 时间测试
    app.get('/hello', function (req, res) {
        res.send('The time is ' + new Date().toString());
    })
    // 主页
    app.get('/', function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index2', {
                title: '首页',
                posts: posts,
                Billytest: 'ejs test',
                mdContent: markdown.parse('#title test\n - el1')
            });
        });
    });

    // 文章输入页面进入
    app.get('/articleInput', function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('input', {
                title: '首页',
                posts: posts,
                Billytest: 'ejs test',
                mdContent: markdown.parse('#title test\n - el1')
            });
        });
    });
    // 文章输入
    app.post('/input', function (req, res) {

        var article = new Article({
            title: req.body['title'],
            content: req.body['content'],
            lastUpdateTime: new Date().getTime(),
            location: req.body['location']
        });

        article.save(function (err) {
            if (err) {
                req.flash('error', err);
            }
            req.flash('success', '文章保存成功');
        })


    })
    // 关于页
    app.get('/about', function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('about', {title: '首页', posts: posts, Billytest: 'ejs test'});
        });
    });
    // 获取注册页面
    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {title: '用户注册',});
    });
    // 提交注册请求
    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        //检验用户两次输入的口令是否一致
        if (req.body['password-repeat'] != req.body['password']) {
            req.flash('error', '两次输入的口令不一致');
            return res.redirect('/reg');
        }
        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        var newUser = new User({
            name: req.body.username,
            password: password,
        });
        //检查用户名是否已经存在
        User.get(newUser.name, function (err, user) {
            if (user)
                err = 'Username already exists.';
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });
    });
    // 获取登陆页面
    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '用户登入',
        });
    });
    // 提交登陆请求
    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
        // 生成口令散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        User.get(req.body.password, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '用户口令错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登入成功');
            res.redirect('/');
        });
    });
    // 登出系统
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    });

    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发表成功');
            res.redirect('/u/' + currentUser.name);
        });
    });

    app.get('/u/:user', function (req, res) {
        User.get(req.params.user, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/');
            }
            Post.get(user.name, function (err, posts) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('user', {
                    title: user.name,
                    posts: posts,
                });
            });
        });
    });
};
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}
