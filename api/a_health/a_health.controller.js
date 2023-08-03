const _ = require('lodash');

// 호출할 service 정의
const service = require('./a_health.service');
const svInstance = new service();

class aHealthController {
    async loadHealthPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_health/a_health_main', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode
        });
    };

    async loadpredictPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_health/a_health_predict01', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode
        });
    };

    async loadpredictresult(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_health/a_health_result01', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode
        });
    };

    async loadresultPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_health/a_health_result02', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode
        });
    }

    async loadSendPage(req, res, next) {
        let p_userCode = req.params.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/a_health/a_health_send', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode
        });
    }

}

module.exports = aHealthController;