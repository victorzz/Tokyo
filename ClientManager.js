/**
 * Created by zhang on 15/1/11.
 */
var HashMap = require('hashmap').HashMap;
var moment = require('moment');
var comm = require('./comm');

exports.ChromeClientManager = function(){
    var t = this;
    this.ChromeClientMap = new HashMap();

    this.updateClient = function(clientId,socketId){
        //var _lastSocketId = "";
        if(t.has(clientId)){
            //_lastSocketId = t.ChromeClientMap.get(clientId).socketId;
            t.removeClient(clientId);
        }

        t.ChromeClientMap.set(clientId,{socketId:socketId,
            //lastSocketId:_lastSocketId,
            regTime:moment(),
            isStable:false,
            curStatus:{
                RequestingNum:0,
                FinishedReqNum:0,
                AverageTimeConsume:0
            }
        });
        //console.log("updateClient ChromeClientMap count:"+t.ChromeClientMap.count());
    };
    
    this.removeClient = function (clientId) {
        t.ChromeClientMap.remove(clientId);
    }

    this.has = function(clientId){
        return t.ChromeClientMap.has(clientId);
    };

    this.getClientById = function(clientId){
        return t.ChromeClientMap.get(clientId).socketId;
    };

    this.getClient = function(){
        console.log("getClient ChromeClientMap count:"+t.ChromeClientMap.count());
        if(t.ChromeClientMap.count() > 0){
            var clientIds = t.ChromeClientMap.keys();
            return t.ChromeClientMap.get(clientIds[0]).socketId;
        }
        return null;
    };

    this.getAllClientIds = function(){
        console.log("getAllClients ChromeClientMap count:"+t.ChromeClientMap.count());
        return t.ChromeClientMap.keys();
    };

    this.timer = setInterval(function(){
        t.ChromeClientMap.forEach(function(clientData, clientId) {
            if(!clientData.isStable && moment().diff(clientData.regTime,"milliseconds") >= 1000){
                clientData.isStable = true;
                console.log("ChromeClient: ["+clientId +"] is stable now!");
            }
        });
    },1000);

    return t;
};

