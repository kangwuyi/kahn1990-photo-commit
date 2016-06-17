var express  = require('express')
    , object = require('../con_mysql');

/**
 * 根据图片ID获取评论
 */
exports.getPhotoComment = function (p_id, callback) {
    var sql = "select " +
        "ut.name as ut_name, " +
        "u.photo_url as u_photo_url, " +
        "u.nickname as u_nickname, " +
        "u.email_cache as u_email_cache, " +
        " u.type_id as u_type_id, " +
        "p.url as p_url, " +
        "p.id as p_id, " +
        "c.id as c_id, " +
        "c.content as c_content " +
        "from " +
        "mmy_user u, mmy_user_type ut, mmy_photo p, mmy_comment c " +
        "where " +
        "c.user_id = u.id " +
        "and u.type_id = ut.id " +
        "and p.id = c.photo_id " +
        "and p.id = '" + p_id + "'";
    object.queryMysql(sql, callback);
};

exports.getPhotoCommentNum = function (comment_id, callback) {
    var sql = "select " +
        " ut.name as ut_name, " +
        " u.photo_url as u_photo_url, " +
        " u.nickname as u_nickname, " +
        " u.email_cache as u_email_cache, " +
        " u.type_id as u_type_id, " +
        " c.id as c_id, " +
        " cs.user_id as cs_user_id, " +
        " cs.id as cs_id " +
        " from " +
        " mmy_user u, mmy_user_type ut, mmy_comment c, mmy_comment_sure cs " +
        " where " +
        " cs.user_id = u.id " +
        " and u.type_id = ut.id " +
        " and c.id = cs.comment_id " +
        " and c.id = '" + comment_id + "'";
    object.queryMysql(sql, callback);
};