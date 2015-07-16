/**
 * Created by zhang on 15/6/6.
 */

var express = require('express');
var moment = require('moment');
var router = express.Router();
var comm = require('../comm');
var post = require('./post');
var adminDB = require('./../nedb/admindb');
var orderDB = require('./../nedb/ordersdb');
var clientDB = require('./../nedb/clientdb');
var EventProxy = require('eventproxy');
var HashMap = require('hashmap').HashMap;

/* GET admin login page. */
router.get('/', function (req, res, next) {
    post.isLegalSession(req, function (isLegal, user) {
        post.checkAndUpdateSessionKey(req);
        if (isLegal) {
            adminDB.gotPageForUser(user.userName, function (isFind, data) {
                if (!isFind || (isFind && data.page == "dashboard")) {
                    res.render('admin/index', {page: "dashboard"});
                }
                else if (data.page == "orders") {
                    var ep = EventProxy.create('gotAllOrders', 'gotAllClients', function (orders, clients) {

                        clientMap = new HashMap();

                        for(var i in clients){
                            clientMap.set(clients[i].clientId,clients[i].info);
                        }

                        for (var index in orders) {
                            orders[index].date = moment(orders[index].date).format("YYYY-MM-DD HH:mm");
                            orders[index].deskInfo = clientMap.get(orders[index].clientId);
                        }
                        res.render('admin/index', {page: "orders", orders: orders});
                    });

                    orderDB.getAllOrders(function (orders) {
                        ep.emit('gotAllOrders',orders);
                    });

                    clientDB.getAllClients(function(err, clients){
                        ep.emit('gotAllClients',clients);
                    });
                } else if (data.page == "tablets") {
                    getClientsInfo(function (list) {
                        res.render('admin/index', {page: "tablets", tablets: list});

                    });
                } else if (data.page == "printers") {
                    res.render('admin/index', {page: "printers"});
                } else if (data.page == "counters") {
                    res.render('admin/index', {page: "counters"});
                    //}else if(data.page == "orders"){
                } else {
                    res.render('admin/index', {page: "404"});
                }
            });
        } else {
            res.render('admin/login', {});
        }
    });
});

var getClientsInfo = function (callback) {

    clientDB.getAllClients(function (err, clients) {
        var list = post.getAllClients();
        var clientList = [];
        var ClientIndex = 0;
        for (var i = 0; i < clients.length + list.length; i++) {
            if (i < clients.length) {
                var needSkip = false;

                if(clients[i].clientId == "unknown"){
                    for (var index in list)
                        if(list[index] == clients[i].clientId) break;
                    needSkip = true;
                }

                if (!needSkip) {

                    var isOnline = false;


                        for (var index in list)
                            if(list[index] == clients[i].clientId) {
                                isOnline = true;
                                break;
                            }

                    clientList[ClientIndex] = {
                        id: ++ClientIndex,
                        serialId: clients[i].clientId,
                        state: isOnline?clients[i].state:"Offline",
                        info: clients[i].info,
                        name:clients[i].name
                    };
                }
            } else {
                var isListed = false;
                for (var index in clients)
                    if (list[i - clients.length] == clients[index].clientId) {
                        isListed = true;
                        break;
                    }

                if (!isListed) {
                    clientList[ClientIndex] = {
                        id: ++ClientIndex,
                        serialId: list[i - clients.length],
                        state: "Unregistered",
                        info: "",
                        name:"[Unregistered]"
                    };
                }
            }
        }
        if (callback)
            callback(clientList);
    });

}


module.exports = router;
