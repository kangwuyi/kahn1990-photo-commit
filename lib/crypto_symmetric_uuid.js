var crypto = require('crypto'),
    FS     = require('fs'),
    PEM    = FS.readFileSync('./server.pem'),
    KEY    = PEM.toString('ascii');

exports.crypto_symmetric_uuid = function (text) {
    var algs = ['blowfish', 'aes-256-cbc', 'cast', 'des', 'des3', 'idea', 'rc2', 'rc4', 'seed'];

    return {
        /**
         * 加密
         * @returns {string}
         */
        encrypt: function () {
            var encrypted = "";
            var cip       = crypto.createCipher(algs[1], KEY);
            encrypted += cip.update(text, 'utf8', 'hex');
            encrypted += cip.final('hex');
            
            return encrypted;

        },
        /**
         * 解密
         * @returns {string}
         */
        decrypt: function () {
            var decrypted = "";
            var decipher  = crypto.createDecipher(algs[1], KEY);
            decrypted += decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        }
    }
};