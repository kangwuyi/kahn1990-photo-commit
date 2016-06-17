var co  = require('co'),
    us  = require('underscore'),
    CSU = require("../lib/crypto_symmetric_uuid");
/**
 * 插入图片方法 insterPhotoInfo
 * @param obj        （Object）：【{conDb：Object, dbTable: String}】，MYSQL 实例化对象 和 自定义表头
 * @param userUuid   （Number）：用户的 uuid
 * @param title      （String）：图片标题
 * @param photoUrl   （String）：阿里云 OSS 图片访问地址
 * @param typeId     （Number）：图片类别，【0 头像图片、1 图片分享、2 文章图片、3 阅后即焚图片、4 二维码图片】默认：1
 * @param relationId （Number）：与图片类别 Id 相关联的 内容 Id
 * @param callback （Function）：回调函数
 */
exports.insterPhotoInfo = function (obj, userUuid, title, photoUrl, typeId, relationId, callback) {
    /**
     * 加密
     * @type {*|string}
     */
    var userUuidEncrypt = CSU.crypto_symmetric_uuid(userUuid).encrypt();
    var sql             = "INSERT INTO" +
        " `" + obj.dbTable + "photo`" +
        " (`id`,`user_id`,`title`,`url`,`type_id`,`relation_id`)" +
        " VALUES" +
        " (NULL, '" + userUuidEncrypt + "', '" + title + "', '" + photoUrl + "', '" + typeId + "', '" + relationId + "'); ";
    var conn            = obj.conDb.getMysqlConn();
    /**
     * 利用事务对表进行插入
     */
    conn.beginTransaction(function (err) {
        if (err) {
            callback(err, false);
        } else {
            conn.query(sql, function (err, rows) {
                if (err) {
                    conn.rollback(function () {//如果失败回滚
                        callback(err, false);
                    });
                }
                var insertId = rows.insertId;//获取自动生成的id
                conn.release();
                callback(err, insertId);
            })
        }
    });
};
/**
 * 获取单个人图片列表接口 queryPhotoListByUser
 * @param obj                （Object）：【{conDb：Object, dbTable: String}】，MYSQL 实例化对象 和 自定义表头
 * @param userUuid           （Number）：用户的 uuid
 * @param startIndex         （Number）：分页开始的 pageId
 * @param diffIndex           （Number）：分页差值
 * @param userInfoInterface（Function）：用户信息回调函数
 * @param callback         （Function）：回调函数
 */
exports.queryPhotoListByUser = function (obj, userUuid, startIndex, diffIndex, userInfoInterface, callback) {
    var userUuidEncrypt = CSU.crypto_symmetric_uuid(userUuid).encrypt(),
        startIndexDecrypt;
    /**
     * 初始化 startIndex 为 false
     */
    if (!startIndex) {

    } else {
        startIndexDecrypt = CSU.crypto_symmetric_uuid(startIndex).decrypt();
    }
    userInfoInterface(userUuid, function (err, data) {
        if (err) {
            callback(err, false);
        }
        /**
         * 建立连接
         */
        var conn         = obj.conDb.getMysqlConn();
        var sqlPhotoList = "select" +
            " p.url as p_url," +
            " p.id as p_id," +
            " p.browse_times as p_browse_times" +
            " from" +
            " " + obj.dbTable + "photo p" +
            " where " +
            " p.user_id='" + userUuidEncrypt + "'" +
            " and u.type_id = ut.id order by p.id desc";
        /**
         * 开始查询
         */
        conn.beginTransaction(function (error) {
            if (error) {
                callback(error, false);
            } else {
                conn.query(sqlPhotoList, function (err, rows, fields) {
                    if (err) {
                        conn.rollback(function () {//如果失败回滚
                            callback(err, false);
                        });
                    } else {
                        /**
                         * 更新浏览次数
                         */
                        co(function*() {
                            return yield rows.map(function (file) {
                                var browseTimes               = us.isNumber(file.p_browse_times) ? file.p_browse_times : parseInt(file.p_browse_times);
                                var sqlUpdatePhotoBrowseTimes = "UPDATE " +
                                    " `" + obj.dbTable + "photo`" +
                                    " SET" +
                                    " `browse_times` = '" + (browseTimes + 1) + "'" +
                                    " WHERE" +
                                    " `" + obj.dbTable + "photo`.`id` =  '" + file.id + "'";
                                return conn.query(sqlUpdatePhotoBrowseTimes, function (err, rows) {
                                    if (err) {
                                        conn.rollback(function () {//如果失败回滚
                                            callback(err, false);
                                        });
                                    } else {
                                        callback(err, rows);
                                    }
                                });
                            });
                        }).then(function () {
                            conn.release();
                            callback(err, {userInfo: data, photoList: rows});
                        });
                    }
                });
            }
        });
    });
};
/**
 * 获取图片列表，每个人的最后一张图片
 * @param obj
 * @param startIndex
 * @param diffIndex
 * @param userInfoInterface
 * @param callback
 */
exports.queryPhotoListByUsersOfLastIndex = function (obj, startIndex, diffIndex, userInfoInterface, callback) {
    
    var sql_1 = "select " +
        "ut.name as ut_name, " +
        "u.photo_url as u_photo_url, " +
        "u.nickname as u_nickname, " +
        "u.email_cache as u_email_cache, " +
        "p.url as p_url, " +
        "p.id as p_id, " +
        "u.like_num as u_like_num, " +
        " u.type_id as u_type_id " +
        "from " +
        "mmy_user u, mmy_user_type ut, mmy_photo p " +
        "where " +
        "p.user_id=u.id " +
        "and u.type_id = ut.id order by p.id desc";


    var conn = obj.conDb.getMysqlConn();
    /**
     * 利用事务对表进行插入
     */
    conn.beginTransaction(function (err) {
        if (err) {
            callback(err, false);
        } else {
            conn.query(sql, function (err, rows) {
                if (err) {
                    conn.rollback(function () {//如果失败回滚
                        callback(err, false);
                    });
                }
                var insertId = rows.insertId;//获取自动生成的id
                conn.release();
                callback(err, insertId);
            })
        }
    });
};