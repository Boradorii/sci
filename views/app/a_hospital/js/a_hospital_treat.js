/* 
    ※ daterangepicker 초기화 코드
    https://www.daterangepicker.com/ 옵션 설정 시 daterangepicker 사이트 참고
*/
let endDate1 = moment(); // Current date
let startDate1 = moment().subtract(1, 'month');
let treatList = {};
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
selectTreatData(startDate1.format('YYYY-MM-DD'), endDate1.format('YYYY-MM-DD'))

function selectTreatData(startDate, endDate) {
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/selectTreatData',
        cmmReqDataObj = { // user_code를 userCode라는 변수에 담아서 router로 보냄.
            p_userCode: p_userCode,
            startDate: startDate,
            endDate: endDate
        },
        cmmAsync = false,

        cmmSucc = function(result) {
            treatList = result
            $('#treatList').html('')
            if (result.rowLength != 0) {
                $('#none-data').css('display', 'none')
                for (let i = 0; i < result.rowLength; i++) {
                    medi_purpose = result.rows[i].medi_purpose.toString();
                    switch (medi_purpose) {
                        case "0":
                            medi_purpose = "치료"
                            treatList.rows[i].medi_purpose = medi_purpose
                            break;
                        case "1":
                            medi_purpose = "접종"
                            treatList.rows[i].medi_purpose = medi_purpose
                            break;
                        case "2":
                            medi_purpose = "건강검진"
                            treatList.rows[i].medi_purpose = medi_purpose
                            break;
                        case "3":
                            medi_purpose = "수술"
                            treatList.rows[i].medi_purpose = medi_purpose
                            break;
                        case "4":
                            medi_purpose = "기타"
                            treatList.rows[i].medi_purpose = medi_purpose
                            break;
                    };
                    let treatListHtml = `<tr class="treatList" id=${result.rows[i].medi_num} data-toggle="modal" data-target="#treatDetail-modal" onclick="detail(this)">
                        <td>${result.rows[i].medi_created_time.slice(0,10)}</td>
                        <td>${result.rows[i].h_name}</td>
                        <td>${result.rows[i].pet_name}</td>
                        <td>${medi_purpose} </td>
                        </tr>`;
                    $('#treatList').append(treatListHtml);
                }
            } else {
                $('#none-data').css('display', 'block')
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

function detail(target) {
    for (let i = 0; i < treatList.rowLength; i++) {
        if (treatList.rows[i].medi_num == target.id) {
            $('#h_name').html(treatList.rows[i].h_name)
            $('#h_staff_name').html(treatList.rows[i].h_staff_name)
            $('#medi_purpose').html(treatList.rows[i].medi_purpose)
            $('#medi_contents').html(treatList.rows[i].medi_contents)
            $('#medi_created_time').html(treatList.rows[i].medi_created_time)
        }
    };
}

$('#day-datepicker').on('change', function() {
    let selectDate = $(this).val()
    let start = selectDate.slice(0, 10)
    let end = selectDate.slice(13, )
    selectTreatData(start, end)
})