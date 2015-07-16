/**
 * Created by zhang on 14/12/31.
 */

var comm = require('./comm');
var ChromeClientManager = require('./ClientManager').ChromeClientManager();
var io = null;

var post = require("./routes/post");

exports.init = function () {
    io = require('socket.io')(3001);

    io.on('connection', function (socket) {
        socket.on('registClient', function(data, fn) {
            //console.log("regist:" + socket.id + " ClientId:" + data.id);

            if(ChromeClientManager.has(data.id)){
                var t_socket = io.sockets.connected[ChromeClientManager.getClientById(data.id)];

                if(comm.isExist(t_socket)){
                    io.sockets.remove(t_socket);
                }
            }

            ChromeClientManager.updateClient(data.id,socket.id);
        });

        socket.on('answerData', function(data, fn) {
            console.log("answerData :" + data.event + " data ok:" + comm.isExist(data.data));
                if (data.event == "DataOfSearchTB") {
                    //console.log("DataOfSearchTB from session:" + data.sessionId);
                    post.returnReqData(data.sessionId,data);
                }else if(data.event == "DataOfSearchJD") {
                    //console.log("DataOfSearchJD from session:" + data.sessionId);
                    post.returnReqData(data.sessionId,data);
                }
        });
    });
};

exports.getAllClientIds = ChromeClientManager.getAllClientIds;

var isAvailableSocketIo = function (socketId,doWhat) {
    var t_socket =  io.sockets.connected[socketId];
    var isExist = comm.isExist(t_socket);
    if(isExist && comm.isExist(doWhat)){
        doWhat(t_socket);
    }
    return isExist;
}

var findClient = function(doWhat){
    var tClient = ChromeClientManager.getClient();
    if(isAvailableSocketIo(tClient,doWhat)){
        return true;

    }
    return false;
};

exports.searchTB = function(keyword){
    var sessionId = comm.getRamdonID(16);
    var isDone = findClient(function(socketIo){
        socketIo.emit("reqSearchTB", {keyword:keyword,sessionId:sessionId});
        console.log("reqSearchTB :"+keyword);
    });

    return isDone?sessionId:null;
};

exports.searchJD = function(keyword){
    var sessionId = comm.getRamdonID(16);
    var isDone = findClient(function(socketIo){
        socketIo.emit("reqSearchJD", {keyword:keyword,sessionId:sessionId});
        console.log("reqSearchJD :"+keyword);
    });

    return isDone?sessionId:null;
};