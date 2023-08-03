function init() {
    alertDataLoad(p_userCode)
}

// 알림관리 페이지 데이터 로드
function alertDataLoad(p_userCode) {
    $('#alertList').empty();
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/alertDataLoad',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function alertDataLoad(result) {
            console.log(result);
            $('#pushDate').text("수신 동의날짜 | " + result.pushDate);
            if (result.allowState == 'Y') {
                $('#toggle_on').css("display", "")
                $('#toggle_off').css("display", "none")
            } else {
                $('#toggle_on').css("display", "none")
                $('#toggle_off').css("display", "")
            }

            for (let i = 0; i < result.rowLength; i++) {
                console.log(result.rows[i]);
                let alertList;
                if (result.rows[i].alert_check == 'N') {
                    alertList =
                        `<div onclick='checkAlert(this)' id='${i}' class="card" style="text-align: left; width: 100%; height: auto; padding: 10px; background-color: rgb(231, 231, 231); border: 1px solid black;">
                            <div style="font-weight: 600; padding-bottom: 5px; margin-left:10px; font-size:15pt;">
                            ${result.rows[i].alert_class}
                            </div>
                            <div style="margin-left:10px; font-size:13pt;">
                            ${result.rows[i].alert_msg}
                            </div>
                            <div style="margin-left:10px; font-size:13pt;">
                            ${result.rows[i].alert_created_time}
                            </div>
                        `;
                } else {
                    alertList =
                        `<div onclick='checkAlert(this)' id='${i}' class="card" style="text-align: left; width: 100%; height: auto; padding: 10px; border: 1px solid black;">
                            <div style="font-weight: 600; padding-bottom: 5px; margin-left:10px; font-size:15pt;">
                            ${result.rows[i].alert_class}
                            </div>
                            <div style="margin-left:10px; font-size:13pt;">
                            ${result.rows[i].alert_msg}
                            </div>
                            <div style="margin-left:10px; font-size:13pt;">
                            ${result.rows[i].alert_created_time}
                            </div>
                        `;
                }
                $('#alertList').append(alertList);

            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

// 알림 리스트 불러오기
function alertPushSetting(p_userCode, isAllow) {

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/alertPushSetting',
        cmmReqDataObj = {
            p_user_code: p_userCode,
            isAllow: isAllow
        },
        cmmAsync = false,

        cmmSucc = function alertPushSetting(result) {
            if (result.row.p_user_provide_yn == 'Y') {
                $('#toggle_on').css("display", "")
                $('#toggle_off').css("display", "none")
            } else {
                $('#toggle_on').css("display", "none")
                $('#toggle_off').css("display", "")
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

// 알림 리스트 불러오기
function checkAlert(target) {

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/checkAlert',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function checkAlert(result) {
            console.log(result);
            if (result.succ == 1) {
                $(target).css('backgroundColor', 'white');
                console.log(target.id);

            } else {
                console.log(target.id);
                let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
                window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                    action: 'go-petManage'
                }, '*');
                location.href = reqUrl;
            }
            if (target.id == 0) {
                // 진료기록 페이지로 이동
            } else if (target.id == 1) {
                // 병원문의 페이지로 이동
            } else {
                // 건강관리 페이지로 이동
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}


// 서비스 알림 수신 팝업창 띄우기
$('#serviceAlertDetail').click(function () {
    $('#serviceAlertDetailModal').appendTo("body").modal('show');

});
$('#closeModal').click(function () {
    $('#serviceAlertDetailModal').appendTo("body").modal('hide');

});
// 서비스 푸쉬 허용 팝업창 띄우기
$('.pushAllow').click(function () {
    $('#pushAllowModal').appendTo("body").modal('show');

});
$('#disallow').click(function () {
    alertPushSetting(p_userCode, 1);
    $('#pushAllowModal').appendTo("body").modal('hide');

})
$('#allow').click(function () {
    alertPushSetting(p_userCode, 0);
    $('#pushAllowModal').appendTo("body").modal('hide');

})