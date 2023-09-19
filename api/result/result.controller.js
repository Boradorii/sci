const _ = require('lodash');

// 호출할 service 정의
const service = require('./result.service');
const svInstance = new service();

class ResultController {
    async selectResultData(req, res, next) {
        let { userCode } = req.params // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('app/result/result', {
            "resultPage": req.__('resultPage'),
            "userCode": userCode, // 유저 코드 정보 추가 2021.04.21 JG,
            "lang": req.query.lang, // 페이지 언어 정보 추가 2021.04.22 JG,
            "accessToken": req.query.accessToken // jwt accessToken 정보 추가 2021.04.22 JG
        });
    }

    // batch data 가져오기
    async getHealthIndex(req, res, next) {

        let reqParams = req.body,
        settings = reqParams.settings,
        result;

        if(settings.mode == 'daily'){
            result = await svInstance.getHealthIndex(reqParams.userCode, settings.mode, settings.startDate, settings.endDate);
        }else{
            result = await svInstance.getHealthIndex(reqParams.userCode, settings.mode, settings.startDate, null);
        }
        return res.json({
            "dataArray": result
        });
    }

}
module.exports = ResultController;