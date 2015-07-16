/**
 * Created by zhang on 15/6/7.
 */

var Datastore = require('nedb');
var md5 = require('MD5');
var logger = require("../log").logger;
var comm = require('../comm');
var moment = require('moment');

var foodDB = new Datastore('./db/food.db');
foodDB.loadDatabase();