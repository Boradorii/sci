// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_home.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');





class aHomeService {



    /**
         *  반려견 정보 출력
         *  @param p_user_code 관리자 코드 (String)
         *  @return 조회 결과 반환(json)
         *  @author ChangGyu Lee
         *  @since 2023.07.10. 최초작성
         *  
         */
    async selectPetInfo(p_user_code) {
        let currentYear = new Date().getFullYear();


        let result = await mysqlDB('selectOne', queryList.selectPetInfo, [p_user_code]);
        result.row.pet_byear = currentYear - result.row.pet_byear;
        if (result.row.pet_gender == 'M') {
            result.row.pet_gender = '수컷'
        } else {
            result.row.pet_gender = '암컷'
        }



        return result
    };

    /**
     *  당일 측정 기록 조회
     *  @param p_user_code 관리자 코드 (String)
     *  @return 조회 결과 반환(json)
     *  @author ChangGyu Lee
     *  @since 2023.07.10. 최초작성
     *  
     */
    async selectTodayList(p_user_code) {

        let mainPetId = await mysqlDB('select', queryList.mainPetId, [p_user_code]);
        let result = await mysqlDB('select', queryList.selectTodayList, [mainPetId.rows[0].pet_id]);





        return result
    };

    // 아이콘 온오프 기능 만들기

    async alert_icon(p_user_code) {

        let result = await mysqlDB('select', queryList.alert_icon, [p_user_code]);
        console.log(result);




        return result
    };


}

module.exports = aHomeService;