/**
 * Created by zhang on 15/6/7.
 */
/**
 * Created by zhang on 15/6/6.
 */

var Datastore = require('nedb');
var md5 = require('MD5');
var logger = require("../log").logger;
var comm = require('../comm');
var moment = require('moment');

var clientDB = new Datastore('./db/client.db');
clientDB.loadDatabase();

var removeClient = function (id, callback) {
    var client = {
        clientId: id
    };

    clientDB.remove(client, {}, function (err, numRemoved) {
        if (callback)
            callback(err, numRemoved);
    });
};

var addClient = function (id, state, callback) {
    var user = {
        clientId: id,
        addedDate: moment(new Date()),
        state: "unknown",
        info: "",
        name:"",
        type:""
    };

    clientDB.insert(user, function (err, newClient) {
        if (callback)
            callback(err, newClient);
    });
};

var findClientByClientId = function (id, callback) {
    clientDB.findOne({clientId: id}, function (err, client) {
        if (err)
            logger.error("Do findClientByClientId in clientDB err:" + err);
        if (callback)
            callback(err, client);
    });
};
exports.findClientByClientId = findClientByClientId;

exports.register = function (id, state, callback) {
    findClientByClientId(id, function (err, client) {
        if (!comm.isExist(client)) {
            addClient(id, state, function (err, client) {
                if (callback)
                    callback(err, client);
            });
        } else {
            logger.error("Do register in clientDB err clientId:" + id + " is Exist!");
            if (callback)
                callback("Do register in clientDB err clientId:" + id + " is Exist!", client);
        }
    });
};

exports.unRegister = function () {
    findClientByClientId(id, function (err, client) {
        if (comm.isExist(client)) {
            removeClient(id, function (err, numRemoved) {
                if (callback)
                    callback(err, client);
            });
        } else {
            logger.error("Do unRegister in clientDB err clientId:" + id + " is NOT Exist!");
            if (callback)
                callback("Do unRegister in clientDB err clientId:" + id + " is NOT Exist!", null);
        }
    });
};

exports.getAllClients = function (callback) {
    clientDB.find({type:"MenuClient"}, function (err, clients) {
        if (callback)
            callback(err, clients);
    });
};

exports.isRegister = function (clientId, callback) {
    findClientByClientId(clientId, function (err, client) {
        if (comm.isExist(client)) {
            if (callback)
                callback(true, client);
        } else {
            if (callback)
                callback(false, null);
        }
    });
};

exports.updateClientStats = function (client, newClient, callback) {
    clientDB.update(client, newClient, {}, function (err, numReplaced) {
        if (err)
            logger.error("Do updateClientStats in clientDB err :" + err);

        if (callback) {
            callback(err, numReplaced);
        }
    });
};

exports.updateClientInfo = function (client, newClient, callback) {
    clientDB.update(client, newClient, {}, function (err, numReplaced) {
        if (err)
            logger.error("Do updateClientInfo in clientDB err :" + err);

        if (callback) {
            callback(err, numReplaced);
        }
    });
};

var updateClientById = function (clientId, data, callback) {
    clientDB.update({clientId: clientId}, {$set: data}, {}, function (err1, numReplaced) {
        if (err1)
            logger.error("Do updateClientById in clientDB err :" + err);

        findClientByClientId(clientId, function (err, client) {
            if (callback) {
                callback(err, client);
            }
        });

    });

};
exports.updateClientById = updateClientById;

exports.updateClientStateById = function (clientId, state, callback) {
    updateClientById(clientId, {state: state}, callback);
};

exports.updateClientInfoById = function (clientId, info, callback) {
    updateClientById(clientId, {info: info}, callback);
};
