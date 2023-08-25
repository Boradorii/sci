/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 router
 *  @author JMY
 *  @since 2023.06.20
 *  @history  2023.06.20 JMY 최초작성
 *  ================================================================
 */

const router = require('express').Router();

const asyncErrHelper = require('../../helper/asyncErrHelper'); // async/await error handler

// 호출할 controller 정의
const controller = require('./user.controller');
const ctrInstance = new controller();


//로그인페이지 호출
router.get('/', asyncErrHelper(ctrInstance.loadIndexPage));

//회원가입 페이지 호출(웹)
router.get('/signUp', asyncErrHelper(ctrInstance.loadSignupPage));

//ID찾기 페이지 호출
router.get('/findUserId', asyncErrHelper(ctrInstance.loadFindIdPage));

//비밀번호 찾기 페이지 호출
router.get('/findUserPw', asyncErrHelper(ctrInstance.loadFindPwPage));


//로그인 버튼 클릭
router.post('/adminlogin', asyncErrHelper(ctrInstance.adminlogin));


// SY

// jwt token 검증
router.post('/token', asyncErrHelper(ctrInstance.validateJwtToken));

// 로그인
router.post('/userLogin', asyncErrHelper(ctrInstance.userLogin));

// 로그아웃
router.post('/userLogout', asyncErrHelper(ctrInstance.userLogout));

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

// 병원 검색
router.post('/searchHospital', asyncErrHelper(ctrInstance.searchHospital));

// 병원 정보 조회
router.post('/hospitalInfo', asyncErrHelper(ctrInstance.hospitalInfo));

// 이메일 인증번호 전송
router.post('/sendEmail', asyncErrHelper(ctrInstance.sendEmail));


//테스트용
router.get('/encrypttest', asyncErrHelper(ctrInstance.encryptTest)); //암호화 테스트
router.get('/decrypttest', asyncErrHelper(ctrInstance.decryptTest)); //복호화 테스트

module.exports = router;