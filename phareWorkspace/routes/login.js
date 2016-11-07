/**
 * Created by JayChen on 11/4/2016.
 */
var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var crypto = require('crypto');

//登陆页
router.get('/', function(req, res, next) {
    res.render('login', { title: '用户登录' });
});

//提交登录
router.post('/', function(req, res, next) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username, function(err, user) {
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

module.exports = router;