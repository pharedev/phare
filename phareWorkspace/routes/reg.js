/**
 * Created by JayChen on 11/7/2016.
 */
var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var crypto = require('crypto');


//页面权限控制，注册功能只对未登录用户可用
router.get('/', checkNotLogin);

//注册页
router.get('/', function(req, res, next) {
    res.render('reg', { title: '用户注册' });
});

router.post('/', checkNotLogin);

//提交注册
router.post('/', function(req, res, next) {
    //检验用户两次输入的口令是否一致
    //使用req.body.username获取提交请求的用户名，username为input的name
    if (req.body['password-repeat'] != req.body['password']) {
        //保存信息到error中，然后通过视图交互传递提示信息，调用alert.ejs模块进行显示
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
    User.get(newUser.name, function(err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
//如果不存在则新增用户
        newUser.save(function(err) {
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

function checkNotLogin(req, res, next) {
    if (req.session.user)//用户存在
    {
        req.flash('error', '已登录');
        return res.redirect('/');
    }
    next();//控制权转移：当不同路由规则向同一路径提交请求时，在通常情况下，请求总是被第一条路由规则捕获，
    // 后面的路由规则将会被忽略，为了可以访问同一路径的多个路由规则，使用next()实现控制权转移。
}

module.exports = router;