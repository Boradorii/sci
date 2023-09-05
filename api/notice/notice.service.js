// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./notice.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const { copyFileSync } = require('fs');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

class noticeService {

    /**
    *  ��Ȯ�� �˸� ���� ��ȸ
    *  @param petId - ������ �ڵ� (String)
    *  @return ��ȸ ��� ��ȯ(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.26. �����ۼ�
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
         *  Ȯ�� �˸� ���� ��ȸ
         *  @param petId - ������ �ڵ� (String)
         *  @return ��ȸ ��� ��ȯ(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. �����ۼ�
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
         *  ����ǥ ���� ��ȸ
         *  @param petId - ������ �ڵ� (String)
         *  @return ��ȸ ��� ��ȯ(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. �����ۼ�
         *  
         */
    async inquiryList(inquiry_num) {
        let result = await mysqlDB('select', queryList.inquiryList, [inquiry_num]);

        return result
    };

    /**
         *  Ȯ�� �˸� ���� ��ȸ
         *  @param petId - ������ �ڵ� (String)
         *  @return ��ȸ ��� ��ȯ(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.26. �����ۼ�
         *  
         */
    async searchInfo(h_user_code, startDate, endDate, name, select) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        endDate = endDate + " 23:59:59";
        // ȯ�ڸ� �������� �˻�
        let result;
        if (select == 1) {
            result = await mysqlDB('select', queryList.searchPetInfo, [name, h_user_code, startDate, endDate]);
        } else {
            // ��ȣ�ڸ� �������� �˻�
            name = cryptoUtil.encrypt_aes(cryptoKey, name);
            result = await mysqlDB('select', queryList.searchProtectorInfo, [name, h_user_code, startDate, endDate])
        }
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].p_user_name)
        }
        return result
    };


    /**
         *  ���� ���� db�� ���� inquiry_list�� opinion
         *  @param petId - ������ �ڵ� (String)
         *  @return ��ȸ ��� ��ȯ(json)
         *  @author ChangGyu Lee
         *  @since 2023.08.02. �����ۼ�
         *  
         */
    async inquiry_post(inquiry_num, inquiry_contents) {

        let result = await mysqlDB('update', queryList.inquiry_post, [inquiry_contents, inquiry_num]);
        if (result.succ == 1) {
            await mysqlDB('update', queryList.inquiry_check, [inquiry_num]);
            let select_info = await mysqlDB('select', queryList.select_info, [inquiry_num]);
            await mysqlDB('insert', queryList.inquiry_insert, [select_info.rows[0].p_user_code, select_info.rows[0].pet_id, inquiry_num]);
        }

        return result
    };




}

module.exports = noticeService;