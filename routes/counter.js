/**
 * Created by zhang on 15/6/21.
 */
var express = require('express');
var counter = express.Router();
var comm = require('../comm');
var post = require('./post');
var adminDB = require('./../nedb/admindb');
var orderDB = require('./../nedb/ordersdb');
var clientDB = require('./../nedb/clientdb');
var EventProxy = require('eventproxy');
var HashMap = require('hashmap').HashMap;

/* GET home page. */
counter.get('/', function(req, res, next) {
    res.render('counter/index', {page: "404"});
});

module.exports = counter;
