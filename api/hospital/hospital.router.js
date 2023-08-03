const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./hospital.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/hospital/:h_adminCode', asyncErrHelper(ctrInstance.selectHomeData));

// 비밀번호 확인
router.post('/pwCheck', asyncErrHelper(ctrInstance.pwCheck));

// 병원 정보 조회
router.post('/hospitalInfoLoad', asyncErrHelper(ctrInstance.hospitalInfoLoad));

// 연락처 중복 검사
router.get('/phone', asyncErrHelper(ctrInstance.checkPhoneDuplicate));

// email 중복 검사
router.get('/email', asyncErrHelper(ctrInstance.checkEmailDuplicate));

// 병원 정보 수정
router.post('/hospitalInfoModify', asyncErrHelper(ctrInstance.hospitalInfoModify));

// 서비스 종료
router.post('/withdrawService', asyncErrHelper(ctrInstance.withdrawService));

// 병원 스태프 목록 조회
router.post('/staffListLoad', asyncErrHelper(ctrInstance.staffListLoad));

// 직원 정보
router.post('/staffInfo', asyncErrHelper(ctrInstance.staffInfo));

// 직원 연락처 중복 검사
router.get('/staffPhone', asyncErrHelper(ctrInstance.checkStaffPhoneDuplicate));

// 직원 email 중복 검사
router.get('/staffEmail', asyncErrHelper(ctrInstance.checkStaffEmailDuplicate));

// 직원 등록
router.post('/insertStaff', asyncErrHelper(ctrInstance.insertStaff));

// 직원 수정
router.post('/updateStaff', asyncErrHelper(ctrInstance.updateStaff));

// 직원 삭제
router.post('/deleteStaff', asyncErrHelper(ctrInstance.deleteStaff));

module.exports = router;