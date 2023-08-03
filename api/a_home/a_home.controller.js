const _ = require('lodash');

// 호출할 service 정의
const service = require('./a_home.service');
const svInstance = new service();

class aHomeController {
    async selectaHomeData(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_home/a_home', {
            "homePage": req.__('homePage'),
            "p_userCode": p_userCode
        });
    };


    async selectPetInfo(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let selectPetInfo = await svInstance.selectPetInfo(p_user_code);

        return res.send(selectPetInfo)
    };
    async selectTodayList(req, res, next) {

        let p_user_code = req.body.p_user_code;
        let selectTodayList = await svInstance.selectTodayList(p_user_code);

        return res.send(selectTodayList)
    };

    async alert_icon(req, res, next) {

        let p_user_code = req.body.p_userCode;
        let alert_icon = await svInstance.alert_icon(p_user_code);

        return res.send(alert_icon)
    };



}


module.exports = aHomeController;