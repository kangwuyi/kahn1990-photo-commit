exports.set_photo_name = function (filename, num) {
    var g_object_name = '';
    for (var i = 0; i < num; i++) {
        g_object_name += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62));
    }
    g_object_name += ((filename.lastIndexOf('.') != -1) ? filename.substring(filename.lastIndexOf('.')) : '');
    return g_object_name;
};