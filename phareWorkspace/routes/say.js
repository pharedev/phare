/**
 * Created by JayChen on 11/7/2016.
 */
var express = require('express');
var router = express.Router();


//写文章页
router.get('/', function(req, res, next) {
    res.render('say', { title: '写文章' });
});

module.exports = router;
