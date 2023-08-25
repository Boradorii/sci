const _ = require('lodash');

// 호출할 service 정의
const service = require('./a_hospital.service');
const svInstance = new service();

class aHosController {
    async loadHosPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let visitHos = await svInstance.visitHos(p_userCode);
        return res.render('app/a_hospital/a_hospital_main', {
            "a_hospitalPage": req.__('a_hospitalPage'),
            "p_userCode": p_userCode,
            "visitHos": JSON.stringify(visitHos)
        });
    };

    // ------------------병원찾기------------------
    // 페이지로드
    async loadFindHosPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let myHos = await svInstance.myHos(p_userCode);

        return res.render('app/a_hospital/a_hospital_find', {
            "a_hospitalPage": req.__('a_hospitalPage'),
            "p_userCode": p_userCode,
            "myHos": JSON.stringify(myHos)
        });
    };
    //검색창에서 병원 조회
    async findHos(req, res, next) {
        let { p_userCode, hosSearch } = req.query
        let result = {}
        let findHos = await svInstance.findHos(p_userCode, hosSearch);
        let myHos = await svInstance.myHos(p_userCode);
        result['findHos'] = findHos;
        result['myHos'] = myHos;
        return res.json(result)
    };
    //내 병원 등록 or삭제
    async checkmyHos(req, res, next) {
        let { p_userCode, h_userCode, myHosCheck } = req.query;
        let result = await svInstance.checkmyHos(p_userCode, h_userCode, myHosCheck)
        return res.json(result)
    };
    //지역별 병원목록 조회
    async localHosList(req, res, next) {
        let { p_userCode, local } = req.query;
        let result = {}
        let localHosList = await svInstance.localHosList(local);
        let myHos = await svInstance.myHos(p_userCode);
        result['localHosList'] = localHosList;
        result['myHos'] = myHos;
        return res.json(result)

    };
    //내 병원 목록 조회
    async myHosList(req, res, next) {
        let { p_userCode } = req.query
        let result = await svInstance.myHosList(p_userCode)
        return res.json(result)
    };



    // ------------------병원상세정보------------------
    //병원 상세정보 페이지 로드(최근 방문병원 클릭 or 병원찾기 병원 클릭)
    async loadHosInfoPage(req, res, next) {
        let { p_userCode, h_userCode } = req.query;
        let hInfo = await svInstance.hInfo(h_userCode);
        let myHos = await svInstance.myHos(p_userCode);
        let myPet = await svInstance.myPet(p_userCode);
        return res.render('app/a_hospital/a_hospital_hosinfo', {
            "a_hospitalPage": req.__('a_hospitalPage'),
            "p_userCode": p_userCode,
            "h_userCode": h_userCode,
            "myHos": JSON.stringify(myHos),
            "hInfo": JSON.stringify(hInfo),
            "myPet": JSON.stringify(myPet)
        })
    }

    //병원 상세정보 페이지에서 문의 등록
    async sendInquiry(req, res, next) {
        let result = await svInstance.sendInquiry(req.body)

        return res.json(result);
    }


    // ------------------진료내역------------------
    // 진료내역 페이지 로드
    async loadTreatListPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_hospital/a_hospital_treat', {
            "a_hospitalPage": req.__('a_hospitalPage'),
            "p_userCode": p_userCode
        });
    };
    //기간별 진료내역 조회
    async selectTreatData(req, res, next) {
        let { p_userCode, startDate, endDate } = req.query
        let result = await svInstance.selectTreatData(p_userCode, startDate, endDate)
        return res.json(result)
    }

    // -----------------문의내역-------------------
    // 문의내역 페이지 로드
    async loadInquiryListPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_hospital/a_hospital_inquiry', {
            "a_hospitalPage": req.__('a_hospitalPage'),
            "p_userCode": p_userCode
        });
    };

    async selectInquiryData(req, res, next) {
        let { p_userCode, startDate, endDate } = req.body
        let result = await svInstance.selectInquiryData(p_userCode, startDate, endDate)
        return res.json(result)
    }




    // 병원 미확인 알림 카운팅

    async sendAlertState(req, res, next) {

        let result = await svInstance.sendAlertState()
        return res.json(result)
    }
    async check_hospital_alert(req, res, next) {
        let h_user_code = req.body.h_user_code;
        let result = await svInstance.check_hospital_alert(h_user_code)
        return res.json(result)
    }




}

module.exports = aHosController;