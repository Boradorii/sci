const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./measurement.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/measure/:h_adminCode', asyncErrHelper(ctrInstance.loadMeasurePage));


// ------------------측정시작------------------
//환자검색
router.get('/measure/:h_adminCode', asyncErrHelper(ctrInstance.loadMeasurePage));


module.exports = router;