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

    $('#pet-name').text(firstPet);
    $('#day-datepicker').val(endDate1.format("YYYY-MM-DD"));

    // 등록 반려동물이 1마리라면 조회대상 변경버튼 비활성화
    if (myPet.rowLength > 1) {
        $('#changePet-btn').css('display', 'block');
    } else {
        $('#changePet-btn').css('display', 'none');
    }

    //조회대상 변경 모달 만들기
    $('#changePet-modal .modal-body').html();
    let changePetlist = ''
    for (let i = 0; i < myPet.rowLength; i++) {
        changePetlist += `<div>
                        <input type="radio" id="${myPet.rows[i].pet_id}" name="petSelection" value="${myPet.rows[i].pet_name}"/>
                        <label for="${myPet.rows[i].pet_name}">${myPet.rows[i].pet_name}</label>
                    </div>`
        if (myPet.rows[i].pet_name == firstPet) {
            selectPetId = myPet.rows[i].pet_id
        }
    }
    $('#changePet-modal .modal-body').html(changePetlist);
    $('input[value=' + firstPet + ']').prop('checked', true);

    selectTreatData(selectPetId, endDate1.format('YYYY-MM-DD'), endDate1.format('YYYY-MM-DD'));
}

$('#changePet-btn').on('click', function() {
    $('#changePet-modal').modal()
})

//조회 대상 변경
$('#changePet').on('click', function() {
    selectPetId = $('input[name="petSelection"]:checked').attr('id');
    $('#changePet-modal').modal('hide')
    $('#pet-name').text($('input[name="petSelection"]:checked').attr('value'));
    if (clickedTabId == "tab-day") {
        selectTreatData(selectPetId, endDate1.format('YYYY-MM-DD'), endDate1.format('YYYY-MM-DD'));
    } else if (clickedTabId == "tab-week") {
        selectTreatData(selectPetId, $('#daterange-datepicker').val().slice(0, 10), $('#daterange-datepicker').val().slice(13));
    } else {
        selectTreatData(selectPetId, $('#daterange-datepicker').val(), $('#daterange-datepicker').val())
    }
})



$('.nav-link').on('click', function() {
    clickedTabId = $(this).attr('id');
    console.log(clickedTabId); // 클릭된 탭의 id를 콘솔에 출력하거나 원하는 동작을 수행합니다.
    switch (clickedTabId) {
        case "tab-day":
            $('#day-picker').css('display', 'flex')
            $('#picker').css('display', 'none')
            selectTreatData(selectPetId, endDate1.format('YYYY-MM-DD'), endDate1.format('YYYY-MM-DD'))
            break;
        case "tab-week":
            $('#daterange-datepicker').daterangepicker({
                autoApply: true,
                singleDatePicker: true,
                showDropdowns: true,
                startDate: endDate1.clone().startOf('isoWeek'),
                endDate: endDate1.clone().endOf('isoWeek'),
                maxDate: endDate1,
                locale: {
                    format: 'YYYY-MM-DD',
                    "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                    "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
                },
            });

            $('#daterange-datepicker').val(endDate1.clone().startOf('isoWeek').format('YYYY-MM-DD') + ' - ' + endDate1.clone().endOf('isoWeek').format('YYYY-MM-DD'));
            $('#day-picker').css('display', 'none')
            $('#picker').css('display', 'flex')
            console.log($('#daterange-datepicker').val())
            selectTreatData(selectPetId, $('#daterange-datepicker').val().slice(0, 10), $('#daterange-datepicker').val().slice(13));
            break;
        case "tab-month":
            $('#daterange-datepicker').daterangepicker({
                singleDatePicker: true,
                autoApply: true,
                maxDate: endDate1,
                locale: {
                    format: 'YYYY-MM',
                    "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                    "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
                },
            });
            $('#day-picker').css('display', 'none');
            $('#picker').css('display', 'flex');
            selectTreatData(selectPetId, $('#daterange-datepicker').val().slice(0, 10), $('#daterange-datepicker').val().slice(13))
            break;
        default:
            $('#day-picker').css('display', 'flex');
            $('#picker').css('display', 'none');
            break;
    }
});

$('#day-datepicker').on('change', function() {
    selectTreatData(selectPetId, $('#day-datepicker').val(), $('#day-datepicker').val())
})

$('#daterange-datepicker').on('change', function() {
    console.log("daterangePicker change")
    if (clickedTabId == "tab-week") {
        console.log($('#daterange-datepicker').val())
        selectTreatData(selectPetId, $('#daterange-datepicker').val().slice(0, 10), $('#daterange-datepicker').val().slice(13))
    } else {
        selectTreatData(selectPetId, $('#daterange-datepicker').val(), $('#daterange-datepicker').val())
    }
})

$('#daterange-datepicker').on('apply.daterangepicker', function(ev, picker) {
    const selectedDate = picker.startDate;

    const startOfWeek = selectedDate.clone().startOf('isoWeek');
    const endOfWeek = selectedDate.clone().endOf('isoWeek');

    $('#daterange-datepicker').data('daterangepicker').setStartDate(startOfWeek);
    $('#daterange-datepicker').data('daterangepicker').setEndDate(endOfWeek);

    $('#daterange-datepicker').val(startOfWeek.format('YYYY-MM-DD') + ' - ' + endOfWeek.format('YYYY-MM-DD'));
});

function selectTreatData(pet_id, startDate, endDate) {
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_health/selectResult',
        cmmReqDataObj = {
            pet_id: pet_id,
            startDate: startDate,
            endDate: endDate,
            tabType: clickedTabId
        },
        cmmAsync = true,
        cmmSucc = function(result) {
            console.log(result)
            let selectDaily = result.selectDaily
            if (result.dataYN == 'Y') {
                $('#DataY').css('display', 'flex');
                $('#DataN').css('display', 'none');
                $('#avg_table').html();
                $('#compare_table').html();
                $('#daily_table').html();
                let compareContents
                let hrState, gState, hpState, lpState
                if (result.hrAvg < 70 | result.hrAvg > 120) {
                    hrState = "나쁨"
                } else {
                    hrState = "좋음"
                }
                if (result.glucoseAvg < 80 | result.glucoseAvg > 120) {
                    gState = "나쁨"
                } else {
                    gState = "좋음"
                }
                if (result.hpAvg < 100 | result.hpAvg > 120) {
                    hpState = "나쁨"
                } else {
                    hpState = "좋음"
                }
                if (result.lpAvg < 80 | result.lpAvg > 90) {
                    lpState = "나쁨"
                } else {
                    lpState = "좋음"
                }
                let avgContents = `<table class="table-result h4">
                    <tr>
                        <td>평균 심박수</td>
                        <td>${result.hrAvg} BPM</td>
                    </tr>
                    <tr>
                        <td>평균 혈당</td>
                        <td>${result.glucoseAvg} mg/dl</td>
                    </tr>
                    <tr>
                        <td>평균 최고혈압</td>
                        <td>${result.hpAvg}</td>
                    </tr>
                    <tr>
                        <td>평균 최저혈압</td>
                        <td>${result.lpAvg}</td>
                    </tr>
                </table>`
                $('#avg_table').html(avgContents)
                compareContents = `<table class="table-result h4">
                    <tr>
                        <td>심박수 상태</td>
                        <td>${hrState}</td>
                    </tr>
                    <tr>
                        <td id="compare-title-hr"></td>
                        <td id="compare-value-hr">
                        </td>
                    </tr>
                    <tr>
                        <td>혈당 상태</td>
                        <td>${gState}</td>
                    </tr>
                    <tr>
                        <td id="compare-title-glucose"></td>
                        <td id="compare-value-glucose">
                        </td>
                    </tr>
                    <tr>
                        <td>최고혈압 상태</td>
                        <td>${hpState}</td>
                    </tr>
                    <tr>
                        <td id="compare-title-hp"></td>
                        <td id="compare-value-hp">
                        </td>
                    </tr>
                    <tr>
                        <td>최저혈압 상태</td>
                        <td>${lpState}</td>
                    </tr>
                    <tr>
                        <td id="compare-title-lp"></td>
                        <td id="compare-value-lp">
                        </td>
                    </tr>
                </table>`;
                $('#compare_table').html(compareContents)
                if (clickedTabId == "tab-day") {
                    $('#compare-title-hr').html("전날 대비 심박수");
                    $('#compare-title-glucose').html("전날 대비 혈당");
                    $('#compare-title-hp').html("전날 대비 최고혈압");
                    $('#compare-title-lp').html("전날 대비 최저혈압");
                    $('#daily_only').css('display', 'block');
                    let dailyDetail = ''
                    if (selectDaily.rowLength != 0) {
                        for (let i = 0; i < selectDaily.rowLength; i++) {
                            console.log(selectDaily.rows[i].created_time)
                            dailyDetail += `<table class="table-result h4" style="width:100%">
                                    <colgroup>
                                        <col style="width:20%;">
                                        <col style="width:40%;">
                                        <col style="width:40%;">
                                    </colgroup>
                                    <tr>
                                        <td>측정시간</td>
                                        <td colspan="2"><strong>${selectDaily.rows[i].created_time}</strong></td>
                                    </tr>
                                    <tr>
                                        <td rowspan="3">측정결과</td>
                                        <td>혈당</td>
                                        <td>${selectDaily.rows[i].predict_glucose}</td>
                                    </tr>
                                    <tr>
                                        <td>최고혈압</td>
                                        <td>${selectDaily.rows[i].predict_high_pressure}</td>
                                    </tr>
                                    <tr>
                                        <td>최저혈압</td>
                                        <td>${selectDaily.rows[i].predict_low_pressure}</td>
                                    </tr>
                                </table>`
                        }
                        $('#daily_table').html(dailyDetail);
                    }

                } else if (clickedTabId == "tab-week") {
                    $('#compare-title-hr').html("지난주 대비 심박수");
                    $('#compare-title-glucose').html("지난주 대비 혈당");
                    $('#compare-title-hp').html("지난주 대비 최고혈압");
                    $('#compare-title-lp').html("지난주 대비 최저혈압");
                    $('#daily_only').css('display', 'none')
                } else {
                    $('#compare-title-hr').html("지난달 대비 심박수");
                    $('#compare-title-glucose').html("지난달 대비 혈당");
                    $('#compare-title-hp').html("지난달 대비 최고혈압");
                    $('#compare-title-lp').html("지난달 대비 최저혈압");
                    $('#daily_only').css('display', 'none')
                }
                if (result.compareYN == 'N') {
                    $('#compare-value-hr').html('-')
                    $('#compare-value-glucose').html('-')
                    $('#compare-value-hp').html('-')
                    $('#compare-value-lp').html('-')
                } else {
                    let cvhrHtml, cvgHtml, cvhpHtml, cvlpHtml
                    if (result.compHrAvg > 0) {
                        cvhrHtml = `<div class="center-align">
                        <i class="material-icons" style="color: red;">keyboard_arrow_up</i>${result.compHrAvg}</div>`
                    } else if (result.compHrAvg == 0) {
                        cvhrHtml = `<div class="center-align">
                        ${result.compHrAvg}</div>`
                    } else {
                        cvhrHtml = `<div class="center-align">
                        <i class="material-icons" style="color: blue;">keyboard_arrow_down</i>${String(result.compHrAvg).slice(1)}</div>`
                    }
                    $('#compare-value-hr').html(cvhrHtml)

                    if (result.compGlucoseAvg > 0) {
                        cvgHtml = `<div class="center-align">
                        <i class="material-icons" style="color: red;">keyboard_arrow_up</i>${result.compGlucoseAvg}</div>`
                    } else if (result.compGlucoseAvg == 0) {
                        cvgHtml = `<div class="center-align">
                        ${result.compGlucoseAvg}</div>`
                    } else {
                        cvgHtml = `<div class="center-align">
                        <i class="material-icons" style="color: blue;">keyboard_arrow_down</i>${String(result.compGlucoseAvg).slice(1)}</div>`
                    }
                    $('#compare-value-glucose').html(cvgHtml)

                    if (result.compHpAvg > 0) {
                        cvhpHtml = `<div class="center-align">
                        <i class="material-icons" style="color: red;">keyboard_arrow_up</i>${result.compHpAvg}</div>`
                    } else if (result.compHpAvg == 0) {
                        cvhpHtml = `<div class="center-align">
                        ${result.compHpAvg}</div>`
                    } else {
                        cvhpHtml = `<div class="center-align">
                        <i class="material-icons" style="color: blue;">keyboard_arrow_down</i>${String(result.compHpAvg).slice(1)}</div>`
                    }
                    $('#compare-value-hp').html(cvhpHtml)

                    if (result.compLpAvg > 0) {
                        cvlpHtml = `<div class="center-align">
                        <i class="material-icons" style="color: red;">keyboard_arrow_up</i>${result.compLpAvg}</div>`
                    } else if (result.compLpAvg == 0) {
                        cvlpHtml = `<div class="center-align">
                        ${result.compLpAvg}</div>`
                    } else {
                        cvlpHtml = `<div class="center-align">
                        <i class="material-icons" style="color: blue;">keyboard_arrow_down</i>${String(result.compLpAvg).slice(1)}</div>`
                    }
                    $('#compare-value-lp').html(cvlpHtml)

                }
            } else {
                $('#DataY').css('display', 'none');
                $('#DataN').css('display', 'flex');
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}