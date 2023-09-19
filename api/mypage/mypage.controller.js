const _ = require('lodash');

// 호출할 service 정의
const service = require('./mypage.service');
const svInstance = new service();

class MypageController {
    async selectMypageData(req, res, next) {
        let { userCode } = req.params // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/mypage/mypage', {
            "myPage": req.__('myPage'),
            "userCode": userCode, // 유저 코드 정보 추가 2021.04.21 JG,
            "lang": req.query.lang, // 페이지 언어 정보 추가 2021.04.22 JG,
            "accessToken": req.query.accessToken // jwt accessToken 정보 추가 2021.04.22 JG
        });
    };

    async announcementPage(req, res, next) {
        let { userCode } = req.params // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/mypage/announcement', {
            "announcePage": req.__('announcePage'),
            "userCode": userCode, // 유저 코드 정보 추가 2021.04.21 JG,
            "lang": req.query.lang, // 페이지 언어 정보 추가 2021.04.22 JG,
            "accessToken": req.query.accessToken // jwt accessToken 정보 추가 2021.04.22 JG
        });
    };

    // 회원정보 수정 페이지 이동 2023.02.21
    async userInfoShowPage(req, res, next) {
        let { userCode } = req.params // url에 data 포함하여 전송한 경우 값 가져오기
        let userInfo = await svInstance.getUserInfo(userCode);
        return res.render('app/mypage/user_modify', {
            "modifyPage": req.__('modifyPage'),
            "userCode": userCode, // 유저 코드 정보 추가 2021.04.21 JG,
            "userInfo": JSON.stringify(userInfo),
            "lang": req.query.lang, // 페이지 언어 정보 추가 2021.04.22 JG,
            "accessToken": req.query.accessToken // jwt accessToken 정보 추가 2021.04.22 JG
        });
    }

    async deleteUser(req, res, next) {
        let { userCode } = req.body;
        let deleteUser = await svInstance.deleteUser(userCode);
        return res.send(deleteUser)
    }
    
    async updateUserInfo(req, res, next) {
        let { userCode, nameInput, PWInput, PWConfirmInput, phone1Input, phone2Input, phone3Input} = req.body;
        let updateUserInfo = await svInstance.updateUserInfo(userCode, nameInput, PWInput, PWConfirmInput, phone1Input, phone2Input, phone3Input);
        return res.send(updateUserInfo)
    }
    
    async duplicatePhone(req, res, next) {
        let { userCode, phone1Input, phone2Input, phone3Input} = req.body;
        let duplicatePhone = await svInstance.duplicatePhone(userCode, phone1Input, phone2Input, phone3Input);
        return res.send(duplicatePhone)
    }
    
    async selectData(req, res, next) {
        let announcement = await svInstance.showAnnouncement();

        return res.json({
            "announcement": announcement
        });
    };
}

module.exports = MypageController;