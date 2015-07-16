/**
 * Created by zhang on 15/6/6.
 */

var reqData = function(tdata, callback) {
    //    console.log("reqUserData type:" + tdata.type);
    $.ajax({
        type : 'POST',
        data : JSON.stringify(tdata),
        contentType : 'application/json',
        url : '/reqData',
        success : function(data) {
            //            console.log("reqUserData ok type:" + tdata.type);
            if (data) {
                if(callback)
                    callback(data);
            } else {
                //postMsg(getAlertMsg('error', 'Server error'));
            }
        },
        error : function() {
            //postMsg(getAlertMsg('error', 'Server connection lost!!!'));
        }
    });
};


