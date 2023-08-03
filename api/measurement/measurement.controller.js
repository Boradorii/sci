const _ = require('lodash');

// 호출할 service 정의
const service = require('./measurement.service');
const svInstance = new service();

class measurementController {
    async loadMeasurePage(req, res, next) {
        let h_adminCode = req.params.h_adminCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('web/measurement/measurement', {
            "measurementPage": req.__('measurementPage'),
            "h_adminCode": h_adminCode
        });
    };

}

module.exports = measurementController;