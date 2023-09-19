// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./home.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');


class HomeService {
   async getData(userCode, selectDay) {
    let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
    cryptoKey = cryptoKey.row.key_string;

    let result = await mysqlDB('select', queryList.getData, [userCode,selectDay])

    if(result.rowLength != 0){
        result.rows[0].af_normal = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].af_normal);
        result.rows[0].af_brachial = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].af_brachial);
        result.rows[0].af_tachycardia = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].af_tachycardia);
        result.rows[0].hr = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].hr_avg);
        result.rows[0].predict_high_pressure = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].predict_high_pressure);
        result.rows[0].predict_low_pressure = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].predict_low_pressure);
        result.rows[0].predict_glucose = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].predict_glucose);
        //result.rows[0].health_index = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].health_index);
    }

    return result
};
}

module.exports = HomeService;