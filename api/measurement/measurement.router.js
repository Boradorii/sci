const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./measurement.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/measure/:h_adminCode', asyncErrHelper(ctrInstance.loadMeasurePage));


// ------------------측정시작------------------
// 환자 및 보호자 검색 
router.post('/searchPetInfo', asyncErrHelper(ctrInstance.searchPetInfo));
// 환자 및 보호자 정보 
router.post('/petInfoLoad', asyncErrHelper(ctrInstance.petInfoLoad));


module.exports = router;