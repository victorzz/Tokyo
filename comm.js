var S = require("string");

exports.DBTimestampFormat = "YYYY-MM-DD HH:mm:ss x"

var crypto = require('crypto');

exports.cryptoPwd = function(word){
    return crypto.createHash('sha256').update(word).digest("hex");;
}

exports.randomString = function () {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 16;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

exports.getRamdonID = function(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.isExist = isExist = function(obj) {
    //console.log("typeof:" + typeof (obj));
    return (( typeof (obj) == 'object' && obj !== 'null' && obj !== 'undefined' && obj) || ( typeof (obj) != 'object' && typeof (obj) != 'undefined' ));
};

exports.is_array = is_array = function(value) {
    return value && typeof value === 'object' && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
};

exports.isFunction = isFunction = function(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

exports.clone = function(a){
    return JSON.parse(JSON.stringify(a));
}

exports.copyObject = copyObject = function(t, s) {
    if ('object' == typeof (s)) {
        for (var i in s) {
            if ('object' == typeof (s[i])) {
                if (!is_array(s[i])) {
                    t[i] = {};
                    copyObject(t[i], s[i]);
                } else {
                    t[i] = [];
                    copyObject(t[i], s[i]);
                }
            } else if ("date" == i || "created" == i || "updated" == i) {
                //console.log(i + ":" + s[i]);
                var d1 = moment(s[i].replace("000000", ""), "YYYY-MM-DD HH:mm:ss.SSS");

                //console.log("d1:" + d1.toJSON());
                t[i] = d1.toDate();
            } else {
                t[i] = s[i];
            }
        }
    } else if (is_array(s)) {
        for (var i in s) {
            var xt;
            copyObject(xt, s[i]);
            t.push(xt);
        }
    } else if (!isFunction(s)) {
        t = s;
    }
};

