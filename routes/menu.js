/**
 * Created by ZhangZhen on 15-6-4.
 */

var express = require('express');
var router = express.Router();

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./public/dlcf/package.json', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('menu/index2', { title: 'Express',menuData:obj });
});

module.exports = router;
