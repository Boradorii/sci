// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./notice.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const { copyFileSync } = require('fs');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

class noticeService {

    /**
    *  미확인 알림 내역 조회
    *  @param petId - 관리자 코드 (String)
    *  @return 조회 결과 반환(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.26. 최초작성
    *  
    */
    async noticeNList(h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.noticeNList, [h_user_code]);
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name)
        }

        return result
    };

    /**
         *  확인 알림 내역 조회
         *  @param petId - 관리자 코드 (String)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. 최초작성
         *  
         */
    async noticeYList(h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.noticeYList, [h_user_code]);
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name)
        }

        return result
    };

    /**
         *  문진표 내용 조회
         *  @param petId - 관리자 코드 (String)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. 최초작성
         *  
         */
    async inquiryList(inquiry_num) {
        let result = await mysqlDB('select', queryList.inquiryList, [inquiry_num]);

        return result
    };

    /**
         *  확인 알림 내역 검색
         *  @param petId - 관리자 코드 (String)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. 최초작성
         *  
         */
    async searchInfo(h_user_code, startDate, endDate, name, select) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        endDate = endDate + " 23:59:59";
        // 환자명 조건으로 검색
        let result;
        if (select == 1) {
            result = await mysqlDB('select', queryList.searchPetInfo, [name, h_user_code, startDate, endDate]);
        } else {
            // 보호자명 조건으로 검색
            name = cryptoUtil.encrypt_aes(cryptoKey, name);
            result = await mysqlDB('select', queryList.searchProtectorInfo, [name, h_user_code, startDate, endDate])
        }
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name)
        }
        return result
    };


    /**
         *  문의 내용 db에 저장 inquiry_list의 opinion
         *  @param petId - 관리자 코드 (String)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.08.02. 최초작성
         *  
         */
    async inquiry_post(inquiry_num, inquiry_contents) {

        let result = await mysqlDB('update', queryList.inquiry_post, [inquiry_contents, inquiry_num]);
        if (result.succ == 1) {
            let check = await mysqlDB('update', queryList.inquiry_check, [inquiry_num]);
        }

        return result
    };




}

module.exports = noticeService;