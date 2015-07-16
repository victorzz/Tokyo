/**
 * Created by zhang on 15/6/14.
 */
var Datastore = require('nedb');
var md5 = require('MD5');
var logger = require("../log").logger;
var comm = require('../comm');
var moment = require('moment');

var printerDB = new Datastore('./db/printer.db');
printerDB.loadDatabase();

var findPrinter = function(query,callback){
    printerDB.find(query,function(err,printers){
        if(callback)
            callback(err,printers);
    });
};
exports.findPrinter = findPrinter;

exports.addPrinter = function(ip,port,name,callback){
    findPrinter({ip:ip,port:port,name:name},function(err,printers){
        if(err)
        logger.error("Do addPrinter ["+ip+":"+port+""+name+" ] error:"+err);
        if(printers.length > 0){

        }
    });
}