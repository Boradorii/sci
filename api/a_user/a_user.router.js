/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 router
 *  @author JG, Jo
 *  @since 2021.04.12
 *  @history 2021.04.19 JG 로그인 기능 추가(jwt)
 *           2021.05.26 JG 중복 검사, 회원정보 조회, 회원 탈퇴 관련 기능 추가
 *  ================================================================
 */

const router = require('express').Router();

const asyncErrHelper = require('../../helper/asyncErrHelper'); // async/await error handler

// 호출할 controller 정의
const controller = require('./a_user.controller');
const ctrInstance = new controller();

//로그인페이지 호출
router.get('/', asyncErrHelper(ctrInstance.loadIndexPage));

//회원가입 페이지 호출(웹)
router.get('/signUp', asyncErrHelper(ctrInstance.loadSignupPage));

//ID찾기 페이지 호출
router.get('/findUserId', asyncErrHelper(ctrInstance.loadFindIdPage));

//비밀번호 찾기 페이지 호출
router.get('/findUserPw', asyncErrHelper(ctrInstance.loadFindPwPage));


// 앱로그인 2021.10.08
router.post('/applogin', asyncErrHelper(ctrInstance.userAppLogin));

// 로그아웃 2021.05.26
router.post('/logout', asyncErrHelper(ctrInstance.userLogout));

// 회원탈퇴 2021.05.26
router.post('/withdrawal', asyncErrHelper(ctrInstance.withdrawalUser));



// jwt token 검증 2021.04.19
router.post('/token', asyncErrHelper(ctrInstance.validateJwtToken));



// SY

// 로그인
router.post('/userLogin', asyncErrHelper(ctrInstance.userLogin));

// ID 찾기
router.get('/find/account', asyncErrHelper(ctrInstance.findUserId));

// PW 찾기_사용자 여부 확인
router.post('/findUser', asyncErrHelper(ctrInstance.findUser));

// PW 변경
router.post('/modify/password', asyncErrHelper(ctrInstance.modifyUserPassword));

// 회원가입
router.post('/signup', asyncErrHelper(ctrInstance.createAdminUser));

// ID 중복 검사
router.get('/duplicate/id', asyncErrHelper(ctrInstance.checkIdDuplicate));

// 연락처 중복 검사
router.get('/duplicate/phone', asyncErrHelper(ctrInstance.checkPhoneDuplicate));

// email 중복 검사
router.get('/duplicate/email', asyncErrHelper(ctrInstance.checkEmailDuplicate));

// 이메일 인증번호 전송
router.post('/sendEmail', asyncErrHelper(ctrInstance.sendEmail));

// 앱 토큰 업데이트
router.post('/alertToken', asyncErrHelper(ctrInstance.updateAlertToken));





module.exports = router;