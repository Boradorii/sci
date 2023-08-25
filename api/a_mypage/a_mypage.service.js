// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_mypage.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class aMyPageService {

    /**
     *  반려견 등록
     *  @param p_user_code 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. 최초작성
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
     *  우리 아이 관리 페이지 로드
     *  @param p_user_code 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. 최초작성
     *  
     */
    async loadPetList(p_user_code) {
        let currentYear = new Date().getFullYear();


        let result = await mysqlDB('select', queryList.loadPetList, [p_user_code]);
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].pet_byear = currentYear - result.rows[i].pet_byear;

            if (result.rows[i].pet_gender == 'M') {
                result.rows[i].pet_gender = '남아'
            } else {
                result.rows[i].pet_gender = '여아'
            }
        }




        return result
    };



    /**
     *  대표 반려견 설정시 나머지는 대표 반려견 해제
     *  @param p_user_code 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. 최초작성
     *  
     */
    async setRepresent(p_user_code, petId) {
        // 업데이트 전에 기존 대표 반려견 펫 아이디 불러오기
        let result = await mysqlDB('selectOne', queryList.exFirst, [p_user_code]);
        // 대표 반려견 업데이트
        let result2 = await mysqlDB('update', queryList.setSecond, [p_user_code, petId]);

        let result1 = await mysqlDB('update', queryList.setFirst, [p_user_code, petId]);



        return result
    };

    /**
     *  대표 반려견 설정시 나머지는 대표 반려견 해제
     *  @param p_user_code 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.11. 최초작성
     *  
     */
    async loadModifyPageData(petId) {
        // 업데이트 전에 기존 대표 반려견 펫 아이디 불러오기
        let result = await mysqlDB('selectOne', queryList.loadModifyPageData, [petId]);


        return result
    };
    /**
    *  반려견 수정
    *  @param petId 반려동물 코드 (Int)
    *  @return 조회 결과 반환(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.17. 최초작성
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
    *  반려견 삭제
    *  @param petId 반려동물 코드 (Int)
    *  @return 조회 결과 반환(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.17. 최초작성
    *  
    */
    async myPetDelete(petId) {
        // 업데이트 전에 기존 대표 반려견 펫 아이디 불러오기
        let result = await mysqlDB('delete', queryList.myPetDelete, [petId]);
        if (result.succ == 1) {
            await mysqlDB('delete', queryList.myPetDelete2, [petId]);
            await mysqlDB('delete', queryList.myPetDelete3, [petId]);
            await mysqlDB('delete', queryList.myPetDelete4, [petId]);
        }

        return result
    };

    /**
    *  알림관리 페이지 로드
    *  @param p_user_code 관리자 코드 (String)
    *  @return 조회 결과 반환(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.18. 최초작성
    *  
    */
    async alertDataLoad(p_user_code) {

        let push_date = await mysqlDB('selectOne', queryList.alertPushDateLoad, [p_user_code]);
        let result = await mysqlDB('select', queryList.alertDataLoad, [p_user_code]);
        result.pushDate = push_date.row.push_date;
        result.allowState = push_date.row.p_user_provide_yn;
        for (let i = 0; i < result.rowLength; i++) {
            if (result.rows[i].alert_class == 0) {
                result.rows[i].class_num = 0;
                result.rows[i].alert_class = "진료기록"
                result.rows[i].alert_msg = "진료기록이 도착했어요."
            } else if (result.rows[i].alert_class == 1) {
                result.rows[i].class_num = 1;
                result.rows[i].alert_class = "원격의료"
                result.rows[i].alert_msg = "원격의료 답변이 도착했어요."
            } else {
                result.rows[i].class_num = 2;
                result.rows[i].alert_class = "건강관리"
                result.rows[i].alert_msg = "오늘의 건강 상태를 측정해 주세요."
            }

        }
        return result
    };

    /**
    *  알림관리 푸쉬설정
    *  @param p_user_code 관리자 코드 (String)
    *  @return 조회 결과 반환(json)
    *  @author ChangGyu Lee
    *  @since 2023.07.19. 최초작성
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
*  알림관리 알림 확인 여부 체크
*  @param p_user_code 관리자 코드 (String)
*  @return 조회 결과 반환(json)
*  @author ChangGyu Lee
*  @since 2023.07.19. 최초작성
*  
*/
    async checkAlert(p_user_code, alert_created_time) {

        let check = await mysqlDB('update', queryList.checkAlert, [p_user_code, alert_created_time]);
        let result = await mysqlDB('select', queryList.select_inquiry_num, [p_user_code, alert_created_time])
        result.succ = check.succ;
        return result
    };
    /**
*  알림관리 원격의료 답변 열람
*  @param inquiry_num 문의코드 (Int)
*  @return 조회 결과 반환(json)
*  @author ChangGyu Lee
*  @since 2023.08.03. 최초작성
*  
*/
    async inquiry_answer(inquiry_num) {

        let result = await mysqlDB('select', queryList.inquiry_answer, [inquiry_num]);

        return result
    };

    /**
*  알림 자동 삭제
*  @param p_user_code 사용자 코드(string)
*  @return 조회 결과 반환(json)
*  @author ChangGyu Lee
*  @since 2023.08.03. 최초작성
*  
*/
    async alert_delete_auto(p_user_code) {

        let result = await mysqlDB('delete', queryList.alert_delete_auto, [p_user_code, p_user_code, p_user_code]);

        return result
    };

    /**
*  알림 삭제 버튼 클릭하여 삭제
*  @param p_user_code 사용자 코드(string)
*  @return 조회 결과 반환(json)
*  @author ChangGyu Lee
*  @since 2023.08.11. 최초작성
*  
*/
    async alert_delete(alert_num) {
        let result = await mysqlDB('delete', queryList.alert_delete, [alert_num]);

        return result
    };





    /**
         *  내 정보 조회
         *  @param petId - 반려동물 코드 (Int)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.08.01. 최초작성
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
         *  중복 연락처 검사
         *  @author 
         *  @since 2023.07.12
         *  @history 2023.08.02 초기 작성
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
     *  중복 email 검사
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
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
         *  이메일 유무 확인 및 인증번호 전송
         *  @author 
         *  @since 2023.06.19
         *  @history 2023.06.19 초기 작성
         *  ================================================================
         */
    async sendEmail(params, context) {
        let result = {}

        //이메일 인증번호 전송
        let authNumber = ''
        for (let i = 0; i < 6; i++) {
            authNumber += Math.floor(Math.random() * 10);
        }
        let sendResult = await authEmailSend(params.eId, params.eDomain, authNumber, context);
        if (sendResult.status == 'Success') { // 이메일 전송 성공
            result["authNumber"] = authNumber;
            result["success"] = 1;
        } else { // 이메일 전송 실패
            result["success"] = 0;
        }

        return result;
    }

    /** ================================================================
     *  정보 변경
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
    async myInfoModify(list) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.inputList.p_user_name = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_user_name); // 이름
        list.inputList.p_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_first); // 휴대폰번호 앞자리
        list.inputList.p_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_middle); // 휴대폰번호 가운데자리
        list.inputList.p_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_phone_last); // 휴대폰번호 끝자리
        list.inputList.p_email_id = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_email_id); // 이메일 ID
        list.inputList.p_address_1 = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_address_1); // 주소
        list.inputList.p_address_2 = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.p_address_2); // 상세주소

        let accountArray = [list.inputList.p_user_name, list.inputList.p_account_pw, list.inputList.p_phone_first, list.inputList.p_phone_middle,
        list.inputList.p_phone_last, list.inputList.p_email_id, list.inputList.p_email_domain,
        list.inputList.p_address_1, list.inputList.p_address_2, list.p_userCode
        ];

        //계정 정보 등록
        let result = await mysqlDB('update', queryList.myInfoModify, accountArray);
        return result;
    };

}





module.exports = aMyPageService;