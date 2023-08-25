function init() {
    alertDataLoad(p_userCode)
    setInterval(function () {
        isDelete = 0;
    }, 100);
}

// 1일 경우 delete실행 0일 경우 상세정보 실행
let isDelete;

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
            $('#pushDate').text("수신 동의날짜 | " + result.pushDate);
            if (result.allowState == 'Y') {
                $('#toggle_on').css("display", "")
                $('#toggle_off').css("display", "none")
            } else {
                $('#toggle_on').css("display", "none")
                $('#toggle_off').css("display", "")
            }
            console.log(result.rowLength);
            if (result.rowLength == 0) {

                let alertList;
                alertList =
                    `<div style="text-align:center; font-size:20px;">알림목록이 존재하지 않습니다.</div>
                            `;
                $('#alertList').append(alertList);






            } else {
                for (let i = 0; i < result.rowLength; i++) {
                    let alertList;
                    if (result.rows[i].alert_check == 'N') {
                        alertList =
                            `<div onclick='checkAlert(this)' id='${result.rows[i].class_num}' data-time="${result.rows[i].alert_created_time}" class="card" style="text-align: left; width: 100%; height: auto; padding: 10px; background-color: rgb(231, 231, 231); border: 1px solid black;">
                                <div style="font-weight: 600; padding-bottom: 5px; margin-left:10px; font-size:15pt;">
                                ${result.rows[i].alert_class}
                                <i onclick='alert_delete(this)' id='${result.rows[i].alert_num}' class="material-icons ml-auto" style="color: black; font-size: 35px;">delete</i>
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
                            `<div onclick='checkAlert(this)' id='${result.rows[i].class_num}' data-time="${result.rows[i].alert_created_time}" class="card" style="text-align: left; width: 100%; height: auto; padding: 10px; border: 1px solid black;">
                                <div style="font-weight: 600; padding-bottom: 5px; margin-left:10px; font-size:15pt;">
                                ${result.rows[i].alert_class}
                                <i onclick='alert_delete(this)' id='${result.rows[i].alert_num}' class="material-icons ml-auto" style="color: black; font-size: 35px;">delete</i>
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

// 알림 리스트 클릭
function checkAlert(target) {
    if (isDelete == 1) {
        return;
    }
    isDelete = 0;
    var dataTimeValue = $(target).attr("data-time");
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/checkAlert',
        cmmReqDataObj = {
            p_user_code: p_userCode,
            alert_created_time: dataTimeValue
        },
        cmmAsync = false,

        cmmSucc = function checkAlert(result) {

            if (result.succ == 1) {
                $(target).css('backgroundColor', 'white');

            } else {


                window.parent.postMessage({
                    action: 'moveFrameN'
                }, '*');
                // 알림 리스트 클릭 시 알림 내용에 따라 해당 페이지로 이동.
                if (target.id == 0) {
                    // 진료기록 페이지로 이동
                    let reqUrl = baseUrl + '/a_hospital/treatListPage';
                    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                        action: 'go-treatList'
                    }, '*');
                    reqUrl += '?p_userCode=' + p_userCode;
                    location.href = reqUrl;
                    window.parent.postMessage({
                        action: 'moveFrameY'
                    }, '*');

                } else if (target.id == 1) {
                    // 병원문의 내용 모달창 띄우기.

                    $('#inquiry_modal').appendTo("body").modal('show');
                    inquiry_answer(result.rows[0].inquiry_num);

                } else {
                    // 건강관리 페이지로 이동
                    let reqUrl = baseUrl + '/a_health/predictPage';
                    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                        action: 'go-healthManage'
                    }, '*');
                    reqUrl += '?p_userCode=' + p_userCode;
                    location.href = reqUrl;
                    window.parent.postMessage({
                        action: 'moveFrameY'
                    }, '*');

                }
            }


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

// 원격의료 문의답변 불러오기
function inquiry_answer(inquiry_num) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/inquiry_answer',
        cmmReqDataObj = {
            inquiry_num: inquiry_num
        },
        cmmAsync = false,

        cmmSucc = function inquiry_answer(result) {
            $('#hospital_name').text(result.rows[0].h_name);
            $('#pet_name').text("반려동물 이름: " + result.rows[0].pet_name);
            $('#inquiry_title').text("RE: " + result.rows[0].inquiry_title);
            $('#inquiry_contents').val(result.rows[0].opinion);


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}



// 알람 제거 (일정 기간 지날 시 제거)
function alert_delete_auto() {

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/alert_delete_auto',
        cmmReqDataObj = {
        },
        cmmAsync = false,

        cmmSucc = function alert_delete_auto(result) {

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

// 알람 제거
function alert_delete(target) {
    isDelete = 1;
    console.log(target.id);
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/alert_delete',
        cmmReqDataObj = {
            alert_num: target.id
        },
        cmmAsync = false,

        cmmSucc = function alert_delete(result) {
            if (result.succ == 1) {
                Swal.fire({
                    icon: 'success',
                    title: '삭제 성공!',
                    text: '삭제하였습니다.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        alertDataLoad(p_userCode)
                    }
                });
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

});
$('#allow').click(function () {
    alertPushSetting(p_userCode, 0);
    $('#pushAllowModal').appendTo("body").modal('hide');

});
// 알람제거
$('#alert_delete').click(function () {


})
