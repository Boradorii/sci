// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_hospital.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;



class aHosService {
    //동물병원 페이지(a_hospital_main) 호출 시 최근 방문한 동물병원 목록 조회
    async visitHos(p_userCode) {
        let visitHos = await mysqlDB('select', queryList.visitHos, [p_userCode]);
        return visitHos
    }


    //병원찾기 페이지 초기 로드 시 내병원 목록 조회
    async myHos(p_userCode) {
        let myHos = await mysqlDB('select', queryList.myHos, [p_userCode]);
        let result = [];
        for (let i = 0; i < myHos.rowLength; i++) {
            result.push(myHos.rows[i].h_user_code)
        }
        return result
    };
    //병원 이름 검색
    async findHos(p_userCode, hosSearch) {
        let result = await mysqlDB('select', queryList.findHos, ["%" + hosSearch + "%", "%" + hosSearch + "%"]);
        return result
    };

    //내병원 등록 or 삭제
    async checkmyHos(p_userCode, h_userCode, myHosCheck) {
        let result
        if (myHosCheck == "uncheck") {
            result = await mysqlDB('delete', queryList.deleteMyHos, [p_userCode, h_userCode])
        } else {
            result = await mysqlDB('inseret', queryList.insertMyHos, [p_userCode, h_userCode])
        }
        return result
    };

    //지역별 병원 조회
    async localHosList(local) {
        let result = await mysqlDB('select', queryList.localHosList, [local + "%"])
        return result
    };

    //내병원 목록 조회
    async myHosList(p_userCode) {
        let result = await mysqlDB('select', queryList.myHosList, [p_userCode]);
        return result
    };

    //병원 상세정보 조회
    async hInfo(h_userCode) {
        let result = await mysqlDB('select', queryList.hInfo, [h_userCode])
        return result
    };

    //내 반려동물 조회
    async myPet(p_userCode) {
        let result = await mysqlDB('select', queryList.myPet, [p_userCode])
        return result
    };

    //병원 상세정보 페이지에서 문의 등록
    async sendInquiry(data) {
        let answer = JSON.stringify(data.answer),
            result;
        if (data.symptom == '') {
            result = await mysqlDB('insert', queryList.sendInquiry, [data.pet_id, data.title, data.h_userCode, answer, null, data.p_userCode])
        } else {
            result = await mysqlDB('insert', queryList.sendInquiry, [data.pet_id, data.title, data.h_userCode, answer, data.symptom, data.p_userCode])
        }
        return result
    }

    //기간별 진료내역 조회
    async selectTreatData(p_userCode, startDate, endDate) {
        let result = await mysqlDB('select', queryList.selectTreatData, [p_userCode, startDate + " 00:00:00", endDate + " 23:59:59"])
        return result
    }


    // 병원별, 환자별 미확인 알림 수 db에 업데이트
    async sendAlertState() {
        // 알림리스트에 존재하는 병원 체크
        let hospital_alert_check = await mysqlDB('select', queryList.hospital_alert_check, [])
        // 알림리스트에 존재하는 환자 체크(존재하지 않은 환자는 미확인 알림수를 0으로 기본값을 준다.)
        let p_alert_check = await mysqlDB('select', queryList.p_alert_check, [])

        let count_hosAlert;
        let count_p_alert;
        // 병원 미확인 알람 수 체크!
        for (let i = 0; i < hospital_alert_check.rowLength; i++) {
            console.log(hospital_alert_check.rows[i].h_user_code);
            // 병원별 미확인 알림 수 체크
            count_hosAlert = await mysqlDB('select', queryList.count_hosAlert, [hospital_alert_check.rows[i].h_user_code]);
            // 병원별 미확인 알림 수 업데이트
            await mysqlDB('update', queryList.count_total_hosAlert, [count_hosAlert.rows[0]['count(*)'], hospital_alert_check.rows[i].h_user_code]);
        }
        for (let i = 0; i < p_alert_check.rowLength; i++) {
            // 환자별 미확인 알림 수 체크
            count_p_alert = await mysqlDB('select', queryList.count_p_alert, [p_alert_check.rows[i].p_user_code]);
            // 환자별 미확인 알림 수 업데이트
            await mysqlDB('update', queryList.count_total_p_Alert, [count_p_alert.rows[0]['count(*)'], p_alert_check.rows[i].p_user_code]);
        }


        return hospital_alert_check
    }

    async check_hospital_alert(h_user_code) {

        let result = await mysqlDB('select', queryList.check_hospital_alert, [h_user_code])
        return result
    }

    // 문의내역 조회
    async selectInquiryData(p_userCode, startDate, endDate) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let result = await mysqlDB('select', queryList.selectInquiryData, [p_userCode, startDate, endDate])
        for (let i = 0; i < result.rowLength; i++) {
            result.rows[i].h_user_name = cryptoUtil.decrypt_aes(cryptoKey, result.rows[i].h_user_name)
        }
        console.log(result);
        return result
    }




}

module.exports = aHosService;