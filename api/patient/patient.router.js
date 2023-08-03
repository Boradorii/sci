const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./patient.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/patient/:h_adminCode', asyncErrHelper(ctrInstance.loadPatientPage));
// 환자 및 보호자 검색 
router.post('/searchPetInfo', asyncErrHelper(ctrInstance.searchPetInfo));
// 환자 및 보호자 정보 
router.post('/petInfoLoad', asyncErrHelper(ctrInstance.petInfoLoad));
// 환자 및 보호자 정보 수정
router.post('/petInfoModify', asyncErrHelper(ctrInstance.petInfoModify));
// 진료 내역 조회
router.post('/diagnosis_Records', asyncErrHelper(ctrInstance.diagnosis_Records));
// 진료 내용 조회
router.post('/diagnosis_detail', asyncErrHelper(ctrInstance.diagnosis_detail));
// 진료 내용 수정
router.post('/diagnosis_detail_modify', asyncErrHelper(ctrInstance.diagnosis_detail_modify));
// 진료 내용 삭제
router.post('/diagnosis_detail_delete', asyncErrHelper(ctrInstance.diagnosis_detail_delete));
// 진료 기록에서 진료의 목록 불러오기
router.post('/diagnosis_regist_doctorList', asyncErrHelper(ctrInstance.diagnosis_regist_doctorList));
// 진료 기록 등록하기
router.post('/diagnosis_regist', asyncErrHelper(ctrInstance.diagnosis_regist));
// 최근 생체정보 조회
router.post('/select_bioinfo', asyncErrHelper(ctrInstance.select_bioinfo));
// 차트 그리기
router.post('/draw_chart', asyncErrHelper(ctrInstance.draw_chart));

// 생체정보 세부내용 조회
router.post('/bioInfo_detail', asyncErrHelper(ctrInstance.bioInfo_detail));










module.exports = router;