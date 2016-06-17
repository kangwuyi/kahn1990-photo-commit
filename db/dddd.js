var express  = require('express')
    , object = require('../con_mysql');

/**
 * 获得首页轮播图的图片
 */
exports.getHomePageExtension = function (err, callback) {
    var sql = "select * from mmy_extension ";
    object.queryMysql(sql, callback);
};

exports.getHomePagePhoto = function (err, callback) {
    var sql = "select " +
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
        "and p.recommend = 1 " +
        "and u.type_id = ut.id";
    object.queryMysql(sql, callback);
};
/**
 * 获取所有图片
 * @param err
 * @param callback
 */
exports.getPhotoPage = function (err, callback) {
    var sql = "select " +
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
    object.queryMysql(sql, callback);
};
/**
 * 获取特定图片信息
 * @param photo_id
 * @param callback
 */
exports.getPhotoInfoPage = function (photo_id, callback) {
    var sql = "select " +
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
        "and p.id ='" + photo_id + "' " +
        "and u.type_id = ut.id";
    object.queryMysql(sql, callback);
};
/**
 * 根据u_id获取所有照片
 * @param u_id
 * @param callback
 */
exports.getPhotoByEmailCache = function (u_id, callback) {
    var sql = "select " +
        "u.email_cache as u_email_cache, " +
        "p.url as p_url, " +
        "p.title as p_title, " +
        "p.id as p_id " +
        "from " +
        "mmy_user u, mmy_photo p " +
        "where " +
        "p.user_id=u.id " +
        "and p.user_id ='" + u_id + "' ";
    object.queryMysql(sql, callback);
};
/**
 *
 * @param userId
 * @param title
 * @param photoUrl
 * @param callback
 */
exports.insterPhotoUrl = function (userId, title, photoUrl, callback) {
    var sql = "INSERT INTO" +
        " `mmy_photo`" +
        " (`id`,`user_id`,`title`,`url`)" +
        " VALUES" +
        " (NULL, '" + userId + "', '" + title + "', '" + photoUrl + "'); ";
    object.queryMysql(sql, callback);
};
/**
 *
 * @param userId
 * @param pId
 * @param addPhotoTagValue
 * @param callback
 */
exports.addPhotoTag = function (userId, pId, addPhotoTagValue, callback) {
    var sql = "INSERT INTO" +
        " `mmy_comment`" +
        " (`id`,`user_id`,`content`,`photo_id`)" +
        " VALUES" +
        " (NULL, '" + userId + "', '" + addPhotoTagValue + "', '" + pId + "'); ";
    object.queryMysql(sql, callback);
};
/**
 *
 * @param userId
 * @param commentId
 * @param callback
 */
exports.addPhotoTagSure = function (commentId, userId, callback) {
    var sql = "INSERT INTO" +
        " `mmy_comment_sure`" +
        " (`id`,`user_id`,`comment_id`)" +
        " VALUES" +
        " (NULL, '" + userId + "', '" + commentId + "'); ";
    object.queryMysql(sql, callback);
};

exports.deletePhotoSure = function (commentId, userId, callback) {
    var sql = "DELETE" +
        " FROM" +
        " `maomeiyou`.`mmy_comment_sure`" +
        " WHERE" +
        " `mmy_comment_sure`.`comment_id` = '" + commentId + "'" +
        " and `mmy_comment_sure`.`user_id` = '" + userId + "'";
    object.queryMysql(sql, callback);
};

exports.queryPhotoSure = function (commentId, userId, callback) {
    var sql = "select " +
        " * " +
        " from " +
        " mmy_comment_sure" +
        " where " +
        " comment_id = '" + commentId + "'" +
        " and user_id = '" + userId + "'";
    object.queryMysql(sql, callback);
};