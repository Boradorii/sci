const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./result.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/result/:userCode', asyncErrHelper(ctrInstance.selectResultData));

// 건강 현황 - 기간별 생체 정보 조회
router.post('/data', asyncErrHelper(ctrInstance.getHealthIndex));

module.exports = router;