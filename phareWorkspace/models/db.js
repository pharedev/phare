/**
 * Created by JayChen on 10/20/2016.
 */

/** 数据库连接配置模块 **/
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;

/** 输出创建好的数据库连接 **/
module.exports = new Db(settings.db, new Server(settings.host, 27017, {}), {safe: true});
