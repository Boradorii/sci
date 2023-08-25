init();

//병원 상세정보 초기 셋팅
function init() {
    let info = hInfo.rows[0];
    $('#h_name').html(info.h_name);
    $('#h_address').html(info.h_address1 + ' ' + info.h_address2);
    $('#h_telnum').html(info.h_telnum);
    $('#h_operating_time').html(info.h_operating_time);
    $('#h_answer_time').html(info.h_answer_time);
    if (myHos.includes(info.h_user_code)) {
        $('.favorite').css('color', 'red');
    } else {
        $('.favorite').css('color', 'gray');
    }
    setInquiry();
};

function setInquiry() {
    //병원선택 select box 세팅
    let hosList = $('<option>', { value: `${h_userCode}`, text: hInfo.rows[0].h_name })
    $('#select-hos').append(hosList);
    $('#select-hos').prop('disabled', 'false');


    //반려동물선택 select box 세팅
    let petList = ``
    $('#select-pet').html('');
    for (let i = 0; i < myPet.rowLength; i++) {
        petList += `<option value="${myPet.rows[i].pet_id}">${myPet.rows[i].pet_name}</option>`
    }
    $('#select-pet').html(petList);
}


// 내병원 추가
// 라우터 전송 시 myHos 데이터로 병원 즐겨찾기 추가, 삭제 판단
function clickHeart(target) {
    let heartId = hInfo.rows[0].h_user_code
    let heartIcon = $(target).find('i');
    let currentColor = heartIcon.css('color');

    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/checkmyHos',
        cmmReqDataObj = {
            p_userCode: p_userCode,
            h_userCode: heartId,
            myHosCheck: "uncheck"
        },
        cmmAsync = false,
        cmmSucc,
        cmmErr = null;

    if (currentColor == 'rgb(255, 0, 0)') { //if 즐겨찾기 된 병원이라면
        cmmReqDataObj['myHosCheck'] = 'uncheck'
        cmmSucc = function (result) {
            if (result.state)
                heartIcon.css('color', 'gray');
            else
                alert("에러")
        }
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    } else {
        cmmReqDataObj['myHosCheck'] = 'check'
        cmmSucc = function (result) {
            if (result.state)
                heartIcon.css('color', 'red');
            else
                alert("에러")
        }
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    }
};

//문의하기 버튼 클릭
$('#sendInquery').on('click', function () {
    sendInquery()
})

function sendInquery() {
    let sendData = {}
    let answer = [];
    let selectHos = $('#select-hos').val();
    let pet_id, hos_id
    let inquiry_title = $('#inquiry_title').val();

    if (inquiry_title == '') {
        errorSwal("문의 제목을 작성해주세요.")
        return;
    }
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
                symptom: symptom,
                title: inquiry_title
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

