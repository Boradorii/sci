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
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let myPet = await svInstance.myPet(p_userCode);
        return res.render('app/a_health/a_health_predict', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode,
            "myPet": JSON.stringify(myPet)
        });
    };

    async loadpredictresult(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let time = req.query.time,
            pet_id = req.query.pet_id;
        let selectRes = await svInstance.selectResultOne(pet_id, time);
        let myHosList = await svInstance.myHosList(p_userCode)
        console.log(myHosList)
        return res.render('app/a_health/a_health_result01', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode,
            "selectRes": JSON.stringify(selectRes),
            "myHosList": JSON.stringify(myHosList)
        });
    };

    async loadresultPage(req, res, next) {
        let p_userCode = req.query.p_userCode; // url에 data 포함하여 전송한 경우 값 가져오기
        let firstPet = await svInstance.firstPet(p_userCode);
        let myPet = await svInstance.myPet(p_userCode);
        return res.render('app/a_health/a_health_result02', {
            "healthPage": req.__('healthPage'),
            "p_userCode": p_userCode,
            "firstPet": firstPet,
            "myPet": JSON.stringify(myPet)
        });
    };
    async selectResult(req, res, next) {
        let { pet_id, startDate, endDate, tabType } = req.query
        let selectRes = await svInstance.selectResult(pet_id, startDate, endDate, tabType);
        return res.json(selectRes)
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