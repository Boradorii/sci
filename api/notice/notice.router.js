const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./notice.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/notice/:h_adminCode', asyncErrHelper(ctrInstance.loadNoticePage));

// 미확인 알림 내역 조회
router.post('/noticeNList', asyncErrHelper(ctrInstance.noticeNList));

// 확인 알림 내역 조회
router.post('/noticeYList', asyncErrHelper(ctrInstance.noticeYList));

// 문진표 내용 조회
router.post('/inquiryList', asyncErrHelper(ctrInstance.inquiryList));

// 환자 및 보호자 검색
router.post('/searchInfo', asyncErrHelper(ctrInstance.searchInfo));

// 문진표 소견 등록
router.post('/inquiry_post', asyncErrHelper(ctrInstance.inquiry_post));



module.exports = router;