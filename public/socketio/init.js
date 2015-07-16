/**
 * Created by zhang on 15/6/6.
 */

var bossServer = buildSocketIoConnector();


var initSocketIO = function(data, cServer) {
    //cServer.on("reqSearchTB", onReqSearchTB);
    //cServer.on("reqSearchJD", onReqSearchJD);
    console.log("initSocketIO ok");
};

var destorySocketIO = function(data, cServer) {
    if (isExist(cServer) && isExist(cServer.removeEventListener)){
        //cServer.removeEventListener('reqSearchJD', onReqSearchJD);
        //cServer.removeEventListener('reqSearchTB', onReqSearchTB);
    }
};

bossServer.initConnecter(window.location.hostname, "3001", {
    connect : initSocketIO,
    disconnect : destorySocketIO,
    connect_failed : destorySocketIO
});
