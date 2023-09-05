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

    //  환자 및 보호자 정보 검색
    async searchPetInfo(req, res, next) {
        let h_adminCode = req.body.h_adminCode;
        let select = req.body.select;
        let name = req.body.name;
        let searchPetInfo = await svInstance.searchPetInfo(select, name, h_adminCode);

        return res.send(searchPetInfo)
    };

    //  환자 및 보호자 정보
    async petInfoLoad(req, res, next) {
        let petId = req.body.petId;
        let h_user_code = req.body.h_adminCode;
        let petInfoLoad = await svInstance.petInfoLoad(petId, h_user_code);

        return res.send(petInfoLoad)
    };

}

module.exports = measurementController;