const _ = require('lodash');

// 호출할 service 정의
const service = require('./hospital.service');
const svInstance = new service();

class hospitalController {
    async selectHomeData(req, res, next) {
        let h_adminCode = req.params.h_adminCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('web/hospital/hospital', {
            "hospitalPage": req.__('hospitalPage'),
            "h_adminCode": h_adminCode
        });
    };
    
    //  비밀번호 확인
    async pwCheck(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let pw = req.body.pw;
        let pwCheck = await svInstance.pwCheck(h_user_code, pw);

        return res.send(pwCheck)
    };

    //  병원 정보
    async hospitalInfoLoad(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let hospitalInfoLoad = await svInstance.hospitalInfoLoad(h_user_code);

        return res.send(hospitalInfoLoad)
    };

    // 중복 연락처 검사_병원
    async checkPhoneDuplicate(req, res, next) {
        let phone1 = req.query.phone1;
        let phone2 = req.query.phone2;
        let phone3 = req.query.phone3;
        let h_adminCode = req.query.h_adminCode;

        let result = await svInstance.checkPhoneDuplicate(phone1, phone2, phone3, h_adminCode);
        return res.json(result);
    }

    //중복 email 검사_병원
    async checkEmailDuplicate(req, res, next) {
        let eIdString = req.query.eIdString,
            eDomainString = req.query.eDomainString;
        let h_adminCode = req.query.h_adminCode;

        let result = await svInstance.checkEmailDuplicate(eIdString, eDomainString, h_adminCode);
        return res.json(result);
    }

   // 이메일 인증번호 전송
    async sendEmail(req, res, next) {
        let context = req.__('emailAuth');
        let params = req.body;
        let result = await svInstance.sendEmail(params, context);
        return res.send(result)
    }

    //  환자 및 보호자 정보 수정
    async withdrawService(req, res, next) {
        let h_adminCode = req.body.h_adminCode;
    
        let withdrawService = await svInstance.withdrawService(h_adminCode);

        return res.send(withdrawService);
    };

    //  서비스 종료
    async hospitalInfoModify(req, res, next) {
        let data = req.body;
    
        let hospitalInfoModify = await svInstance.hospitalInfoModify(data);

        return res.send(hospitalInfoModify);
    };

    //  병원 스태프 목록 조회
    async staffListLoad(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let staffListLoad = await svInstance.staffListLoad(h_user_code);

        return res.send(staffListLoad)
    };

    //  직원 정보
    async staffInfo(req, res, next) {
        let h_staff_code = req.body.h_staff_code;
        let staffInfo = await svInstance.staffInfo(h_staff_code);

        return res.send(staffInfo)
    };

        // 중복 연락처 검사_직원
        async checkStaffPhoneDuplicate(req, res, next) {
            let phone1 = req.query.phone1;
            let phone2 = req.query.phone2;
            let phone3 = req.query.phone3;
            let h_staff_code = req.query.h_staff_code;
    
            let result = await svInstance.checkStaffPhoneDuplicate(phone1, phone2, phone3, h_staff_code);
            return res.json(result);
        }

        //중복 email 검사_직원
        async checkStaffEmailDuplicate(req, res, next) {
            let eIdString = req.query.eIdString,
                eDomainString = req.query.eDomainString;
            let h_staff_code = req.query.h_staff_code;
    
            let result = await svInstance.checkStaffEmailDuplicate(eIdString, eDomainString, h_staff_code);
            return res.json(result);
        }

        //  직원 등록
        async insertStaff(req, res, next) {
            let data = req.body;
        
            let insertStaff = await svInstance.insertStaff(data);

            return res.send(insertStaff);
        };

        //  직원 정보 수정
        async updateStaff(req, res, next) {
            let data = req.body;

            let updateStaff = await svInstance.updateStaff(data);

            return res.send(updateStaff);
        };

         //  직원 정보 삭제
         async deleteStaff(req, res, next) {
            let h_staff_code = req.body.h_staff_code;
            let deleteStaff = await svInstance.deleteStaff(h_staff_code);

            return res.send(deleteStaff);
        };
}

module.exports = hospitalController;