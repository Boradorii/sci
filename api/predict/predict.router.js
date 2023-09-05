const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./predict.controller');
const ctrInstance = new controller();


router.post('/predict', asyncErrHelper(ctrInstance.predict))

router.post('/insert_measurement_result', asyncErrHelper(ctrInstance.insert_measurement_result))


// 예측 결과 조회
router.post('/select_measurement_result', asyncErrHelper(ctrInstance.select_measurement_result));


module.exports = router;