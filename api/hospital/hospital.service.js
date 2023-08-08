// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./hospital.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;




class hospitalService {

     /**
     *  비밀번호 확인
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. 최초작성
     *  
     */
 async pwCheck(h_user_code, pw) {
    let result = await mysqlDB('select', queryList.pwCheck, [pw, h_user_code])
    console.log(result);
    if(result.rows[0].h_user_code == h_user_code){
        result.state = true;
    }else{
        result.state = false;
    }
    console.log(result + "dkfos");

   return result
};

 /**
     *  병원 정보
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. 최초작성
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
     *  중복 연락처 검사
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
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
 *  중복 email 검사
 *  @author 
 *  @since 2023.07.12
 *  @history 2023.07.12 초기 작성
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
     *  병원정보 변경
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
    async hospitalInfoModify(list) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        list.inputList.h_user_name = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_name); // 담당자명
        list.inputList.h_user_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_first); // 담당자 휴대폰번호 앞자리
        list.inputList.h_user_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_middle); // 담당자 휴대폰번호 가운데자리
        list.inputList.h_user_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_phone_last); // 담당자 휴대폰번호 끝자리
        list.inputList.h_user_email_id = cryptoUtil.encrypt_aes(cryptoKey, list.inputList.h_user_email_id); // 담당자 이메일 ID

        let accountArray = [list.inputList.h_name, list.inputList.h_address2, list.inputList.h_telnum, list.inputList.h_operating_time,
            list.inputList.h_answer_time, list.inputList.h_user_account_pw, list.inputList.h_user_name,
            list.inputList.h_user_phone_first, list.inputList.h_user_phone_middle,
            list.inputList.h_user_phone_last, list.inputList.h_user_email_id, list.inputList.h_user_email_domain, list.h_adminCode
        ];
        
        console.log("비밀번호 수정 "+cryptoUtil.decrypt_aes(cryptoKey, list.inputList.h_user_account_pw));

        //계정 정보 등록
        let result = await mysqlDB('update', queryList.hospitalInfoModify, accountArray);
        return result;
    };

    /** ================================================================
     *  서비스 종료
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
    async withdrawService(h_adminCode) {
        let result = await mysqlDB('update', queryList.withdrawService, [h_adminCode]);
        console.log(result);
        return result;
    };


    /**
     *  병원 스태프 목록 조회
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. 최초작성
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
     *  직원 정보 조회
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. 최초작성
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
     *  중복 연락처 검사_직원
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
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
 *  중복 email 검사_직원
 *  @author 
 *  @since 2023.07.12
 *  @history 2023.07.12 초기 작성
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
     *  직원 등록
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
async insertStaff(list) {
    // 개인 정보 암호화
    let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
    cryptoKey = cryptoKey.row.key_string;
    list.staffList.h_staff_name = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_name); // 담당자명
    list.staffList.h_staff_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_first); // 담당자 휴대폰번호 앞자리
    list.staffList.h_staff_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_middle); // 담당자 휴대폰번호 가운데자리
    list.staffList.h_staff_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_last); // 담당자 휴대폰번호 끝자리
    list.staffList.h_staff_eid = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_eid); // 담당자 이메일 ID

    let accountArray = [list.h_adminCode, list.staffList.h_staff_name, list.staffList.h_staff_phone_first, 
        list.staffList.h_staff_phone_middle, list.staffList.h_staff_phone_last, list.staffList.h_staff_eid, 
        list.staffList.h_staff_edomain, list.staffList.h_staff_class, list.staffList.h_staff_note

    ];
    

    //계정 정보 등록
    let result = await mysqlDB('insert', queryList.insertStaff, accountArray);
    return result;
};

/** ================================================================
     *  직원 정보 변경
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
async updateStaff(list) {
    // 개인 정보 암호화
    let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
    cryptoKey = cryptoKey.row.key_string;
    list.staffList.h_staff_name = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_name); // 담당자명
    list.staffList.h_staff_phone_first = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_first); // 담당자 휴대폰번호 앞자리
    list.staffList.h_staff_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_middle); // 담당자 휴대폰번호 가운데자리
    list.staffList.h_staff_phone_last = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_phone_last); // 담당자 휴대폰번호 끝자리
    list.staffList.h_staff_eid = cryptoUtil.encrypt_aes(cryptoKey, list.staffList.h_staff_eid); // 담당자 이메일 ID

    let accountArray = [list.staffList.h_staff_name, list.staffList.h_staff_phone_first, 
        list.staffList.h_staff_phone_middle, list.staffList.h_staff_phone_last, list.staffList.h_staff_eid, 
        list.staffList.h_staff_edomain, list.staffList.h_staff_class, list.staffList.h_staff_note,
        list.h_staff_code
    ];

    // 사용자 정보 수정
    let result = await mysqlDB('update', queryList.updateStaff, accountArray);
    return result;
};

/** ================================================================
     *  사용자 삭제
     *  @author 
     *  @since 2023.07.12
     *  @history 2023.07.12 초기 작성
     *  ================================================================
     */
async deleteStaff(h_staff_code) {
    console.log("service    ");
    // 사용자 정보 삭제
    let result = await mysqlDB('delete', queryList.deleteStaff, [h_staff_code]);
    console.log("service    sql다음   " + result);
    return result;
};

}

module.exports = hospitalService;