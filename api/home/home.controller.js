const _ = require('lodash');

// 호출할 service 정의
const service = require('./home.service');
const svInstance = new service();

class HomeController {
    async selectHomeData(req, res, next) {
        let userCode = req.params.userCode; // url에 data 포함하여 전송한 경우 값 가져오기

        return res.render('app/home/home', {
            "homePage": req.__('homePage'),
            "userCode": userCode, // 유저 코드 정보
            "lang": req.query.lang, // 페이지 언어 정보
            "accessToken": req.query.accessToken, // jwt accessToken 정보
        });
    };

    async getData(req, res, next) {
        let { userCode, selectDay } = req.body;
        let result = await svInstance.getData(userCode, selectDay);
        return res.json(result);
    };

}

module.exports = HomeController;