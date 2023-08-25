/* 
    ※ daterangepicker 초기화 코드
    https://www.daterangepicker.com/ 옵션 설정 시 daterangepicker 사이트 참고
*/
let endDate1 = moment(); // Current date
let startDate1 = moment().subtract(1, 'month');
let inquiryList = {};
let medi_purpose;

$('#day-datepicker').daterangepicker({
    autoApply: true,
    startDate: startDate1,
    endDate: endDate1,
    maxDate: endDate1,
    locale: {
        format: 'YYYY-MM-DD',
        "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
        "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    },
});
selectInquiryData(startDate1.format('YYYY-MM-DD'), endDate1.format('YYYY-MM-DD'))

function selectInquiryData(startDate, endDate) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_hospital/selectInquiryData',
        cmmReqDataObj = {
            p_userCode: p_userCode,
            startDate: startDate,
            endDate: endDate
        },
        cmmAsync = false,

        cmmSucc = function (result) {
            inquiryList = result
            $('#inquiryList').html('')
            if (result.rowLength != 0) {
                $('#none-data').css('display', 'none')
                for (let i = 0; i < result.rowLength; i++) {

                    let inquiryListHtml = `<tr class="inquiryList" id=${result.rows[i].inquiry_num} data-toggle="modal" data-target="#inquiry_modal" onclick="inquiry_answer(${result.rows[i].inquiry_num})">
                        <td>${result.rows[i].inquiry_created_time.slice(0, 10)}</td>
                        <td>${result.rows[i].h_user_name}</td>
                        <td>${result.rows[i].pet_name}</td>
                        <td>${result.rows[i].alert_created_time.slice(0, 10)} </td>
                        </tr>`;
                    $('#inquiryList').append(inquiryListHtml);
                }
            } else {
                $('#none-data').css('display', 'block')
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

$('#day-datepicker').on('change', function () {
    let selectDate = $(this).val()
    let start = selectDate.slice(0, 10)
    let end = selectDate.slice(13,)
    selectInquiryData(start, end)
})