const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./predict.sql');
const { PythonShell } = require('python-shell');
const logger = require('../../config/loggerSettings');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const net = require('net');
const HOST = 'localhost';
const PORT = 3867;

function DateTime() {
    let getDate = new Date();
    let nowYear = getDate.getFullYear()
    let nowMonth = (getDate.getMonth() + 1) >= 10 ? (getDate.getMonth() + 1) : '0' + (getDate.getMonth() + 1);
    let nowDay = getDate.getDate() >= 10 ? getDate.getDate() : '0' + getDate.getDate();
    let nowhours = getDate.getHours() >= 10 ? getDate.getHours() : '0' + getDate.getHours();
    let nowMinutes = getDate.getMinutes() >= 10 ? getDate.getMinutes() : '0' + getDate.getMinutes();
    let nowSeconds = getDate.getSeconds() >= 10 ? getDate.getSeconds() : '0' + getDate.getSeconds();
    let nowTime = nowYear + "-" + nowMonth + "-" + nowDay + " " + nowhours + ':' + nowMinutes + ':' + nowSeconds;
    return nowTime
}

class predictService {

    async predict(params) {
        let userCode = params.userCode;
        let hr = params['hr[]'];
        let hrv = params['hrv[]'];
        let device_id = params.deviceId;
        let pet_id = params.pet_id
        let select_age_gender = await mysqlDB('selectOne', queryList.select_age_gender, [pet_id]);
        let pet_byear = select_age_gender.row.pet_byear;
        let gender = select_age_gender.row.gender;
        let nowDate = new Date();
        let nowYear = nowDate.getFullYear();
        let age = parseInt(nowYear) - parseInt(pet_byear);
        let datetime = DateTime();
        if (gender == 'M') {
            gender = 0;
        } else {
            gender = 1;
        }

        let select_sensorInfo = await mysqlDB('selectOne', queryList.select_sensorInfo, [device_id]);
        let result;
        if (select_sensorInfo.rowLength == 0) {
            result = await mysqlDB('insert', queryList.insert_sensorInfo, [device_id, userCode]);
        } else {
            result = await mysqlDB('insert', queryList.update_sensorInfo, [userCode, device_id]);
        }
        const client = new net.Socket;
        try {
            // Socket 송신 데이터
            client.connect(PORT, HOST, () => {
                const data = {
                    DT: "D4",
                    HR: JSON.stringify(hr),
                    HRV: JSON.stringify(hrv),
                    AGE: age,
                    GENDER: gender
                };
                const jsonData = JSON.stringify(data);
                client.write(jsonData);
            });

            // Socket 수신 데이터
            client.on('data', (data) => {
                let result = JSON.parse(data.toString())
                console.log(result)
                let hr_list = JSON.stringify(result["HR"]);
                let hrv_list = JSON.stringify(result["HRV"]);
                let sdnn = result["SDNN"];
                let rmssd = result["RMSSD"];
                let pnn50 = result["PNN50"];
                let avg_hr = result["AVG_HR"];
                let avg_hrv = result["AVG_HRV"];
                let glucos = result["Glucose"];
                let high_pressure = result["HighPressure"];
                let low_pressure = result["LowPressure"];

                let predict_datetime = DateTime();

                mysqlDB('insert', queryList.insert_measurement_result, [pet_id, age, gender, hr_list, hrv_list, sdnn, rmssd, pnn50, avg_hr, avg_hrv, glucos, high_pressure, low_pressure, predict_datetime, userCode])

                client.end();
            });

            // Socket 통신 오류
            client.on('error', (error) => {
                console.log('Socket Communication Error.');
                console.log(error)
                    // 에러 처리 로직 추가 가능
                let options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    scriptPath: 'C:/Users/SCI/Desktop/PPG_Pet/server/api/predict/predictPy',
                    args: [pet_id, hr, hrv, age, gender, userCode]
                };

                PythonShell.run('predict.py', options, function(err, results) {
                    if (err) {
                        console.log(err)
                    } else {
                        return results
                    }
                });
            });
            // Socket 통신 종료
            client.on('close', () => {
                console.log('Socket Communication Complete.');
            });
        } catch (error) {
            console.log(error)

        };
        return datetime
    };

    // 예측 결과 저장
    async insert_measurement_result(params) {
        let pet_id = params.pet_id;
        let age = params.age;
        let gender = params.gender;
        let hr_avg = params.hr_avg;
        let hrv_avg = params.hrv_avg;
        let hr = params.hr;
        let hrv = params.hrv;
        let sdnn = params.sdnn;
        let rmssd = params.rmssd;
        let pnn50 = params.pnn50;
        let predict_glucose = params.predict_glucose;
        let predict_high_pressure = params.predict_high_pressure;
        let predict_low_pressure = params.predict_low_pressure;
        let datetime = DateTime();
        let userCode = userCode;

        let select_measurement_result = await mysqlDB('selectOne', queryList.insert_measurement_result, [pet_id, age, gender, hr, hrv, sdnn, rmssd, pnn50, hr_avg, hrv_avg, predict_glucose, predict_high_pressure, predict_low_pressure, datetime, userCode]);
        return select_measurement_result
    };

    // 예측 결과 조회
    async select_measurement_result(params) {
        let pet_id = params.pet_id;
        let time = params.time;
        let select_measurement_result = await mysqlDB('selectOne', queryList.select_measurement_result, [pet_id, time]);
        return select_measurement_result
    }



    // 실측값 입력
    async insert_real_input(params) {
        let num = params.num;
        let glucos = params.glucos;
        let high_pressure = params.high_pressure;
        let low_pressure = params.low_pressure;
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        if (glucos == "") {
            glucos = null
        } else {
            glucos = cryptoUtil.encrypt_aes(cryptoKey, glucos);
        }
        if (high_pressure == "") {
            high_pressure = null
        } else {
            high_pressure = cryptoUtil.encrypt_aes(cryptoKey, high_pressure);
        }
        if (low_pressure == "") {
            low_pressure = null
        } else {
            low_pressure = cryptoUtil.encrypt_aes(cryptoKey, low_pressure);
        }
        let insert_real_input = await mysqlDB('udpate', queryList.insert_real_input, [glucos, high_pressure, low_pressure, num]);

        return insert_real_input
    }

    // 결과 조회(시연)
    async select_real_result(params) {
        let userCode = params.userCode;
        let date = params.date;
        date = date + "%"

        let select_real_result = await mysqlDB('select', queryList.select_real_result, [userCode, date]);

        if (select_real_result.rowLength != 0) {
            let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
            cryptoKey = cryptoKey.row.key_string;

            for (let i = 0; i < select_real_result.rowLength; i++) {
                select_real_result.rows[i].age = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].age);
                select_real_result.rows[i].gender = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].gender);
                select_real_result.rows[i].hr_avg = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].hr_avg);
                select_real_result.rows[i].stress = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].stress);
                select_real_result.rows[i].health_index = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].health_index);
                select_real_result.rows[i].predict_glucos = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].predict_glucos);
                select_real_result.rows[i].predict_high_pressure = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].predict_high_pressure);
                select_real_result.rows[i].predict_low_pressure = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].predict_low_pressure);

                if (select_real_result.rows[i].input_glucos != null) {
                    select_real_result.rows[i].input_glucos = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].input_glucos);
                }

                if (select_real_result.rows[i].input_high_pressure != null) {
                    select_real_result.rows[i].input_high_pressure = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].input_high_pressure);
                }

                if (select_real_result.rows[i].input_low_pressure != null) {
                    select_real_result.rows[i].input_low_pressure = cryptoUtil.decrypt_aes(cryptoKey, select_real_result.rows[i].input_low_pressure);
                }

                if (select_real_result.rows[i].gender == 0) {
                    select_real_result.rows[i].gender = "남자"
                } else {
                    select_real_result.rows[i].gender = "여자"
                }
                select_real_result.rows[i].created_time = select_real_result.rows[i].created_time.split(" ")[1]
            }
        }
        return select_real_result
    }
}


module.exports = predictService;