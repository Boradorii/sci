// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./result.sql');
// crypto
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const jwt = require("jsonwebtoken");

class ResultService {
    async getHealthIndex(userCode, mode, startDate, endDate) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let paramsArray, dataList;

        switch (mode) {
            case 'daily':
                paramsArray = [userCode, endDate, startDate];
                dataList = await mysqlDB('select', queryList.select_health_index_daily, paramsArray);
                break;
            case 'monthly':
                paramsArray = [userCode, startDate+'%'];
                dataList = await mysqlDB('select', queryList.select_health_index_monthly, paramsArray);
                break;
        }
        if(dataList.state && dataList.rowLength>0){
            for(let i=0; i<dataList.rowLength; i++){
               // dataList.rows[i].health_index =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].health_index);
                dataList.rows[i].hr =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].hr_avg);
                dataList.rows[i].af_normal =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].af_normal);
                dataList.rows[i].af_brachial =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].af_brachial);
                dataList.rows[i].af_tachycardia =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].af_tachycardia);
                dataList.rows[i].predict_glucose =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].predict_glucose);
                dataList.rows[i].predict_high_pressure =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].predict_high_pressure);
                dataList.rows[i].predict_low_pressure =  cryptoUtil.decrypt_aes(cryptoKey, dataList.rows[i].predict_low_pressure);
            }
        }
        return dataList;
    }
}

module.exports = ResultService;