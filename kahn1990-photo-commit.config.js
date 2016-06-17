var k1990PC   = require('kahn1990-photo-commit'),
    connMysql = require('./connMysql');

var optations     = {
    connMysql: connMysql,
    db       : {
        header : true,
        content: 'kahn1990test'
    }
};
var k1990PC_func = k1990PC(optations);

module.exports = k1990PC_func;