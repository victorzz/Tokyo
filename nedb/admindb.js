/**
 * Created by zhang on 15/6/6.
 */

var Datastore = require('nedb');
var md5 = require('MD5');
var logger = require("../log").logger;
var comm = require('../comm');
var moment = require('moment');



var adminDB = new Datastore('./db/admin.db');
adminDB.loadDatabase();

var addUser = function(username,email,firstname,lastname,password,callback){
    var user = {
        firstName:firstname,
        lastName:lastname,
        password:md5(password),
        email:email,
        userName:username
    };

    adminDB.insert(user,function(err, newUser){
        if(callback)
            callback(err, newUser);
    });
};
exports.addUser = addUser;

var initAdminDB = function(){
    adminDB.find({ userName: 'admin' }, function (err, users) {
        if(users.length == 0){
            addUser("admin","admin@mastor.com","Admin","Mastor","admin",function(err, newUser){
                if(err)
                    logger.error("Init admin database error:"+err);
                else
                    logger.info("Init admin database success!");
            });
        }else{
            logger.info("Skip init admin database!");
        }
    });
};

var findUserByUserName = function(username,callback){
    adminDB.findOne({ userName: username }, function (err, user) {
        if(err)
            logger.error("Do findUserByUserName in adminDB err:" + err);

        if (callback)
            callback(err,user);
    });
};
exports.findUserByUserName = findUserByUserName;

var findUserBySessionKey = function(sessionkey,callback){
    adminDB.findOne({ session: sessionkey }, function (err, user) {
        if(err)
            logger.error("Do findUserBySessionKey in adminDB err:" + err);

        if (callback)
            callback(err,user);
    });
};
exports.findUserBySessionKey = findUserBySessionKey;

//callback(ture/false, msg)
exports.isLegalUser = function(username, password,callback){
    findUserByUserName(username, function (err, user) {
        if(!comm.isExist(user)){
            logger.warn("Can' find the user:"+username);
            if(callback)
                callback(false, username+" is not exist");
        }else{
            if(user.password != md5(password)){
                logger.warn("User password is not correct! ["+username+" : "+password+"]");
                if(callback)
                    callback(false, "Password is not correct");
            }else{
                logger.info("User password is correct! ["+username+"]");
                if(callback)
                    callback(true, username+" is Legal User");
            }
        }
    });
};

var updateUserByUserName = function(username,callback){
    findUserByUserName(username, function (err, user) {
        if(!comm.isExist(user)){
            logger.warn("Can' find the user:"+username);
            if(callback)
                callback(false, username+" is not exist");
        }else{
            if(callback)
                callback(true,user);
            adminDB.update({userName:username},user,{}, function(err,numReplaced, newUser){
                if (err)
                    logger.warn("Update user in adminDB:"+username+" error:"+err);
                else
                    console.log("Updated user in adminDB:"+username);
            });
        }
    });
}


//data is user
exports.updateSessionKeyForUser = function(username,sessionkey,callback){
    updateUserByUserName(username, function (isFind,data) {
        if(isFind){
            data.session = sessionkey;
            data.sessionTimestamp = moment().format(comm.DBTimestampFormat);
            if(callback)
                callback(data);
        }else{
            logger.warn("Update sessionkey for user :"+username+" failed, because : "+data);
        }
    })
};

//data is user
exports.updateSessionKey = function(oldsessionkey,sessionkey,callback){
    findUserBySessionKey(oldsessionkey, function (isFind,data) {
        if(isFind){
            data.session = sessionkey;
            data.sessionTimestamp = moment().format(comm.DBTimestampFormat);
            if(callback)
                callback(data);
        }else{
            logger.warn("Update SessionKey for :"+oldsessionkey+" failed, because : "+data);
        }
    })
};

exports.updatePageForUser = function(username,page){
    updateUserByUserName(username, function (isFind,data) {
        if(isFind){
            data.page = page;
            data.pageTimestamp = moment(new Date());
        }else{
            logger.warn("Update Page for user :"+username+" failed, because : "+data);
        }
    })
};

exports.gotPageForUser = function(username,callback){
    updateUserByUserName(username, function (isFind,data) {
        if(isFind){
            if(callback)
                callback(true,{page:data.page,pageTimestamp:data.pageTimestamp});
        }else{
            logger.warn("get Page for user :"+username+" failed, because : "+data);
            if(callback)
                callback(false,data);
        }
    })
};

//check the how much minutes timeout, 10?
var isSessionTimeOut = function (isFind,user,difftime,callback) {
    if(isFind && comm.isExist(user)){
        if(!comm.isExist(user.session)){
            if(callback)callback(false,user);
        }else if(!comm.isExist( user.sessionTimestamp)){
                if(callback)callback(true,user);
        }else {
            var d = moment(user.sessionTimestamp,comm.DBTimestampFormat);
            //console.log("zz:"+moment().diff(d,'seconds'));
            if(callback)
                callback(moment().diff(d,'seconds') > difftime,user);
        }
    }else{
        logger.warn("Did not find user in isSessionTimeOut failed!");
    }
};

var checkTimeOut = function (err,user,difftime,callback) {
    if(err)
        logger.error("Do isSessionTimeOutForUser in adminDB err:" + err);
    else
        isSessionTimeOut(true,user,difftime,callback);
};

exports.isSessionTimeOutForUser = function(username,sessionkey,difftime,callback){
    if(difftime > 0){
        if(username.length > 0) {
            findUserByUserName(username, function(err,user){
                checkTimeOut(err,user,difftime,callback);
            });
        }
        else if(sessionkey.length > 0){
            findUserBySessionKey(sessionkey, function(err,user){
                checkTimeOut(err,user,difftime,callback);
            });
        }
    }

};

initAdminDB();