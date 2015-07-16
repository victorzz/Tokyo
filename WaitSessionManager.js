/**
 * Created by zhang on 15/1/10.
 */
var comm = require('./comm');
var moment = require('moment');
var HashMap = require('hashmap').HashMap;

exports.WaitSessionManager = function(options){
    var t = this;
    this.waitSessions = new HashMap();
    this.timeout = comm.isExist(options.timeout)?options.timeout:5000;
    this.sessionTimeOut =  comm.isExist(options.sessionTimeOut)?options.sessionTimeOut:null;

    this.regSession = function(sessionId,req){
        if(comm.isExist(sessionId) &&comm.isExist(req)) {
            t.waitSessions.set(sessionId,{req:req,regTime:moment()});
        }
    };

    this.finishSession = function(sessionId){
        if(comm.isExist(t.waitSessions.get(sessionId))){
            var ts = t.waitSessions.get(sessionId).req;
            t.waitSessions.remove(sessionId);
            return ts;
        }
        return null;
    };

    this.consume = function(sessionId){
        if(comm.isExist(t.waitSessions.get(sessionId))){
            var rt = t.waitSessions.get(sessionId).regTime;
            return moment().diff(rt,"milliseconds");
        }
        return 0;
    };

    this.removeSession = function(sessionId){
        if(comm.isExist(t.waitSessions.get(sessionId))){
            delete t.waitSessions.remove(sessionId);
        }
    };

    this.timer = setInterval(function(){
        t.waitSessions.forEach(function(sessoin, sessionId) {
            var now = moment();
            //console.log("[WaitSessionManager] check time: "+now.diff(sessoin.regTime) );
            if(now.diff(sessoin.regTime) >= t.timeout){
                t.removeSession(sessionId);
                //console.log("WaitSessionManager removed Session:"+sessionId);

                if(comm.isExist(t.sessionTimeOut)){
                    t.sessionTimeOut(sessionId);
                }
            }
        });
    },300);

    return this;
}