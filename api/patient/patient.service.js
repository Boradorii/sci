// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./patient.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;






class patientService {


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
    /**
     *  환자 및 보호자 정보 수정
     *  @param petId - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.06. 최초작성
     *  
     */
    async petInfoModify(petId, pet_isNeutering, pet_weight, piN, pW, pN) {
        pet_weight = parseFloat(pet_weight);
        pW = parseFloat(pW);
        let result;
        if (piN != pet_isNeutering || pW != pet_weight) {
            result = await mysqlDB('update', queryList.petInfoModify, [pet_isNeutering, pet_weight, petId])
        } else {
            result = "F";
        }

        return result
    };

    /**
     *  진료 내역 조회
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.06.20. 최초작성
     *  
     */
    async diagnosis_Records(h_adminCode, startDate, endDate, name, petId) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        endDate = endDate + " 23:59:59";
        let result;
        // name 값으로 아무것도 들어오지않으면 total로 들어와져서 전체조회 처리.
        if (name == "total") {
            result = await mysqlDB('select', queryList.diagnosis_Records_total, [h_adminCode, petId, startDate, endDate])

        } else {
            name = cryptoUtil.encrypt_aes(cryptoKey, name);
            result = await mysqlDB('select', queryList.diagnosis_Records, [h_adminCode, petId, name, startDate, endDate])

        };
        for (let i = 0; i < result.rowLength; i++) {
            // 진료의 불러오기
            let docName = await mysqlDB('select', queryList.diagnosis_detail_doctorName, [result.rows[i].medi_num]);
            result.rows[i].doctorName = cryptoUtil.decrypt_aes(cryptoKey, docName.rows[0].h_staff_name);
            // 진료 날짜 day까지만 나오도록 수정
            result.rows[i].medi_created_time = result.rows[i].medi_created_time.slice(0, 10);
            // 방문목적 처리
            if (result.rows[i].medi_purpose == 0) {
                result.rows[i].medi_purpose = "치료"
            } else if (result.rows[i].medi_purpose == 1) {
                result.rows[i].medi_purpose = "접종"
            } else if (result.rows[i].medi_purpose == 2) {
                result.rows[i].medi_purpose = "건강검진"
            } else if (result.rows[i].medi_purpose == 3) {
                result.rows[i].medi_purpose = "수술"
            } else {
                result.rows[i].medi_purpose = "기타"

            }
        };
        return result
    };

    /**
     *  진료 내역칸에 있는 진료 기록 모달 내의 진료의 목록 불러오기
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.05. 최초작성
     *  
     */
    async diagnosis_regist_doctorList(h_user_code) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.diagnosis_regist_doctorList, [h_user_code])
        for (let i = 0; i < result.rowLength; i++) {
            // 진료의 불러오기
            result.rows[i].h_staff_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_name);
            result.rows[i].h_staff_eid = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_staff_eid);
        }
        return result
    };

    /**
     *  진료 내역의 진료 기록 등록하기
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.05. 최초작성
     *  
     */
    async diagnosis_regist(data) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let h_user_code = data.h_user_code,
            medi_purpose = data.medi_purpose,
            medi_contents = data.medi_contents,
            h_staff_name = data.h_staff_name,
            petId = data.petId;
        let name = h_staff_name.replace(/\s*\([^)]*\)/, '');
        name = cryptoUtil.encrypt_aes(cryptoKey, name);
        let staffName = name.trim();
        let email = h_staff_name.match(/\(([^)]+)\)/)[1];
        email = cryptoUtil.encrypt_aes(cryptoKey, email);
        let find_h_staff_code = await mysqlDB('select', queryList.find_h_staff_code, [h_user_code, staffName, email])
        let h_staff_code = find_h_staff_code.rows[0].h_staff_code;
        let p_user_code = await mysqlDB('select', queryList.find_p_user_code, [petId])
        p_user_code = p_user_code.rows[0].p_user_code;
        let result = await mysqlDB('insert', queryList.diagnosis_regist, [medi_purpose, medi_contents, petId, h_user_code, h_staff_code, p_user_code])
        if (result.succ == 1) {
            await mysqlDB('insert', queryList.diagnosis_regist_alert, [p_user_code, petId])
        }

        return result
    };



    /**
     *  진료 내용(세부내용) 조회
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.04. 최초작성
     *  
     */
    async diagnosis_detail(medi_num) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.diagnosis_detail, [medi_num])
        result.rows[0].medi_created_time = result.rows[0].medi_created_time.slice(0, 10);
        let docName = await mysqlDB('select', queryList.diagnosis_doctorName, [result.rows[0].h_user_code, result.rows[0].h_staff_code])
        result.rows[0].doctorName = cryptoUtil.decrypt_aes(cryptoKey, docName.rows[0].h_staff_name);
        return result
    };

    /**
     *  진료 내용(세부내용) 수정
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.04. 최초작성
     *  
     */
    async diagnosis_detail_modify(date, medi_num, purpose, contents) {
        let subDate = await mysqlDB('select', queryList.subDate, [medi_num])
        subDate = subDate.rows[0].medi_created_time.slice(10, 19);
        date = date + subDate;
        let result = await mysqlDB('update', queryList.diagnosis_detail_modify, [date, purpose, contents, medi_num])
        return result
    };

    /**
     *  진료 내역 삭제
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.04. 최초작성
     *  
     */
    async diagnosis_detail_delete(medi_num) {
        let result = await mysqlDB('delete', queryList.diagnosis_detail_delete, [medi_num])
        return result
    };


    /**
     *  최근 생체정보 조회
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.06. 최초작성
     *  
     */
    async select_bioinfo(data) {
        let petId = data.petId,
            startDate = data.startDate,
            endDate = data.endDate + " 23:59:59";
        let result = await mysqlDB('select', queryList.select_bioinfo, [petId, startDate, endDate])
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].created_time = result.rows[i].created_time.slice(0, 10);
        }

        return result
    };
    /**
     *  최근 생체정보 차트 그리기
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.06. 최초작성
     *  
     */
    async draw_chart(data) {
        let petId = data.petId,
            startDate = data.startDate,
            endDate = data.endDate + " 23:59:59";
        let result = await mysqlDB('select', queryList.draw_chart, [petId, startDate, endDate])
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].created_time = result.rows[i].created_time.slice(0, 10);
        }

        return result
    };


    /**
     *  생체정보 세부내용 조회
     *  @param  - 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.06. 최초작성
     *  
     */
    async bioInfo_detail(pd_num) {
        let result = await mysqlDB('select', queryList.bioInfo_detail, [pd_num])
        return result
    };







}

module.exports = patientService;