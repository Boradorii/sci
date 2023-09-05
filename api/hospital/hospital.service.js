// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./hospital.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class hospitalService {

    /**
    *  ��й�ȣ Ȯ��
    *  @param petId - ������ �ڵ� (String)
    *  @return ��ȸ ��� ��ȯ(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.10. �����ۼ�
    *  
    */
    async pwCheck(h_user_code, pw) {
        let result = await mysqlDB('select', queryList.pwCheck, [pw, h_user_code])
        console.log(result);
        if (result.rows[0].h_user_code == h_user_code) {
            result.state = true;
        } else {
            result.state = false;
        }
        console.log(result + "dkfos");

        return result
    };

    /**
        *  ���� ����
        *  @param petId - ������ �ڵ� (String)
        *  @return ��ȸ ��� ��ȯ(json)
        *  @author ChangGyu Lee
        *  @since 2023.07.10. �����ۼ�
        *  
        */
    async hospitalInfoLoad(h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.hospitalInfoLoad, [h_user_code])
        result.rows[0].h_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].h_user_name)
        result.rows[0].h_user_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].h_user_phone_first);
        result.rows[0].h_user_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].h_user_phone_middle);
        result.rows[0].h_user_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].h_user_phone_last);
        result.rows[0].h_user_email_id = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].h_user_email_id);
        let operatingTime;
        operatingTime = result.rows[0].h_answer_time.split('-');
        result.operatingTime = operatingTime;
        return result
    };

    /** ================================================================
        *  �ߺ� ����ó �˻�
        *  @author 
        *  @since 2023.07.12
        *  @history 2023.07.12 �ʱ� �ۼ�
        *  ================================================================
        */
    async checkPhoneDuplicate(phone1, phone2, phone3, h_adminCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        phone1 = cryptoUtil.encrypt_aes(cryptoKey, phone1);
        phone2 = cryptoUtil.encrypt_aes(cryptoKey, phone2);
        phone3 = cryptoUtil.encrypt_aes(cryptoKey, phone3);


        let result = await mysqlDB('selectOne', queryList.select_phone_duplicate, [phone1, phone2, phone3, h_adminCode]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
     *  �ߺ� email �˻�
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async checkEmailDuplicate(eIdString, eDomainString, h_adminCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        eIdString = cryptoUtil.encrypt_aes(cryptoKey, eIdString);
        
        let result = await mysqlDB('selectOne', queryList.select_user_email_duplicate, [eIdString, eDomainString, h_adminCode]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
         *  �̸��� ���� Ȯ�� �� ������ȣ ����
         *  @author 
         *  @since 2023.06.19
         *  @history 2023.06.19 �ʱ� �ۼ�
         *  ================================================================
         */
    async sendEmail(params, context) {
        let result = {}

        //�̸��� ������ȣ ����
        let authNumber = ''
        for (let i = 0; i < 6; i++) {
            authNumber += Math.floor(Math.random() * 10);
        }
        let sendResult = await authEmailSend(params.eId, params.eDomain, authNumber, context);
        if (sendResult.status == 'Success') { // �̸��� ���� ����
            result["authNumber"] = authNumber;
            result["success"] = 1;
        } else { // �̸��� ���� ����
            result["success"] = 0;
        }

        return result;
    }

    /** ================================================================
     *  �������� ����
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async hospitalInfoModify(list) {
        // ���� ���� ��ȣȭ
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.inputList.h_user_name = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_name); // ����ڸ�
        list.inputList.h_user_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_first); // ����� �޴�����ȣ ���ڸ�
        list.inputList.h_user_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_middle); // ����� �޴�����ȣ ����ڸ�
        list.inputList.h_user_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_last); // ����� �޴�����ȣ ���ڸ�
        list.inputList.h_user_email_id = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_email_id); // ����� �̸��� ID

        let accountArray = [list.inputList.h_name, list.inputList.h_address2, list.inputList.h_telnum, list.inputList.h_operating_time,
        list.inputList.h_answer_time, list.inputList.h_user_account_pw, list.inputList.h_user_name,
        list.inputList.h_user_phone_first, list.inputList.h_user_phone_middle,
        list.inputList.h_user_phone_last, list.inputList.h_user_email_id, list.inputList.h_user_email_domain, list.h_adminCode
        ];

        console.log("��й�ȣ ���� " + cryptoUtil.decrypt_aes(cryptoKey, list.inputList.h_user_account_pw));

        //���� ���� ���
        let result = await mysqlDB('update', queryList.hospitalInfoModify, accountArray);
        return result;
    };

    /** ================================================================
     *  ���� ����
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async withdrawService(h_adminCode) {
        let result = await mysqlDB('update', queryList.withdrawService, [h_adminCode]);
        console.log(result);
        return result;
    };


    /**
     *  ���� ������ ��� ��ȸ
     *  @param petId - ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. �����ۼ�
     *  
     */
    async staffListLoad(h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.staffListLoad, [h_user_code])
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].h_staff_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_name)
            result.rows[i].h_staff_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_first);
            result.rows[i].h_staff_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_middle);
            result.rows[i].h_staff_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_last);
            result.rows[i].h_staff_eid = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_eid);
        }

        return result
    };


    /**
     *  ���� ���� ��ȸ
     *  @param petId - ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. �����ۼ�
     *  
     */
    async staffInfo(h_staff_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.staffInfo, [h_staff_code])
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].h_staff_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_name)
            result.rows[i].h_staff_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_first);
            result.rows[i].h_staff_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_middle);
            result.rows[i].h_staff_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_phone_last);
            result.rows[i].h_staff_eid = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_eid);
        }

        return result
    };


    /** ================================================================
        *  �ߺ� ����ó �˻�_����
        *  @author 
        *  @since 2023.07.12
        *  @history 2023.07.12 �ʱ� �ۼ�
        *  ================================================================
        */
    async checkStaffPhoneDuplicate(phone1, phone2, phone3, h_staff_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        phone1 = cryptoUtil.encrypt_aes(cryptoKey, phone1);
        phone2 = cryptoUtil.encrypt_aes(cryptoKey, phone2);
        phone3 = cryptoUtil.encrypt_aes(cryptoKey, phone3);


        let result = await mysqlDB('selectOne', queryList.select_staff_phone_duplicate, [phone1, phone2, phone3, h_staff_code]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
     *  �ߺ� email �˻�_����
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async checkStaffEmailDuplicate(eIdString, eDomainString, h_staff_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        eIdString = cryptoUtil.encrypt_aes(cryptoKey, eIdString);

        let result = await mysqlDB('selectOne', queryList.select_staff_email_duplicate, [eIdString, eDomainString, h_staff_code]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
         *  ���� ���
         *  @author 
         *  @since 2023.07.12
         *  @history 2023.07.12 �ʱ� �ۼ�
         *  ================================================================
         */
    async insertStaff(list) {
        // ���� ���� ��ȣȭ
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.staffList.h_staff_name = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_name); // ����ڸ�
        list.staffList.h_staff_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_first); // ����� �޴�����ȣ ���ڸ�
        list.staffList.h_staff_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_middle); // ����� �޴�����ȣ ����ڸ�
        list.staffList.h_staff_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_last); // ����� �޴�����ȣ ���ڸ�
        list.staffList.h_staff_eid = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_eid); // ����� �̸��� ID

        let accountArray = [list.h_adminCode, list.staffList.h_staff_name, list.staffList.h_staff_phone_first,
        list.staffList.h_staff_phone_middle, list.staffList.h_staff_phone_last, list.staffList.h_staff_eid,
        list.staffList.h_staff_edomain, list.staffList.h_staff_class, list.staffList.h_staff_note

        ];


        //���� ���� ���
        let result = await mysqlDB('insert', queryList.insertStaff, accountArray);
        return result;
    };

    /** ================================================================
         *  ���� ���� ����
         *  @author 
         *  @since 2023.07.12
         *  @history 2023.07.12 �ʱ� �ۼ�
         *  ================================================================
         */
    async updateStaff(list) {
        // ���� ���� ��ȣȭ
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.staffList.h_staff_name = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_name); // ����ڸ�
        list.staffList.h_staff_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_first); // ����� �޴�����ȣ ���ڸ�
        list.staffList.h_staff_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_middle); // ����� �޴�����ȣ ����ڸ�
        list.staffList.h_staff_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_last); // ����� �޴�����ȣ ���ڸ�
        list.staffList.h_staff_eid = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_eid); // ����� �̸��� ID

        let accountArray = [list.staffList.h_staff_name, list.staffList.h_staff_phone_first,
        list.staffList.h_staff_phone_middle, list.staffList.h_staff_phone_last, list.staffList.h_staff_eid,
        list.staffList.h_staff_edomain, list.staffList.h_staff_class, list.staffList.h_staff_note,
        list.h_staff_code
        ];

        // ����� ���� ����
        let result = await mysqlDB('update', queryList.updateStaff, accountArray);
        return result;
    };

    /** ================================================================
         *  ����� ����
         *  @author 
         *  @since 2023.07.12
         *  @history 2023.07.12 �ʱ� �ۼ�
         *  ================================================================
         */
    async deleteStaff(h_staff_code) {
        console.log("service    ");
        // ����� ���� ����
        let result = await mysqlDB('update', queryList.deleteStaff, [h_staff_code]);
        console.log("service    sql����   " + result);
        return result;
    };

}

module.exports = hospitalService;