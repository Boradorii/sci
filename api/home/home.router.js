const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./home.controller');
const ctrInstance = new controller();

// 페이지 로드
router.get('/home/:userCode', asyncErrHelper(ctrInstance.selectHomeData));

// 데이터 로드
router.post('/data', asyncErrHelper(ctrInstance.getData));


module.exports = router;