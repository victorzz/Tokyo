/**
 * Created by zhang on 14/12/31.
 */
var logger = require('./../log').logger;
var adminDB = require('./../nedb/admindb');
var orderDB = require('./../nedb/ordersdb');
var clientDB = require('./../nedb/clientdb');
var SocketIO = require('./../socketio');
var comm = require('../comm');
var EventProxy = require('eventproxy');
var jade = require('jade');
var fs = require('fs');

//Start------------------socketio-----------------------
var socketIO = require('../socketio');
socketIO.init();

exports.getAllClients = SocketIO.getAllClientIds;

//End------------------socketio-----------------------


var WaitSessionManager = require("../WaitSessionManager").WaitSessionManager({
    timeout: 60000,
    sessionTimeOut: function (sessionId) {
        console.log('removed timeout session:' + sessionId);
    }
});

var updateSessionKey = function (req, username, oldsessionkey, fcallback) {
    var key = comm.randomString();
    if (username.length > 0)
        adminDB.updateSessionKeyForUser(username, key, function (user) {
            req.session.key = key;
            if (fcallback)
                fcallback(user, key);
        });
    else
        adminDB.updateSessionKey(oldsessionkey, key, function (user) {
            req.session.key = key;
            if (fcallback)
                fcallback(user, key);
        });
}

var checkAndUpdateSessionKey = function (req, callback) {
    if (comm.isExist(req.session.key)) {
        var ep = EventProxy.create('isTimeOutA', 'isTimeOutB', function (timeOutA, timeOutB) {
            if (timeOutA && !timeOutB)
                updateSessionKey(req, "", req.session.key, function (user, key) {
                    if (callback)
                        callback(true);
                });
            else if (callback)
                callback(false);
        });

        adminDB.isSessionTimeOutForUser("", req.session.key, 6000, function (isTimeOut, user) {
            if (isTimeOut)
                ep.emit('isTimeOutA', true);
            ep.emit('isTimeOutA', false);
        });

        adminDB.isSessionTimeOutForUser("", req.session.key, 9000, function (isTimeOut, user) {
            if (isTimeOut)
                ep.emit('isTimeOutB', true);
            ep.emit('isTimeOutB', false);
        });
    }
}
exports.checkAndUpdateSessionKey = checkAndUpdateSessionKey;

//callback(isLegalSession:true/false)
var isLegalSession = function (req, callback) {
    if (comm.isExist(req.session.key)) {
        adminDB.isSessionTimeOutForUser("", req.session.key, 9000, function (isTimeOut, user) {
            if (callback)
                callback(!isTimeOut, user);
        });
    } else if (callback)
        callback(false, null);
};

exports.isLegalSession = isLegalSession;

var _renderJadeFile = function (fileName, data) {
    var options = {};
    options.filename = __dirname + '/../views' + fileName;
    var html = jade.compile(fs.readFileSync(__dirname + '/../views' + fileName, 'utf8'), options)(data);
    return html;
}


var updateClientLineState = function (res, data, actionComment, clientId, state, callback) {
    var tdata = {};
    clientDB.updateClientStateById(clientId, state, function (err1, nclient) {
        if (err1) {
            tdata.msg = err1;
            tdata.done = false;
            tdata.msg = actionComment + "失败!   " + err1;
        } else {
            tdata.done = true;
            tdata.clientId = nclient.clientId;
            tdata.listId = data.listId;
            tdata.msg = "["+nclient.info+"]"+actionComment + "成功!";
            tdata.html = _renderJadeFile("/admin/module/clientListLine.jade", {
                tablet: {
                    id: data.listId,
                    serialId: nclient.clientId,
                    info: nclient.info,
                    state: nclient.state,
                    name:nclient.name
                    //id:
                }
            });
        }
        res.send(tdata);
    });
}

exports.reqData = function (req, res) {
    var data = req.body;
    //logger.info('reqData reqCmd:' + data.reqCmd);

    var tdata = {};

    if (comm.isExist(data.clientId) && comm.isExist(data.reqType)) {
        if (data.reqType == "updateOrder") {
            res.send(tdata);
            return;
        } else if (data.reqType == "getOrderHtml") {
            console.log("orderData.foods.length:" + Object.keys(data.order.foods).length);
            tdata.html = _renderJadeFile("/menu/order.jade", {orderData: data.order});
            res.send(tdata);
            return;
        } else if (data.reqType == "confirmedOrder") {
            orderDB.addOrder(data.order, data.clientId);
            res.send(tdata);
            return;
        } else if (data.reqType == "reqState") {
            clientDB.findClientByClientId(data.clientId, function (err, client) {
                if (!comm.isExist(client)) {
                    tdata.state = "unknown";
                } else {
                    tdata.state = client.state;
                    tdata.info = client.info;
                }
                res.send(tdata);
                return;
            });
        } else if (data.reqType == "reqInitBox") {
            tdata.html = _renderJadeFile("/menu/infoInitBox.jade", {module: "initBox",name:data.clientName});
            res.send(tdata);
            return;
        } else if (data.reqType == "reqUpdateClientInfo") {
            clientDB.register(data.clientId, "Unregistered", function (err, client) {
                clientDB.updateClientById(data.clientId, {info:data.info,name:data.clientName,type:data.clientType}, function (err1, nclient) {
                    if (err1) {
                        tdata.msg = err1;
                        tdata.done = false;
                        tdata.msg = "更新信息失败!  " + err1;
                        res.send(tdata);
                        return;
                    } else {
                        tdata.done = true;
                        tdata.msg = "更新信息成功!";
                        tdata.html = _renderJadeFile("/menu/infoInitBox.jade", {module: "waitingRegister",name:data.clientName});
                        res.send(tdata);
                        return;
                    }
                });
            });
            return;
        } else if (data.reqType == "reqRegisterInfo") {
            tdata.html = _renderJadeFile("/menu/infoInitBox.jade", {module: "registeredInfoBox",name:data.clientName});
            res.send(tdata);
            return;
        }

    }


    var ep = EventProxy.create('checkAndUpdateSessionKey', 'isLegalSession', function (isUpdatedSessionKey, legalSession) {
        if (legalSession.isLegal) {
            if (data.cmd == "switchPage") {
                adminDB.updatePageForUser(legalSession.user.userName, data.page);
                tdata.result = "ok";
                res.send(tdata);
                return;
            } else if (data.cmdType == "adminSignIn") {
                res.send(tdata);
                return;
            } else if (data.cmd == "tabletRegister") {
                clientDB.register(data.clientId, "Off", function (err, client) {
                    updateClientLineState(res, data, "注册", data.clientId, "Off", function () {
                    });
                });
            } else if (data.cmd == "tabletOff") {
                updateClientLineState(res, data, "关台", data.clientId, "Off", function () {
                });
            } else if (data.cmd == "tabletOn") {
                updateClientLineState(res, data, "开台", data.clientId, "On", function () {
                });
            } else if (data.cmd == "tabletStop") {
                updateClientLineState(res, data, "停用", data.clientId, "Disabled", function () {
                });
            } else if (data.cmd == "tabletDel") {
                updateClientLineState(res, data, "删除", data.clientId, "unknown", function () {
                });
            }else if (data.cmd == "tabletEnable") {
                updateClientLineState(res, data, "启用", data.clientId, "Off", function () {
                });
            }
        } else {

        }
    });

    isLegalSession(req, function (isLegal, user) {
        if (isLegal && comm.isExist(user)) {
            checkAndUpdateSessionKey(req, function (isUpdated) {
                ep.emit('checkAndUpdateSessionKey', isUpdated);
            });
            ep.emit('isLegalSession', {isLegal: true, user: user});
        }
        else {
            ep.emit('checkAndUpdateSessionKey', false);
            if (data.cmdType == "adminSignIn") {
                adminDB.isLegalUser(data.username, data.password, function (isLegalUser, msg) {
                    if (isLegalUser) {
                        updateSessionKey(req, data.username, "", function (user, key) {
                            ep.emit('isLegalSession', {isLegal: true, user: user});
                        });
                        //req.session.key = comm.randomString();
                        //adminDB.updateSessionKeyForUser(data.username,req.session.key);
                        tdata.result = true;
                    } else {
                        ep.emit('isLegalSession', {isLegal: false, user: null});
                        tdata.result = false;
                        tdata.msg = msg;
                    }
                });
            } else {
                ep.emit('isLegalSession', {isLegal: false, user: null});
            }
        }
    });

    /*
     if('searchTB' == data.reqCmd){
     var sessionId = SocketIO.searchTB(data.keyword);
     WaitSessionManager.regSession(sessionId,res);
     }else if('searchJD' == data.reqCmd){
     var sessionId = SocketIO.searchJD(data.keyword);
     WaitSessionManager.regSession(sessionId,res);
     }
     */
};

exports.returnReqData = function (sessionId, data) {
    var tconsume = WaitSessionManager.consume(sessionId);
    console.log("consume:" + tconsume + "ms in session:" + sessionId);
    var tsession = WaitSessionManager.finishSession(sessionId);
    if (comm.isExist(tsession)) {
        tsession.send(data);
        WaitSessionManager.removeSession(sessionId);
    }
}