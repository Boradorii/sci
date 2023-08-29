const _ = require('lodash');

// 호출할 service 정의
const service = require('./a_mypage.service');
const svInstance = new service();

class aMyPageController {
    // 마이페이지 로드
    async loadMyPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_mypage/a_mypage_main', {
            "a_myPage": req.__('a_myPage'), // 디렉토리를 불러와서 다국어 언어 불러오기.
            "p_userCode": p_userCode
        });
    };
    // 내 정보 관리 페이지 로드
    async loadMyInfoPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_mypage/a_mypage_myInfo', {
            "a_myPage": req.__('a_myPage'),
            "p_userCode": p_userCode
        });
    };
    // 우리 아이 관리 페이지 로드
    async loadMyPetPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_mypage/a_mypage_myPet01', {
            "a_myPage": req.__('a_myPage'),
            "p_userCode": p_userCode
        });
    }
    // 알림 관리 페이지 로드
    async loadNoticePage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_mypage/a_mypage_notice01', {
            "a_myPage": req.__('a_myPage'),
            "p_userCode": p_userCode
        });
    }


    // 우리 아이 등록 페이지 로드
    async loadMyPetPage2(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_mypage/a_mypage_myPet02', {
            "a_myPage": req.__('a_myPage'),
            "p_userCode": p_userCode
        });
    }
    // 우리 아이 수정 페이지 로드
    async loadMyPetPage3(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let pet_id = req.query.pet_id;
        return res.render('app/a_mypage/a_mypage_myPet03', {
            "a_myPage": req.__('a_myPage'),
            "p_userCode": p_userCode,
            "petId": pet_id
        });
    }

    // 우리 아이 수정 페이지 데이터 로드
    async loadModifyPageData(req, res, next) {

        let petId = req.body.petId;

        let loadModifyPageData = await svInstance.loadModifyPageData(petId);

        return res.send(loadModifyPageData)
    };

    //  우리 아이 수정 기능
    async modifyMyPet(req, res, next) {

        let data = req.body;

        let modifyMyPet = await svInstance.modifyMyPet(data);

        return res.send(modifyMyPet)
    };


    // 우리 아이 수정 페이지 삭제 버튼 기능
    async myPetDelete(req, res, next) {

        let petId = req.body.petId;

        let myPetDelete = await svInstance.myPetDelete(petId);

        return res.send(myPetDelete)
    };



    // 우리 아이 등록
    async insertPet(req, res, next) {

        let data = req.body;
        let insertPet = await svInstance.insertPet(data);

        return res.send(insertPet)
    };
    // 우리 아이 리스트 출력
    async loadPetList(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let loadPetList = await svInstance.loadPetList(p_user_code);

        return res.send(loadPetList)
    };

    async setRepresent(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let petId = req.body.petId;

        let setRepresent = await svInstance.setRepresent(p_user_code, petId);

        return res.send(setRepresent)
    };


    //  알림 관리 페이지 데이터 로드
    async alertDataLoad(req, res, next) {

        let p_user_code = req.body.p_user_code;

        let alertDataLoad = await svInstance.alertDataLoad(p_user_code);

        return res.send(alertDataLoad)
    };

    //  알림 푸쉬 설정
    async alertPushSetting(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let isAllow = req.body.isAllow;
        let alertPushSetting = await svInstance.alertPushSetting(p_user_code, isAllow);

        return res.send(alertPushSetting)
    };

    async checkAlert(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let alert_created_time = req.body.alert_created_time;
        let checkAlert = await svInstance.checkAlert(p_user_code, alert_created_time);

        return res.send(checkAlert)
    };

    async inquiry_answer(req, res, next) {

        let inquiry_num = req.body.inquiry_num;
        let checkAlert = await svInstance.inquiry_answer(inquiry_num);

        return res.send(checkAlert)
    };


    async alert_delete_auto(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let alert_delete_auto = await svInstance.alert_delete_auto(p_user_code);

        return res.send(alert_delete_auto)
    };

    async alert_delete(req, res, next) {

        let alert_num = req.body.alert_num;
        let alert_delete = await svInstance.alert_delete(alert_num);

        return res.send(alert_delete)
    };

    //  비밀번호 확인
    async aPwCheck(req, res, next) {
        let p_userCode = req.body.p_userCode;
        let pw = req.body.pw;
        let aPwCheck = await svInstance.aPwCheck(p_userCode, pw);

        return res.send(aPwCheck)
    };

    //  내 정보
    async myInfoLoad(req, res, next) {
        let p_userCode = req.body.p_userCode;
        let myInfoLoad = await svInstance.myInfoLoad(p_userCode);

        return res.send(myInfoLoad)
    };

    // 중복 연락처 검사
    async checkPhoneDuplicate(req, res, next) {
        let phone1 = req.query.phone1;
        let phone2 = req.query.phone2;
        let phone3 = req.query.phone3;
        let p_userCode = req.query.p_userCode;

        let result = await svInstance.checkPhoneDuplicate(phone1, phone2, phone3, p_userCode);
        return res.json(result);
    }

    //중복 email 검사
    async checkEmailDuplicate(req, res, next) {
        let eIdString = req.query.eIdString,
            eDomainString = req.query.eDomainString;
        let p_userCode = req.query.p_userCode;

        let result = await svInstance.checkEmailDuplicate(eIdString, eDomainString, p_userCode);
        return res.json(result);
    }

    // 이메일 인증번호 전송
    async sendEmail(req, res, next) {
        let context = req.__('emailAuth');
        let params = req.body;
        let result = await svInstance.sendEmail(params, context);
        return res.send(result)
    }

    // 정보 수정
    async myInfoModify(req, res, next) {
        let list = req.body;

        let myInfoModify = await svInstance.myInfoModify(list);

        return res.send(myInfoModify);
    };

 //  서비스 종료
 async withdrawService(req, res, next) {
    let p_userCode = req.body.p_userCode;

    let withdrawService = await svInstance.withdrawService(p_userCode);

    return res.send(withdrawService);
};


}

module.exports = aMyPageController;