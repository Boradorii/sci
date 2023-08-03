// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_health.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class aHealthService {

}

module.exports = aHealthService;