/** =============================================
 * 초기 화면 router(회원가입, 로그인, 정보수정 관리)
 * @since 2023.05.31
 * @history 2023.05.31. JMY 초기작성
 * ==============================================
 */

const router = require('express').Router();
const asyncErrHelper = require('../../helper/asyncErrHelper') //errorhandler

const controller = require('./index.controller');
const ctrInstance = new controller()

router.get('/', asyncErrHelper(ctrInstance.loadIndexPage));

module.exports = router