const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./a_hospital.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/a_hospital/:p_userCode', asyncErrHelper(ctrInstance.loadHosPage));

// ------------------병원찾기------------------
//페이지 로드
router.get('/findHosPage', asyncErrHelper(ctrInstance.loadFindHosPage));
//병원이름 검색
router.get('/findHos', asyncErrHelper(ctrInstance.findHos));
//내병원 등록 or 취소
router.get('/checkmyHos', asyncErrHelper(ctrInstance.checkmyHos));
//지역별 병원 리스트 조회
router.get('/localHosList', asyncErrHelper(ctrInstance.localHosList));
//내병원 리스트 조회
router.get('/myHosList', asyncErrHelper(ctrInstance.myHosList));

// ------------------진료내역------------------
router.get('/treatListPage', asyncErrHelper(ctrInstance.loadTreatListPage));
router.get('/selectTreatData', asyncErrHelper(ctrInstance.selectTreatData))

// ------------------문의내역------------------
router.get('/loadInquiryListPage', asyncErrHelper(ctrInstance.loadInquiryListPage));
router.post('/selectInquiryData', asyncErrHelper(ctrInstance.selectInquiryData));




// ------------------병원상세정보------------------
//병원 상세정보 페이지 로드
router.get('/hosInfoPage', asyncErrHelper(ctrInstance.loadHosInfoPage));
//병원 상세정보에서 문의 전송
router.post('/sendInquiry', asyncErrHelper(ctrInstance.sendInquiry));
router.post('/sendAlertState', asyncErrHelper(ctrInstance.sendAlertState));
router.post('/check_hospital_alert', asyncErrHelper(ctrInstance.check_hospital_alert));






module.exports = router;