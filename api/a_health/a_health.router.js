const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./a_health.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/a_health/:p_userCode', asyncErrHelper(ctrInstance.loadHealthPage));

router.get('/predictPage', asyncErrHelper(ctrInstance.loadpredictPage));

router.get('/predictResult', asyncErrHelper(ctrInstance.loadpredictresult));

router.get('/resultPage', asyncErrHelper(ctrInstance.loadresultPage));

router.get('/selectResult', asyncErrHelper(ctrInstance.selectResult));

router.get('/sendPage', asyncErrHelper(ctrInstance.loadSendPage));
//페이지 로드


module.exports = router;