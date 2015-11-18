'use strict';

var winston = require('winston');

var logDir = '/var/log/tweetdex/';

var logger = new winston.Logger();

if (process.env.NODE_ENV === 'production') {
  logger.add(winston.transports.File, {
    level: 'info',
    filename: logDir + 'tweetdex.log',
  });
  logger.add(winston.transports.File, {
    filename: logDir + 'exceptions.log',
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
