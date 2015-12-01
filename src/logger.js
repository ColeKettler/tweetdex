'use strict';

var winston = require('winston');

var logDir = '/var/log/tweetdex/';

var logger = new winston.Logger();

if (process.env.NODE_ENV === 'production') {
  logger.add(winston.transports.File, {
    name: 'info-file',
    level: 'info',
    filename: logDir + 'tweetdex_info.log',
  });
  logger.add(winston.transports.File, {
    name: 'warn-file',
    level: 'warn',
    filename: logDir + 'tweetdex_warn.log',
  });
  logger.add(winston.transports.File, {
    name: 'error-file',
    level: 'error',
    filename: logDir + 'tweetdex_errors.log',
    handleExceptions: true,
    humanReadableUnhandledException: true,
  });
}

if (process.env.NODE_ENV === 'development') {
  logger.add(winston.transports.Console, {
    level: 'debug',
    colorize: true,
  });
}

module.exports = logger;
