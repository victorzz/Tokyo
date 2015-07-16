var isExist = function(obj) {
/*
    if(obj)
         console.log("obj is Object!");
    if(obj !== 'null')
        console.log("obj is Not null!");
    if(obj != 'undefined')
        console.log("obj is Not undefined!");
*/
    return (obj && obj !== 'null' && obj != 'undefined');
};

var getRamdonID = function(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

var is_array = function(value) {
    return value && typeof value === 'object' && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
};

var copyObject = function(t, s) {
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
    } else {
        t = s;
    }
}; 