const service = require('./predict.service');
const svInstance = new service();

class predictController {

    async predict(req, res, next) {
        let params = req.body
        let result = await svInstance.predict(params);
        return res.json(result)
    };

    async insert_measurement_result(req, res, next) {
        let params = req.body
        let result = await svInstance.insert_measurement_result(params);
        return res.json(result)
    };

    // 예측 결과 조회
    async select_measurement_result(req, res, next) {
        let params = req.body
        let result = await svInstance.select_measurement_result(params);
        return res.json(result)
    };
}


module.exports = predictController;