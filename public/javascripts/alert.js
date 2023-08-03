
//문의하기 버튼 클릭
$('#sendInquery').on('click', function () {
    console.log("111");
    sendAlertState()
    console.log("222");
})

function sendInquery() {
    let sendData = {}
    let answer = [];
    let selectHos = $('#select-hos').val();
    let pet_id, hos_id
    if (selectHos === '') {
        errorSwal("병원을 선택해주세요.")
    } else {
        hos_id = selectHos
    }

    let selectPet = $('#select-pet').val();
    if (typeof selectPet === 'null') {
        errorSwal("반려견을 선택해주세요.")
    } else {
        pet_id = selectPet
    }

    $('.radio-select').each(function (idx) {
        let questionId = $(this).attr('id');
        let selectedOption = $(this).find('input[name="' + questionId + '"]:checked').val();
        if (typeof selectedOption === 'undefined' | selectedOption == "") {
            errorSwal("문항을 모두 선택해주세요.")
        } else {
            answer[idx] = selectedOption;
        }
    });

    let inquiry9Value = $('#inquiry9 textarea').val();

    if (inquiry9Value == '') {
        errorSwal("문항을 모두 입력해주세요.")
    } else {
        answer.push(inquiry9Value);

        let inquiry10Value = $('#inquiry10 textarea').val();
        let symptom = inquiry10Value;

        sendData["subInquiry"]
        let cmmContentType = 'application/json',
            cmmType = 'post',
            cmmUrl = '/api/a_hospital/sendInquiry',
            cmmReqDataObj = {
                p_userCode: p_userCode,
                h_userCode: hos_id,
                pet_id: pet_id,
                answer: answer,
                symptom: symptom
            },
            cmmAsync = false,
            cmmSucc = function (result) {
                if (result.succ == 1) {
                    successSwal("문의사항 전송에 성공했습니다.");
                    setTimeout(function () {
                        $('#inquiry-modal').css('display', 'none')
                        location.href = baseUrl + '/a_hospital/hosInfoPage?p_userCode=' + p_userCode + '&h_userCode=' + h_userCode;
                    }, 1500)
                } else {
                    errorSwal("문의사항 전송 실패. 잠시후 다시 시도해주세요")
                }
            },
            cmmErr = null;

        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

    }
}

// console.log("url " + window.location.href)
// console.log(window.location.href.length);
// let userCodeValue;

// if (window.location.href.length > 150) {
//     let url = window.location.href;
//     let urlParts = url.split('/');
//     let lastPart = urlParts[urlParts.length - 1];
//     userCodeValue = lastPart.split('?')[0];
// } else {
//     let url = window.location.href;
//     let startIdx = window.location.href.indexOf('p_userCode=')

//     if (startIdx !== -1) {
//         userCodeValue = url.slice(startIdx + 11); // 11 is the length of 'p_userCode='
//         let endIdx = userCodeValue.indexOf('&');
//         if (endIdx !== -1) {
//             userCodeValue = userCodeValue.slice(0, endIdx);
//         }
//     }
//     // let userCodeValue = myURL.searchParams.get('p_userCode');
//     // h_userCode = url.searchParams.get('h_userCode');
//     // console.log(h_userCode);
// }
// console.log("유저코드", userCodeValue);





setInterval(function () {
    console.log("미확인 알림 업데이트")
    sendAlertState()

}, 5000);

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


