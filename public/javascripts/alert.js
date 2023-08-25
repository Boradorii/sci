


setInterval(function () {
    console.log("웹 미확인 알림 업데이트")
    sendAlertState()

}, 10000);

// 문진표 보낼 시 병원에서 알림 카운팅
function sendAlertState() {


    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_hospital/sendAlertState',
        cmmReqDataObj = {
        },
        cmmAsync = false,
        cmmSucc = function (result) {

        },
        cmmErr = null;

    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);


}




