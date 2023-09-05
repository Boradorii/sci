// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./measurement.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class measurementService {
    /**
     *  환자 및 보호자 정보
     *  @param p_user_code - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)a
     *  @author ChangGyu Lee
     *  @since 2023.06.19. 최초작성
     *  
     */
    async searchPetInfo(select, name, h_adminCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        // 환자명 조건으로 검색
        let result;
        if (select == 1) {
            result = await mysqlDB('select', queryList.searchPetInfo, [name, h_adminCode, h_adminCode]);
            console.log('=================test====================');
            console.log(result);
            console.log('=================test====================');
            for (let i = 0; i < result.rowLength; i++) {
                result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name);
                result.rows[i].p_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_first);
                result.rows[i].p_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_middle);
                result.rows[i].p_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_last);
            }
        } else {
            // 보호자명 조건으로 검색
            name = cryptoUtil.encrypt_aes(cryptoKey, name);
            result = await mysqlDB('select', queryList.searchProtectorInfo, [name, h_adminCode, h_adminCode])
            console.log('=================test====================');
            console.log(result);
            console.log('=================test====================');
            for (let i = 0; i < result.rowLength; i++) {
                result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name);
                result.rows[i].p_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_first);
                result.rows[i].p_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_middle);
                result.rows[i].p_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_phone_last);
            }

        }

        return result
    };


    /**
     *  환자 및 보호자 정보
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.06.19. 최초작성
     *  
     */
    async petInfoLoad(petId, h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.petInfoLoad, [petId])
        if (result.rows[0].pet_code === null) {
            result.rows[0].pet_code = '-';
        }
        result.rows[0].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_user_name);
        result.rows[0].p_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_first);
        result.rows[0].p_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_middle);
        result.rows[0].p_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_last);
        return result
    };
}

module.exports = measurementService;