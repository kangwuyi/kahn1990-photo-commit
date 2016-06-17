var US      = require('underscore'),
    async   = require('async'),
    co      = require('co'),
    Busboy  = require('busboy'),
    inspect = require('util').inspect,
    sharp   = require('sharp'),
    CSU     = require('../lib/crypto_symmetric_uuid'),
    SPN     = require('../lib/set_photo_name'),
    DBI     = require('../lib/decode_base64_image');


exports.update_photo = function (user_uuid, photo_stream, oss_folder_path_name, headers_header, user_info_interface, callback) {
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
    if (!US.isFunction(callback)) {
        callback({
            status : false,
            content: "回调函数错误"
        });
    }

    var busboy           = new Busboy({headers: headers_header}),
        FieldObjectCache = {};

    headers_header = null;

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

        async.series({
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
                var filename         = user_uuid + "_" + (new Date()).getTime() + "_" + SPN.set_photo_name(filename, 8);
                /**
                 * 重新设定路径
                 * @type {string}
                 */
                var postFilenamePath = (oss_folder_path_name.lastIndexOf('/') === -1) ? oss_folder_path_name + "/" + filename : oss_folder_path_name + filename;
                /**
                 * 处理图片
                 */
                var transformer      = sharp()
                    .resize(500)
                    .on('info', function (info) {
                        //console.log(info);
                    });
                /**
                 * OSS 上传
                 */
                co(function*() {
                    var ossResult = yield this.conOss.putStream(postFilenamePath, file.pipe(transformer));
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

            PhotoDb.insterPhotoUrl(
                cheackEmailData[0].id,
                FieldObjectCache['photoTitle'],
                ossResult.url,
                function (err, upDataPhotoUrlData) {
                    if (err) {
                        console.error(err);
                        return res.jsonp({status: 'json', result: err});
                    } else {
                        req.session.userInfo.photo_url = ossResult.url;
                        var photoNum                   = req.session.userInfo.photo_num;
                        photoNum                       = (typeof photoNum === 'number') ? photoNum : parseInt(photoNum);
                        req.session.userInfo.photo_num = photoNum + 1;
                        return res.jsonp({status: 'json', result: ossResult.name});
                    }
                });

        });
    });
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        if (Object.prototype.toString.call(val) === '[object String]') {
            FieldObjectCache[fieldname] = val;
        } else {
            FieldObjectCache[fieldname] = inspect(val);
        }
    });
    busboy.on('finish', function () {
        //todo
    });
};