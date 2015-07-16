/**
 * Created by zhang on 15/6/7.
 */
var Datastore = require('nedb');
var md5 = require('MD5');
var logger = require("../log").logger;
var comm = require('../comm');
var moment = require('moment');

var orderDB = new Datastore('./db/orders.db');
orderDB.loadDatabase();

exports.addOrder = function(orderData,clientId,callback){
    var order = {
        clientId:clientId,
        date:new Date(),
        foods:orderData.foods,
        lumpsum:orderData.lumpsum
    };

    orderDB.insert(order,function(err, neworder){
        if(callback)
            callback(err, neworder);
    });
};

exports.getAllOrders = function (callback){
    orderDB.find({}).sort({ date: -1 }).exec(function (err, orders) {
        if(!err)
            if(callback)
                callback(orders);
        else
            logger.error("get All Orders error:"+err);
    });
}