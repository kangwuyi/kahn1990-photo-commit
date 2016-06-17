exports.queryMysql = function (conDb, sql, callback) {
    var mysql = conDb.getMysqlConn();
    mysql.query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        } else {
            callback(err, rows, fields);
        }
    });
};