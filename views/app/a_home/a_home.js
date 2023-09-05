async function init() {
    selectPetInfo()
    selectTodayList()
    alert_delete()
}
//  반려견 정보 가져오기
function selectPetInfo() {
    console.log(p_userCode);
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_home/selectPetInfo',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function selectPetInfo(result) {
            $("#age").text(result.row.pet_byear + "세");
            $("#gender").text(result.row.pet_gender);
            $("#kind").text(result.row.pet_breed);
            $("#weight").text(result.row.pet_weight + "kg");
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

function selectTodayList() {
    console.log(p_userCode);
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_home/selectTodayList',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function selectTodayList(result) {
            // 당일 측정 기록이 존재하지 않을 때
            if (result.rowLength == 0) {
                $("#todayTestListExist").hide();
                $("#todayTestListNone").show();
            } else {
                // 당일 측정 기록이 존재할 때.
                $("#todayTestListNone").hide();
                $("#todayTestListExist").show();
            }
            for (let i = 0; i < result.rowLength; i++) {
                let tableHtml =
                    `<tr>` +
                    '<td colspan="2">' + result.rows[i].created_time + '</td>' +
                    '<td>' + result.rows[i].hr_avg + '</td>' +
                    '<td>' + result.rows[i].predict_glucose + '</td>' +
                    '</tr>';
                $('#todayTestTable > tbody').append(tableHtml);
            }


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

// 알림 자동 삭제 (어플 시작 시 실행)
function alert_delete() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/alert_delete',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,
        cmmSucc = function(result) {},
        cmmErr = null;

    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);


}