// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_health.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const moment = require('moment');

function calculateAverage(list) {
    if (list.length === 0) {
        return 0; // Return 0 for an empty list to avoid division by zero
    }
    const avg = list.reduce((p, c) => p + c, 0) / list.length;
    return avg;
}

function yesterDay(startDate) {
    startDate = moment(startDate, 'YYYY-MM-DD');
    let yesterdayDate = startDate.clone().subtract(1, 'day');
    return yesterdayDate.format('YYYY-MM-DD');
}

function lastWeek(startDate, endDate) {
    startDate = moment(startDate, 'YYYY-MM-DD')
    endDate = moment(endDate, 'YYYY-MM-DD')
    let startOfLastWeek = startDate.clone().subtract(1, 'week').startOf('isoWeek');
    let endOfLastWeek = endDate.clone().subtract(1, 'week').endOf('isoWeek');
    return {
        start: startOfLastWeek.format('YYYY-MM-DD'),
        end: endOfLastWeek.format('YYYY-MM-DD')
    };
}

function lastMonth(startDate) {
    startDate = moment(startDate, 'YYYY-MM-DD');
    let lastMonthDate = startDate.clone().subtract(1, 'month');
    return lastMonthDate.format('YYYY-MM');
}


class aHealthService {
    //내 반려동물 조회
    async myPet(p_userCode) {
        let result = await mysqlDB('select', queryList.myPet, [p_userCode])
        return result
    };
    async firstPet(p_userCode) {
        let result = await mysqlDB('select', queryList.firstPet, [p_userCode]);
        result = result.rows[0].pet_name;
        return result

    };

    //측정 직후 결과 출력
    async selectResultOne(pet_id, time) {
        let select_measurement_result = await mysqlDB('selectOne', queryList.select_measurement_result, [pet_id, time]);
        let select_pet_name = await mysqlDB('selectOne', queryList.select_pet_name, [pet_id]);
        select_measurement_result["pet_name"] = select_pet_name.row.pet_name;
        return select_measurement_result
    }

    //측정기록 조회
    async selectResult(pet_id, startDate, endDate, tabType) {
        let currentResult, compareResult, compareDate, compareStart, compareEnd
        let returnResult = {};
        let sd
        if (tabType == "tab-month") {
            sd = startDate + "%"
            currentResult = await mysqlDB('select', queryList.selectMonthResult, [pet_id, String(sd)]);
        } else {
            sd = startDate + " 00:00:00"
            endDate = endDate + " 23:59:59"
            currentResult = await mysqlDB('select', queryList.selectResult, [pet_id, String(sd), String(endDate)]);
        }

        if (tabType == "tab-day") {
            compareDate = yesterDay(startDate)
            compareStart = compareDate + " 00:00:00"
            compareEnd = compareDate + " 23:59:59"
            compareResult = await mysqlDB('select', queryList.selectResult, [pet_id, compareStart, compareEnd]);
            let selectDaily = await mysqlDB('select', queryList.selectDaily, [pet_id, startDate + "%"])
            returnResult["selectDaily"] = selectDaily
        } else if (tabType == "tab-week") {
            compareDate = lastWeek(startDate, endDate)
            compareStart = String(compareDate.start) + " 00:00:00"
            compareEnd = String(compareDate.end) + " 23:59:59"
            compareResult = await mysqlDB('select', queryList.selectResult, [pet_id, compareStart, compareEnd]);
        } else {
            compareDate = lastMonth(startDate);
            compareStart = compareDate + "%"
            compareResult = await mysqlDB('select', queryList.selectMonthResult, [pet_id, compareStart]);
        }

        let hrList = [],
            glucoseList = [],
            hpList = [],
            lpList = [],
            c_hrList = [],
            c_glucoseList = [],
            c_hpList = [],
            c_lpList = [];
        if (currentResult.rowLength != 0) {
            for (let i = 0; i < currentResult.rowLength; i++) {
                hrList.push(Number(currentResult.rows[i].hr_avg))
                glucoseList.push(Number(currentResult.rows[i].predict_glucose))
                hpList.push(Number(currentResult.rows[i].predict_high_pressure))
                lpList.push(Number(currentResult.rows[i].predict_low_pressure))
            }
            returnResult["dataYN"] = 'Y'
            returnResult["hrAvg"] = parseInt(calculateAverage(hrList))
            returnResult["glucoseAvg"] = parseInt(calculateAverage(glucoseList))
            returnResult["hpAvg"] = parseInt(calculateAverage(hpList))
            returnResult["lpAvg"] = parseInt(calculateAverage(lpList))

            if (compareResult.rowLength != 0) {
                for (let i = 0; i < compareResult.rowLength; i++) {
                    c_hrList.push(Number(compareResult.rows[i].hr_avg))
                    c_glucoseList.push(Number(compareResult.rows[i].predict_glucose))
                    c_hpList.push(Number(compareResult.rows[i].predict_high_pressure))
                    c_lpList.push(Number(compareResult.rows[i].predict_low_pressure))
                }
                returnResult['compareYN'] = 'Y;'
                returnResult["compHrAvg"] = returnResult["hrAvg"] - parseInt(calculateAverage(c_hrList))
                returnResult["compGlucoseAvg"] = returnResult["glucoseAvg"] - parseInt(calculateAverage(c_glucoseList))
                returnResult["compHpAvg"] = returnResult["hpAvg"] - parseInt(calculateAverage(c_hpList))
                returnResult["compLpAvg"] = returnResult["lpAvg"] - parseInt(calculateAverage(c_lpList))
            } else {
                returnResult['compareYN'] = 'N'
            }
        } else {
            returnResult["dataYN"] = 'N'
        }
        return returnResult
    }

    //내병원 목록 조회
    async myHosList(p_userCode) {
        let result = await mysqlDB('select', queryList.myHosList, [p_userCode]);
        return result
    };

    // 대표반려견 여부 조회
    async check_first(p_userCode) {
        let result = await mysqlDB('select', queryList.check_first, [p_userCode]);
        console.log(result);
        return result
    };

}

module.exports = aHealthService;