var US      = require('underscore'),
    Db      = require('./lib/db'),
    UPHP      = require('./bin/update_photo_head_portrait');
/**
 * kahn1990 photo commit 图片处理模块
 * @param options 数据库连接配置文件
 * @param oss_options OSS 连接配置文件
 * @returns {Client}
 */
var k1990PC = function (options, oss_options) {
    if (!(this instanceof Client)) {
        return new Client(options);
    }

    var db_config = options.connMysql,
        db_table  = "";
    if (options.db.header) {
        db_table = db.options + "_";
    }

    var func_all = {
        dbTable                   : db_table,
        conDb                     : Db(db_config),
        conOss                    : new OSS(oss_options),
        update_photo_head_portrait: UPHP.update_photo_head_portrait
    };

    return US.bindAll(func_all, 'update_photo_head_portrait');
};


module.exports = k1990PC;