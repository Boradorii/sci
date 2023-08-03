const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./a_home.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/a_home/:p_userCode', asyncErrHelper(ctrInstance.selectaHomeData));
router.post('/selectPetInfo', asyncErrHelper(ctrInstance.selectPetInfo));
router.post('/selectTodayList', asyncErrHelper(ctrInstance.selectTodayList));

// 
router.post('/alert_icon', asyncErrHelper(ctrInstance.alert_icon));





module.exports = router;