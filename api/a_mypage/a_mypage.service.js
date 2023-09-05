// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_mypage.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class aMyPageService {

    /**
     *  �ݷ��� ���
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. �����ۼ�
     *  
     */
    async insertPet(data) {
        let currentYear = new Date().getFullYear();

        let name = data.name,
            age = currentYear - data.age,
            weight = data.weight,
            p_user_code = data.p_user_code,
            gender = data.gender,
            pet_isNeutering = data.pet_isNeutering,
            breed = data.breed,
            pet_code = data.pet_code;

        let result = await mysqlDB('insert', queryList.insertPet, [pet_code, name, age, weight, breed, p_user_code, pet_isNeutering, gender]);
        let first = await mysqlDB('select', queryList.first, [p_user_code]);

        if (first.rowLength == 1) {
            await mysqlDB('update', queryList.doFirst, [p_user_code]);
        }

        return result
    };
    /**
     *  �츮 ���� ���� ������ �ε�
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. �����ۼ�
     *  
     */
    async loadPetList(p_user_code) {
        let currentYear = new Date().getFullYear();
        let result = await mysqlDB('select', queryList.loadPetList, [p_user_code]);
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].pet_byear = currentYear - result.rows[i].pet_byear;
        }
        return result
    };

    /**
     *  ��ǥ �ݷ��� ������ �������� ��ǥ �ݷ��� ����
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. �����ۼ�
     *  
     */
    async setRepresent(p_user_code, petId) {
        // ������Ʈ ���� ���� ��ǥ �ݷ��� �� ���̵� �ҷ�����
        let result = await mysqlDB('selectOne', queryList.exFirst, [p_user_code]);
        // ��ǥ �ݷ��� ������Ʈ
        let result2 = await mysqlDB('update', queryList.setSecond, [p_user_code, petId]);
        let result1 = await mysqlDB('update', queryList.setFirst, [p_user_code, petId]);
        return result
    };

    /**
     *  ��ǥ �ݷ��� ������ �������� ��ǥ �ݷ��� ����
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. �����ۼ�
     *  
     */
    async loadModifyPageData(petId) {
        // ������Ʈ ���� ���� ��ǥ �ݷ��� �� ���̵� �ҷ�����
        let result = await mysqlDB('selectOne', queryList.loadModifyPageData, [petId]);
        return result
    };
    /**
     *  �ݷ��� ����
     *  @param petId �ݷ����� �ڵ� (Int)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.17. �����ۼ�
     *  
     */
    async modifyMyPet(data) {
        let currentYear = new Date().getFullYear();

        let p_user_code = data.p_user_code,
            petId = data.petId,
            pet_name = data.pet_name,
            pet_weight = data.pet_weight,
            pet_age = currentYear - data.pet_age,
            pet_gender = data.pet_gender,
            pet_isNeutering = data.pet_isNeutering,
            pet_breed = data.pet_breed,
            pet_code = data.pet_code;
        if (pet_gender == "male") {
            pet_gender = 'M';
        } else {
            pet_gender = 'W';
        }
        let result = await mysqlDB('update', queryList.modifyMyPet, [pet_name, pet_age, pet_weight, pet_breed, pet_isNeutering, pet_gender, pet_code, p_user_code, petId]);
        return result
    };




    /**
     *  �ݷ��� ����
     *  @param petId �ݷ����� �ڵ� (Int)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.17. �����ۼ�
     *  
     */
    async myPetDelete(petId) {
        // ������Ʈ ���� ���� ��ǥ �ݷ��� �� ���̵� �ҷ�����
        let result = await mysqlDB('delete', queryList.myPetDelete, [petId]);
        if (result.succ == 1) {
            await mysqlDB('delete', queryList.myPetDelete2, [petId]);
            await mysqlDB('delete', queryList.myPetDelete3, [petId]);
            await mysqlDB('delete', queryList.myPetDelete4, [petId]);
        }

        return result
    };

    /**
     *  �˸����� ������ �ε�
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.18. �����ۼ�
     *  
     */
    async alertDataLoad(p_user_code) {

        let push_date = await mysqlDB('selectOne', queryList.alertPushDateLoad, [p_user_code]);
        let result = await mysqlDB('select', queryList.alertDataLoad, [p_user_code]);
        result.pushDate = push_date.row.push_date;
        result.allowState = push_date.row.p_user_provide_yn;
        return result
    };

    /**
     *  �˸����� Ǫ������
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.19. �����ۼ�
     *  
     */
    async alertPushSetting(p_user_code, isAllow) {

        if (isAllow == 0) {
            await mysqlDB('update', queryList.allowPushSetting, [p_user_code]);
        } else {
            await mysqlDB('update', queryList.disallowPushSetting, [p_user_code]);
        }
        let result = await mysqlDB('selectOne', queryList.select_pushSetting, [p_user_code]);
        return result
    };

    /**
     *  �˸����� �˸� Ȯ�� ���� üũ
     *  @param p_user_code ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.19. �����ۼ�
     *  
     */
    async checkAlert(p_user_code, alert_created_time) {

        let check = await mysqlDB('update', queryList.checkAlert, [p_user_code, alert_created_time]);
        let result = await mysqlDB('select', queryList.select_inquiry_num, [p_user_code, alert_created_time])
        result.succ = check.succ;
        return result
    };
    /**
     *  �˸����� �����Ƿ� �亯 ����
     *  @param inquiry_num �����ڵ� (Int)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.08.03. �����ۼ�
     *  
     */
    async inquiry_answer(inquiry_num) {

        let result = await mysqlDB('select', queryList.inquiry_answer, [inquiry_num]);
        return result
    };

    /**
     *  �˸� �ڵ� ����
     *  @param p_user_code ����� �ڵ�(string)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.08.03. �����ۼ�
     *  
     */
    async alert_delete_auto(p_user_code) {

        let result = await mysqlDB('delete', queryList.alert_delete_auto, [p_user_code, p_user_code, p_user_code]);

        return result
    };

    /**
     *  �˸� ���� ��ư Ŭ���Ͽ� ����
     *  @param p_user_code ����� �ڵ�(string)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.08.11. �����ۼ�
     *  
     */
    async alert_delete(alert_num) {
        let result = await mysqlDB('delete', queryList.alert_delete, [alert_num]);

        return result
    };


    /**
     *  ��й�ȣ Ȯ��
     *  @param petId - ������ �ڵ� (String)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. �����ۼ�
     *  
     */
    async aPwCheck(p_userCode, pw) {
        let result = await mysqlDB('select', queryList.aPwCheck, [pw, p_userCode])
        if (result.rows[0].p_user_code == p_userCode) {
            result.state = true;
        } else {
            result.state = false;
        }
        return result
    };



    /**
     *  �� ���� ��ȸ
     *  @param petId - �ݷ����� �ڵ� (Int)
     *  @return ��ȸ ��� ��ȯ(json)
     *  @author ChangGyu Lee
     *  @since 2023.08.01. �����ۼ�
     *  
     */
    async myInfoLoad(p_userCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.myInfoLoad, [p_userCode])
        result.rows[0].p_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_user_name)
        result.rows[0].p_phone_first = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_first);
        result.rows[0].p_phone_middle = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_middle);
        result.rows[0].p_phone_last = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_phone_last);
        result.rows[0].p_email_id = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_email_id);
        result.rows[0].p_address_1 = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_address_1);
        result.rows[0].p_address_2 = cryptoUtil.decrypt_aes(cryptoKey, result.rows[0].p_address_2);

        return result
    };

    /** ================================================================
     *  �ߺ� ����ó �˻�
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.08.02 �ʱ� �ۼ�
     *  ================================================================
     */
    async checkPhoneDuplicate(phone1, phone2, phone3, p_userCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        phone1 = cryptoUtil.encrypt_aes(cryptoKey, phone1);
        phone2 = cryptoUtil.encrypt_aes(cryptoKey, phone2);
        phone3 = cryptoUtil.encrypt_aes(cryptoKey, phone3);

        let result = await mysqlDB('selectOne', queryList.select_phone_duplicate, [phone1, phone2, phone3, p_userCode]);
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
    async checkEmailDuplicate(eIdString, eDomainString, p_userCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        eIdString = cryptoUtil.encrypt_aes(cryptoKey, eIdString);

        let result = await mysqlDB('selectOne', queryList.select_user_email_duplicate, [eIdString, eDomainString, p_userCode]);
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
     *  ���� ����
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async myInfoModify(list) {
        // ���� ���� ��ȣȭ
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.inputList.p_user_name = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_user_name); // �̸�
        list.inputList.p_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_first); // �޴�����ȣ ���ڸ�
        list.inputList.p_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_middle); // �޴�����ȣ ����ڸ�
        list.inputList.p_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_last); // �޴�����ȣ ���ڸ�
        list.inputList.p_email_id = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_email_id); // �̸��� ID
        list.inputList.p_address_1 = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_address_1); // �ּ�
        list.inputList.p_address_2 = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_address_2); // ���ּ�

        let accountArray, result

        if (Object.keys(list.inputList).length != 8) { //��й�ȣ ���� �� ��
            accountArray = [list.inputList.p_user_name, list.inputList.p_account_pw, list.inputList.p_phone_first, list.inputList.p_phone_middle,
                list.inputList.p_phone_last, list.inputList.p_email_id, list.inputList.p_email_domain,
                list.inputList.p_address_1, list.inputList.p_address_2, list.p_userCode
            ];
            //���� ���� ���
            result = await mysqlDB('update', queryList.myInfoModify, accountArray);
        } else { //��й�ȣ ���� ���Ҷ�
            accountArray = [list.inputList.p_user_name, list.inputList.p_phone_first, list.inputList.p_phone_middle,
                list.inputList.p_phone_last, list.inputList.p_email_id, list.inputList.p_email_domain,
                list.inputList.p_address_1, list.inputList.p_address_2, list.p_userCode
            ];
            //���� ���� ���
            result = await mysqlDB('update', queryList.myInfoModify_noPw, accountArray);
        }
        return result;
    };

    /** ================================================================
     *  ���� ����
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 �ʱ� �ۼ�
     *  ================================================================
     */
    async withdrawService(p_userCode) {
        let result = await mysqlDB('update', queryList.withdrawService, [p_userCode]);
        console.log(result);
        return result;
    };
}





module.exports = aMyPageService;