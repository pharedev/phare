var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var Post = require("../models/post.js");

//首页:显示所有的精选文章，并按照时间先后顺序排列
router.get('/', function (req, res) {
    //读取所有的用户微博，传递把posts微博数据集传给首页
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        //调用模板引擎，并传递参数给模板引擎
        res.render('index', {title: '享摄首页', posts: posts});
    });
});

//发言页
router.post('/post', function (req, res) {//路由规则/post
    var currentUser = req.session.user;//获取当前用户信息
    if(req.body.post == ""){//发布信息不能为空
        req.flash('error', '内容不能为空！');
        return res.redirect('/u/' + currentUser.name);
    }
    //实例化Post对象
    var post = new Post(currentUser.name, req.body.post);//req.body.post获取用户发表的内容
    //调用实例方法，发表微博，并把信息保存到MongoDB数据库
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/u/' + currentUser.name);
    });
});

//用户首页
router.get('/u/:user', function (req, res) {//创建路由规则
    User.get(req.params.user, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        //调用对象的方法用户存在，从数据库获取该用户的微博信息
        Post.get(user.name, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            //调用user模板引擎，并传送数据（用户名和微博集合）
            res.render('user', {
                title: user.name,
                posts: posts
            });
        });
    });
});

//退出功能只对已登陆的用户可用
router.get('/logout', checkLogin);

//登出页
router.get('/logout', function(req, res, next) {
    //清空session
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

function checkLogin(req, res, next) {
    if (!req.session.user)//用户不存在
    {   //未登录跳转到登陆界面
        req.flash('error', '未登录');
        return res.redirect('/login');
    }
    //已登录转移到下一个同一路径请求的路由规则操作
    next();
}

module.exports = router;

