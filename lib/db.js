var conn                = null,		//定义conn用于连接mysql数据库
    mysql               = require('mysql');

exports.getMysqlConn = function (db_config) {
    function handleDisconnect(connection) {
        connection.on('error', function (err) {
            if (err) {
                console.error('db error', err);
            }
            if (!err.fatal) {
                connection.end();
                return;
            }

            if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                connection.end();
                throw err;
            }

            console.log('Re-connecting lost connection: ' + err.stack);

            connection = mysql.createConnection(connection.config);
            handleDisconnect(connection);
            connection.connect(function (err) {              // The server is either down
                if (err) {                                     // or restarting (takes a while sometimes).
                    console.error('error when connecting to db:', err);
                    setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
                }                                     // to avoid a hot loop, and to allow our node script to
            });
        });
    }

    var err;
    try {
        if (conn) {
            conn = mysql.createConnection(db_config);
            handleDisconnect(conn);
        } else {
            conn = new mysql.createConnection(db_config);
            handleDisconnect(conn);
        }
    } catch (_error) {
        err = _error;
        throw err;
    }
    return conn;
};
