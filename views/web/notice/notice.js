let post_inquiry_num;
// 미확인 알림 내역 조회
function noticeNList() {
    $('#noticeN-table > tbody').html('');

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/notice/noticeNList',
        cmmReqDataObj = {
            h_adminCode: h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function noticeNList(result) {
            for (let i = 0; i < result.rowLength; i++) {
                let tableHtml =
                    `<tr>` +
                    '<td>' + result.rows[i].p_user_name + '</td>' +
                    `<td>` + result.rows[i].pet_name + "</td>" +
                    '<td>' + result.rows[i].inquiry_created_time + '</td>' +
                    `<td> <button id="showInfoBtn" class="btn btn-secondary" data-toggle="modal" data-target="#symptom-detail-modal" onclick="inquiryList('${result.rows[i].inquiry_num}','n')">확인</button> </td>`
                '</tr>';
                $('#noticeN-table > tbody').append(tableHtml);
            }
            noticeYList();
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 확인 알림 내역 조회
function noticeYList() {
    $('#noticeY-table > tbody').html('');

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/notice/noticeYList',
        cmmReqDataObj = {
            h_adminCode: h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function noticeYList(result) {
            for (let i = 0; i < result.rowLength; i++) {
                let tableHtml =
                    `<tr>` +
                    '<td>' + result.rows[i].p_user_name + '</td>' +
                    `<td>` + result.rows[i].pet_name + "</td>" +
                    '<td>' + result.rows[i].inquiry_created_time + '</td>' +
                    '<td>' + result.rows[i].alert_check_time + '</td>' +
                    `<td> <button id="showInfoBtn2" class="btn btn-secondary" data-toggle="modal" data-target="#notice-detail-modal" onclick="inquiryList('${result.rows[i].inquiry_num}', 'y')">확인</button> </td>` +
                    '</tr>';
                $('#noticeY-table > tbody').append(tableHtml);
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};


// 문진표 조회
function inquiryList(inquiry_num, check) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/notice/inquiryList',
        cmmReqDataObj = {
            inquiry_num: inquiry_num
        },
        cmmAsync = false,

        cmmSucc = function staffInfo(result) {
            post_inquiry_num = inquiry_num;

            for (let j = 0; j < 8; j++) {
                let radioCheck = $('input[name="questionnaire_' + check + '0' + (j + 1) + '"][value="' + result.rows[0].questionnaire[j] + '"]');
                if (radioCheck.length > 0) {
                    radioCheck.prop('checked', true);
                }
            }
            $('#questionnaire_09_text').val(result.rows[0].questionnaire[8]);
            $('#questionnaire_10_text').val(result.rows[0].symptom);
            $('#detail-answer').val(result.rows[0].opinion)

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};


// 환자 및 보호자 검색
function searchInfo() {
    // daterange 기간 가져오기
    var dateRange = $('#noticeDate').val()
    var dates = dateRange.split(" - ");
    var startDate = dates[0];
    var endDate = dates[1];

    // 환자로 검색 or 보호자로 검색인지 option값 가져오기
    let selectElement = document.getElementById("searchKey");
    let selectedValue = selectElement.value;

    // 검색창의 입력값 가져오기
    let inputElement = document.getElementById("searchWord");
    let inputValue = inputElement.value;

    if (inputValue.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '검색 실패!',
            text: '검색어를 입력해주세요!',
        });
        return;
    } else {
        $('#noticeY-table > tbody').html('');

        let cmmContentType = 'application/json',
            cmmType = 'post',
            cmmUrl = '/api/notice/searchInfo',
            cmmReqDataObj = {
                startDate: startDate,
                endDate: endDate,
                name: inputValue,
                select: selectedValue,
                h_adminCode: h_adminCode
            },
            cmmAsync = false,

            cmmSucc = function searchInfo(result) {
                if (result.rowLength < 1) {
                    Swal.fire({
                        icon: 'fail',
                        title: '검색 실패!',
                        text: '검색 결과 "' + inputValue + '"는 조회되지 않습니다.',
                    });
                    return;
                }
                for (let i = 0; i < result.rowLength; i++) {
                    let tableHtml =
                        `<tr>` +
                        '<td>' + result.rows[i].p_user_name + '</td>' +
                        `<td>` + result.rows[i].pet_name + "</td>" +
                        '<td>' + result.rows[i].inquiry_created_time + '</td>' +
                        '<td>' + result.rows[i].alert_check_time + '</td>' +
                        `<td> <button id="showInfoBtn2" class="btn btn-secondary" data-toggle="modal" data-target="#notice-detail-modal" onclick="inquiryList('${result.rows[i].inquiry_num}')">확인</button> </td>` +
                        '</tr>';
                    $('#noticeY-table > tbody').append(tableHtml);
                }

            },
            cmmErr = null;
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    }
};


//  문의 답변 전송
$('#adminEditBtn').click(function () {
    inquiry_post(post_inquiry_num);
    // 문의 답변 전송 했을 때 답변을 inquiry_list의 opinion에 등록.
    // 등록된 opinion은 환자가 알림 관리에서 원격의료관련 알림을 클릭했을 때 모달창으로 출력.
    // 건강관리 - health01 페이지로 화면 이동
    // 원격의료 - notice-2 페이지로 이동
    // 진료내역 - hospital06 화면으로 이동.
});

function inquiry_post(inquiry_num) {
    let inquiry_contents = $('#answer-input').val();
    if (inquiry_contents == "") {
        Swal.fire({
            icon: 'error',
            title: '등록 실패!',
            text: '소견을 작성해주세요.',
        });
        return;
    }
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/notice/inquiry_post',
        cmmReqDataObj = {
            inquiry_num: inquiry_num,
            inquiry_contents: inquiry_contents
        },
        cmmAsync = false,

        cmmSucc = function inquiry_post(result) {
            if (result.succ == 1) {
                Swal.fire({
                    icon: 'success',
                    title: '등록 성공!',
                    text: '소견을 등록하였습니다.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        $("#answer-modal").modal('hide');
                        location.reload();
                    }
                })
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

