const router = require('express').Router();

// async/await error handler
const asyncErrHelper = require('../../helper/asyncErrHelper');

// 호출할 controller 정의
const controller = require('./a_mypage.controller');
const ctrInstance = new controller();

//페이지 로드
router.get('/a_mypage/:p_userCode', asyncErrHelper(ctrInstance.loadMyPage));
// 내 정보 관리 페이지 로드
router.get('/myInfoPage', asyncErrHelper(ctrInstance.loadMyInfoPage));
// 우리 아이 관리 페이지 로드
router.get('/myPetPage', asyncErrHelper(ctrInstance.loadMyPetPage));
// 우리 아이 등록 페이지 로드
router.get('/myPetPage2', asyncErrHelper(ctrInstance.loadMyPetPage2));
// 우리 아이 수정 페이지 로드
router.get('/myPetPage3', asyncErrHelper(ctrInstance.loadMyPetPage3));
// 우리 아이 수정 페이지 데이터 가져오기
router.post('/loadModifyPageData', asyncErrHelper(ctrInstance.loadModifyPageData));
// 우리 아이 수정 기능
router.post('/modifyMyPet', asyncErrHelper(ctrInstance.modifyMyPet));


// 우리 아이 삭제하기 기능
router.post('/myPetDelete', asyncErrHelper(ctrInstance.myPetDelete));
// 우리 아이 등록하기
router.post('/insertPet', asyncErrHelper(ctrInstance.insertPet));
// 우리 아이 추가하기
router.post('/loadPetList', asyncErrHelper(ctrInstance.loadPetList));

// 대표 반려견 설정시 나머지 대표가 아닌것으로 설정
router.post('/setRepresent', asyncErrHelper(ctrInstance.setRepresent));





// 알림관리 페이지 로드
router.get('/noticePage/:p_userCode', asyncErrHelper(ctrInstance.loadNoticePage));
// 알림관리 페이지 데이터 로드
router.post('/alertDataLoad', asyncErrHelper(ctrInstance.alertDataLoad));
// 알림관리 푸쉬 설정
router.post('/alertPushSetting', asyncErrHelper(ctrInstance.alertPushSetting));
// 미확인 알림 확인 처리
router.post('/checkAlert', asyncErrHelper(ctrInstance.checkAlert));
// 알림관리 페이지에서 원격의료 클릭 시 답변 열람
router.post('/inquiry_answer', asyncErrHelper(ctrInstance.inquiry_answer));

// 비밀번호 확인
router.post('/aPwCheck', asyncErrHelper(ctrInstance.aPwCheck));

// 정보 조회
router.post('/myInfoLoad', asyncErrHelper(ctrInstance.myInfoLoad));

// 연락처 중복 검사
router.get('/phone', asyncErrHelper(ctrInstance.checkPhoneDuplicate));

// email 중복 검사
router.get('/email', asyncErrHelper(ctrInstance.checkEmailDuplicate));

// 정보 수정
router.post('/myInfoModify', asyncErrHelper(ctrInstance.myInfoModify));

// 알림 자동 삭제(일정 시간이 지난 후 알림내역 삭제)
router.post('/alert_delete_auto', asyncErrHelper(ctrInstance.alert_delete_auto));

// 알림 삭제 버튼 클릭하여 해당 알림 삭제
router.post('/alert_delete', asyncErrHelper(ctrInstance.alert_delete));

// 서비스 종료
router.post('/withdrawService', asyncErrHelper(ctrInstance.withdrawService));

router.get('/noticePage', asyncErrHelper(ctrInstance.loadNoticePage));
//페이지 로드


module.exports = router;