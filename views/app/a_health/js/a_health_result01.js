/* 
    ※ daterangepicker 초기화 코드
    https://www.daterangepicker.com/ 옵션 설정 시 daterangepicker 사이트 참고
*/
let endDate1 = moment(); // Current date
let startDate1 = moment().subtract(1, 'month');
let treatList = {};
let medi_purpose;
let selectPetId
let clickedTabId = "tab-day"

function init() {
    $('#pet-name').text(selectRes.pet_name);
    // $('#day-datepicker').val(endDate1.format("YYYY-MM-DD"));

    $('#result_table').html()
    let avgContents = `<table class="table-result h4">
                    <tr>
                        <td>평균 심박수</td>
                        <td>${selectRes.row.hr_avg} BPM</td>
                    </tr>
                    <tr>
                        <td>혈당</td>
                        <td>${selectRes.row.predict_glucose} mg/dl</td>
                    </tr>
                    <tr>
                        <td>최고혈압</td>
                        <td>${selectRes.row.predict_high_pressure}</td>
                    </tr>
                    <tr>
                        <td>최저혈압</td>
                        <td>${selectRes.row.predict_low_pressure}</td>
                    </tr>
                </table>`
    $('#result_table').html(avgContents);


    //반려동물선택 select box 세팅
    let petList = $('<option>', { value: `${selectRes.row.pet_id}`, text: selectRes.pet_name })
    $('#select-pet').append(petList);
    $('#select-pet').prop('disabled', 'false');


    //병원선택 select box 세팅
    let hosList = ``
    $('#select-hos').html('');
    for (let i = 0; i < myHosList.rowLength; i++) {
        hosList += `<option value="${myHosList.rows[i].h_user_code}">${myHosList.rows[i].h_name}</option>`
    }
    $('#select-hos').html(hosList);
}

//문의하기 버튼 클릭
$('#sendInquiry').on('click', function() {
    sendInquiry()
})

function sendInquiry() {
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

    $('.radio-select').each(function(idx) {
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
            cmmSucc = function(result) {
                if (result.succ == 1) {
                    successSwal("문의사항 전송에 성공했습니다.");
                    setTimeout(function() {
                        $('#inquiry-modal').css('display', 'none')
                        location.href = baseUrl + '/a_health/predictPage?p_userCode=' + p_userCode;
                    }, 1500)
                } else {
                    errorSwal("문의사항 전송 실패. 잠시후 다시 시도해주세요")
                }
            },
            cmmErr = null;

        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

    }
}