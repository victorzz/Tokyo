/**
 * User: zhangzhen
 * Date: 12-12-24
 * Time: 上午11:51
 * To change this template use File | Settings | File Templates.
 */

var log4js = require('log4js');


//log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.file('cheese.log'), 'cheese');
//log4js.replaceConsole();

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'cheese.log', category: 'cheese' ,maxLogSize:2048000,backups:1}
    ]
});


exports.logger = log4js.getLogger('cheese');
log4js.getLogger('cheese').setLevel('TRACE');

/*
logger.trace("Got cheese.");
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
*/
