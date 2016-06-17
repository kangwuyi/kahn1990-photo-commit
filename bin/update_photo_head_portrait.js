var US    = require('underscore'),
    ASYNC = require('async'),
    co    = require('co'),
    SPN   = require('../lib/set_photo_name'),
    DBI   = require('../lib/decode_base64_image');

/**
 * 上传头像模块
 * @param user_uuid 用户的 UUID
 * @param photo_stream 图片流
 * @param oss_folder_path_name OSS 图片文件夹名
 * @param user_info_interface 用户信息回调接口
 * @param update_user_photo_interface 上传用户头像接口
 * @param callback 回调函数
 */
exports.update_photo_head_portrait = function (user_uuid, photo_stream, oss_folder_path_name, user_info_interface, update_user_photo_interface, callback) {
    if (arguments.length < 6) {
        callback({
            status : false,
            content: "传入参数缺失"
        });
    }
    if (!US.isString(oss_folder_path_name)) {
        callback({
            status : false,
            content: "图片文件夹名错误"
        });
    }
    if (!US.isFunction(user_info_interface)) {
        callback({
            status : false,
            content: "用户信息回调接口函数错误"
        });
    }
    if (!US.isFunction(update_user_photo_interface)) {
        callback({
            status : false,
            content: "更新头像接口函数错误"
        });
    }
    if (!US.isFunction(callback)) {
        callback({
            status : false,
            content: "回调函数错误"
        });
    }
    ASYNC.series({
        /**
         * 验证用户是否存在
         */
        verification_user_info: function (cb) {
            user_info_interface(user_uuid, function (err, data) {
                if (err) {
                    callback({
                        status : false,
                        content: err
                    });
                    cb(err, false);
                } else {
                    /**
                     * 长度大于 1 代表用户存在
                     */
                    if (data.length > 0) {
                        cb(err, data);
                    } else {
                        cb(err, false);
                    }
                }
            });
        },
        /**
         * 开始长传到 OSS
         * @param cb
         */
        start_update_photo    : function (cb) {
            /**
             * 重新设置文件名
             * @type {string}
             */
            var filename         = user_uuid + "_" + (new Date()).getTime() + "_" + SPN.set_photo_name("ddd.jpg", 8);
            /**
             * 重新设定路径
             * @type {string}
             */
            var postFilenamePath = (oss_folder_path_name.lastIndexOf('/') === -1) ? oss_folder_path_name + "/" + filename : oss_folder_path_name + filename;
            /**
             * 记得先判断 photo_stream 类型
             */
            var imageBuffer      = DBI.decode_base64_image(photo_stream);

            /**
             * OSS 上传
             */
            co(function*() {
                var ossResult = yield this.conOss.put(postFilenamePath, imageBuffer.data);
                cb(null, ossResult);
            }).catch(function (err) {
                callback({
                    status : false,
                    content: err
                });
                cb(err, false);
            });
        }
    }, function (err, results) {
        if (!results.verification_user_info) {
            callback({
                status : false,
                content: err
            });
        }
        /**
         * 更新用户表的头像链接
         */
        update_user_photo_interface(
            user_uuid,
            results.start_update_photo.url,
            function (err) {
                if (err) {
                    callback({
                        status : false,
                        content: err
                    });
                } else {
                    callback({
                        status : true,
                        content: results.start_update_photo
                    });
                }
                user_uuid = photo_stream = oss_folder_path_name = user_info_interface = update_user_photo_interface = null;
            });
    });
};