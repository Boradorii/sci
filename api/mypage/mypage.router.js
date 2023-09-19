const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./mypage.controller');
const ctrInstance = new controller();

//페이지 로드

// 회원정보 수정 페이지 2023.02.21 =============================
router.get('/userinfo/:userCode', asyncErrHelper(ctrInstance.userInfoShowPage));

router.get('/mypage/:userCode', asyncErrHelper(ctrInstance.selectMypageData));

router.post('/deleteUser', asyncErrHelper(ctrInstance.deleteUser));

router.post('/updateUserInfo', asyncErrHelper(ctrInstance.updateUserInfo));

router.post('/duplicatePhone', asyncErrHelper(ctrInstance.duplicatePhone));

router.get('/announcement/:userCode', asyncErrHelper(ctrInstance.announcementPage))

module.exports = router;