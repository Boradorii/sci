let petIdModify;
let start_medi_num;
let modify_medi_num;
let hrChart;
let glucoseChart;
let class_num = 0;
let pW;
let pN;
let piN;


//  환자 또는 보호자 명 검색
$('#searchWord2').on('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#searchBtn2').click();
    }
});
$('#searchWord').on('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#searchBtn').click();
    }
});
$("#searchBtn").click(function () {
    searchPetInfo()
});
//  환자 및 보호자 정보 수정
$("#patientEditBtn").click(function () {

    petInfoModify(petIdModify)
});
// 환자 및 보호자 정보 수정 시 input태그 잘 보이도록
$('.patient-info-input').on('focus', function () {
    $(this).addClass('focus');
});

$('.patient-info-input').on('blur', function () {
    $(this).removeClass('focus');
});



async function init() {

    /* 
        ※ daterangepicker 초기화 코드
        https://www.daterangepicker.com/ 옵션 설정 시 daterangepicker 사이트 참고
    */

    var endDate1 = moment(); // Current date
    var startDate1 = moment().subtract(1, 'month').startOf('month');
    $('#rangeDate').daterangepicker({
        autoApply: true,
        startDate: startDate1,
        endDate: endDate1,
        locale: {
            format: 'YYYY-MM-DD',
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        },
    });

    var endDate2 = moment(); // Current date
    var startDate2 = moment().subtract(1, 'year');
    $('#rangeDate_diagnosis').daterangepicker({
        autoApply: true,
        startDate: startDate2,
        endDate: endDate2,
        locale: {
            format: 'YYYY-MM-DD',
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
        },
    });
}

// 환자 및 보호자 정보 검색
function searchPetInfo() {
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
        $('#search-modal-table > tbody').html('');

        let cmmContentType = 'application/json',
            cmmType = 'post',
            cmmUrl = '/api/patient/searchPetInfo',
            cmmReqDataObj = {
                name: inputValue,
                select: selectedValue,
                h_adminCode: h_adminCode
            },
            cmmAsync = false,

            cmmSucc = function searchPetInfo(result) {
                if (result.rowLength < 1) {
                    Swal.fire({
                        icon: 'error',
                        title: '검색 실패!',
                        text: '검색 결과 "' + inputValue + '"는 조회되지 않습니다.',
                    });
                    return;
                }
                $('#neuteredRadio').css("display", "table-cell");
                for (let i = 0; i < result.rowLength; i++) {
                    let tableHtml =
                        `<tr onclick='petInfoLoad("${result.rows[i].pet_id}")'>` +
                        `<td>` + result.rows[i].pet_name + "</td>" +
                        '<td>' + result.rows[i].p_user_name + '</td>' +
                        '<td>' + result.rows[i].p_phone_first + '-' + result.rows[i].p_phone_middle + '-' + result.rows[i].p_phone_last + '</td>' +
                        '</tr>';
                    $('#search-modal-table > tbody').append(tableHtml);
                }
                $('#select-patient-modal').appendTo("body").modal('show');


            },
            cmmErr = null;
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    }
};

// 나이 계산 함수
function calculateAge(yearOfBirth) {
    var currentYear = new Date().getFullYear();
    var age = currentYear - yearOfBirth;
    return age;
}


// 환자 및 보호자 정보 불러오기(검색 목록 클릭하여)
function petInfoLoad(petId) {
    petIdModify = petId;
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/petInfoLoad',
        cmmReqDataObj = {
            petId: petId,
            h_adminCode: h_adminCode
        },
        cmmAsync = false,

        cmmSucc = function petInfoLoad(result) {

            $("#petName").text(result.rows[0].pet_name);
            $("#petNumber").text(result.rows[0].pet_code);
            $("#petAge").text(calculateAge(result.rows[0].pet_byear));
            $("#petGender").text(result.rows[0].pet_gender);
            $("#petKind").text(result.rows[0].pet_breed);
            $("#petWeightInput").val(result.rows[0].pet_weight + ' kg');
            $("#patient-note").val(result.rows[0].pet_note);
            $("#protectorName").text(result.rows[0].p_user_name);
            $("#protectorPhone").text(result.rows[0].p_phone_first + '-' + result.rows[0].p_phone_middle + '-' + result.rows[0].p_phone_last);
            diagnosis_Records(petIdModify)
            diagnosis_detail(start_medi_num)
            select_bioinfo()


            if (result.rows[0].pet_isNeutering == 'N') {
                document.getElementById("neuteredRadioN").checked = true;
            } else {
                document.getElementById("neuteredRadioY").checked = true;
            }
            $('#select-patient-modal').appendTo("body").modal('hide');

            piN = $('input[name=inlineRadioOptions]:checked').val();
            pW = $('#petWeightInput').val();
            pN = $('#patient-note').val();

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};




// 환자 및 보호자 정보 수정하기.
function petInfoModify(petIdModify) {
    if ($("#petName").text() != '') {

    } else {
        return;
    }

    var isNeutering = $('input[name=inlineRadioOptions]:checked').val();
    let petWeigt = $('#petWeightInput').val();
    petWeigt = petWeigt.replace('kg', '');
    if(petWeigt == ""){
        Swal.fire({
            icon: 'error',
            title: '수정 실패',
            text: '몸무게를 입력해 주세요.',
        });
        return;
    }else if(petWeigt >= 1000 || !/^(\d*\.\d{1})$/.test(petWeigt)){
        Swal.fire({
            icon: 'error',
            title: '수정 실패',
            text: '몸무게는 3자리 이하, 소수 첫째자리까지 입력해 주세요.',
        });
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/petInfoModify',
        cmmReqDataObj = {
            petId: petIdModify,
            pet_isNeutering: isNeutering,
            pet_weight: $("#petWeightInput").val(),
            pet_note: $("#patient-note").val(),
            piN: piN,
            pW: pW,
            pN: pN
        },
        cmmAsync = false,
        cmmSucc = function petInfoModify(result) {
            if (result == "F") {
                Swal.fire({
                    icon: 'error',
                    title: '수정 실패',
                    text: '수정된 값이 없습니다.',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '수정 완료',
                    text: '수정되었습니다.',
                });
                piN = isNeutering;
                pW = $('#petWeightInput').val();
                pN = $('#patient-note').val();
            }

            petInfoLoad(petIdModify)

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};


// ==================================================================================================================================================
// ================================================================= 진료 내역 ======================================================================


// 진료내역 조회
function diagnosis_Records(petIdModify) {

    // daterange 기간 가져오기
    var dateRange = $('#rangeDate_diagnosis').val()
    var dates = dateRange.split(" - ");
    var startDate = dates[0];
    var endDate = dates[1];
    // 검색창의 입력값 가져오기
    let inputElement = document.getElementById("searchWord2");
    let inputValue = inputElement.value;

    $('#record-table > tbody').empty();

    if (inputValue.length == 0) {
        inputValue = "total";
    }
    if (petIdModify) { } else {
        Swal.fire({
            icon: 'error',
            title: '등록 실패!',
            text: '환자를 먼저 검색해주세요.',
        });
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_Records',
        cmmReqDataObj = {
            h_adminCode: h_adminCode,
            startDate: startDate,
            endDate: endDate,
            name: inputValue,
            petId: petIdModify
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_Records(result) {
            start_medi_num = result.rows[0].medi_num;
            for (let i = 0; i < result.rowLength; i++) {
                let tableHtml =
                    `<tr>` +
                    `<td>` + result.rows[i].medi_created_time + "</td>" +
                    '<td>' + result.rows[i].medi_purpose + '</td>' +
                    '<td>' + result.rows[i].doctorName + '</td>' +
                    '<td>' + `<button onclick='diagnosis_detail("${result.rows[i].medi_num}")'  class="btn btn-secondary">확인</button>` + '</td>' +
                    '</tr>';
                $('#record-table > tbody').append(tableHtml);



            }



        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 진료 내역 검색
$("#searchBtn2").click(function () {
    diagnosis_Records(petIdModify)

});

// 진료 기록 클릭 시 진료의 목록 불러오기

$("#recordBtn").click(function () {

    diagnosis_regist_doctorList()
});

// 진료 기록에 등록버튼!

$("#addRecordBtn").click(function () {
    diagnosis_regist()

});

// 진료기록 진료의 목록 불러오기
function diagnosis_regist_doctorList() {
    $('#select-doctor').empty();

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_regist_doctorList',
        cmmReqDataObj = {
            h_adminCode: h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_regist_doctorList(result) {
            let selectHtml;
            selectHtml =
                `<option>` + '선택 ▼' + `</option>`;
            $('#select-doctor').append(selectHtml);
            for (let i = 0; i < result.rowLength; i++) {
                selectHtml =
                    `<option>` + result.rows[i].h_staff_name + "(" + result.rows[i].h_staff_eid + ")" + `</option>`;
                $('#select-doctor').append(selectHtml);
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}



// 진료기록 등록하기
function diagnosis_regist() {


    if ($('#select-doctor').val() == '선택 ▼') {
        Swal.fire({
            icon: 'error',
            title: '등록 실패!',
            text: '진료의를 선택해주세요!',
        });
        return;
    }
    if ($('#record-detail').val() == '') {
        Swal.fire({
            icon: 'error',
            title: '등록 실패!',
            text: '진료 내용을 작성해주세요!',
        });
        return;
    }
    if (petIdModify) { } else {
        Swal.fire({
            icon: 'error',
            title: '등록 실패!',
            text: '환자를 먼저 검색해주세요.',
        });
        return;
    }
    $('#addRecordBtn').attr('data-dismiss', 'modal');

    var selectElement = document.getElementById("select-purpose");
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_regist',
        cmmReqDataObj = {
            h_user_code: h_adminCode,
            medi_purpose: selectElement.selectedIndex,
            medi_contents: $('#record-detail').val(),
            h_staff_name: $('#select-doctor').val(),
            petId: petIdModify,
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_regist(result) {
            if (result.succ == 1) {
                Swal.fire({
                    icon: 'success',
                    title: '등록 완료!',
                    text: '진료가 기록되었습니다.',
                });
                $('#record-add-modal').appendTo("body").modal('hide');
                $('#record-detail').val("");
            }
            diagnosis_Records(petIdModify);
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}





// ===================================================================== 진료 내용 =================================================================
function diagnosis_detail(medi_num) {
    var selectElement = document.getElementById("recordPurpose");
    var textareaElement = document.getElementById("recordDetail");

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_detail',
        cmmReqDataObj = {
            medi_num: medi_num
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_detail(result) {
            modify_medi_num = medi_num;
            $("#recordDate").val(result.rows[0].medi_created_time);
            $("#recordDoctor").val(result.rows[0].doctorName);
            $("#recordPurpose").val(result.rows[0].medi_purpose);
            selectElement.selectedIndex = result.rows[0].medi_purpose;
            textareaElement.value = result.rows[0].medi_contents;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};


//  진료 내용 수정
$("#editRecordBtn").click(function () {
    diagnosis_detail_modify(modify_medi_num)
    diagnosis_Records(petIdModify)

});

// 진료 내용 수정

function diagnosis_detail_modify(modify_medi_num) {

    if ($('#recordDetail').val() == '') {
        Swal.fire({
            icon: 'error',
            title: '수정 실패!',
            text: '진료 내용을 작성해주세요!',
        });
        return;
    }
    var selectElement = document.getElementById("recordPurpose");
    // var textareaElement = document.getElementById("recordDetail");

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_detail_modify',
        cmmReqDataObj = {
            date: $("#recordDate").val(),
            purpose: selectElement.selectedIndex,
            contents: $('#recordDetail').val(),
            medi_num: modify_medi_num
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_detail_modify(result) {
            Swal.fire({
                title: '',
                text: "진료 기록을 수정하시겠습니까?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: '수정 완료',
                        text: '진료 기록이 수정되었습니다.'
                    })
                }
            })
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 진료 내용 삭제

function diagnosis_detail_delete(modify_medi_num) {

    var selectElement = document.getElementById("recordPurpose");
    // var textareaElement = document.getElementById("recordDetail");

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/diagnosis_detail_delete',
        cmmReqDataObj = {
            medi_num: modify_medi_num
        },
        cmmAsync = false,
        cmmSucc = function diagnosis_detail_delete(result) {
            Swal.fire({
                title: '정말 삭제 하시겠습니까?',
                text: "다시 되돌릴 수 없습니다. 신중하세요.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '삭제',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: '삭제 완료',
                        text: '진료 기록이 삭제되었습니다.'
                    })
                }
            })
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};
//  진료 내용 삭제
$("#deleteRecordBtn").click(function () {
    diagnosis_detail_delete(modify_medi_num)
    diagnosis_Records(petIdModify)
});


//  ================================================================ 최근 생체정보 =============================================================================

// 생체정보 조회
function select_bioinfo() {

    // daterange 기간 가져오기
    var dateRange = $('#rangeDate').val()
    var dates = dateRange.split(" - ");
    var startDate = dates[0];
    var endDate = dates[1];

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/select_bioinfo',
        cmmReqDataObj = {
            startDate: startDate,
            endDate: endDate,
            petId: petIdModify
        },
        cmmAsync = false,
        cmmSucc = function select_bioinfo(result) {

            $('#recentInfo-table > tbody').empty();
            $('#recentInfo-table > thead').css("display", "");
            for (let i = 0; i < result.rowLength; i++) {
                let tableHtml =
                    `<tr>` +
                    `<td>` + result.rows[i].created_time + "</td>" +
                    '<td>' + result.rows[i].predict_glucose + '</td>' +
                    '<td>' + result.rows[i].predict_high_pressure + '</td>' +
                    '<td>' + result.rows[i].predict_low_pressure + '</td>' +
                    '<td>' + result.rows[i].hr_avg + '</td>' +
                    '<td>' + result.rows[i].hrv_avg + '</td>' +
                    '<td>' + `<button onclick='bioInfo_detail("${result.rows[i].pd_num}")'  class="btn btn-secondary">확인</button>` + '</td>' +
                    '</tr>';
                $('#recentInfo-table > tbody').append(tableHtml);
            }



        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 생체정보 세부내용
function bioInfo_detail(pd_num) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/bioInfo_detail',
        cmmReqDataObj = {
            pd_num: pd_num
        },
        cmmAsync = false,
        cmmSucc = function bioInfo_detail(result) {
            $('#bioInfo-modal-table > tbody').empty();
            $('#bioInfoDate').text(result.rows[0].created_time);
            let tableHtml =
                `<tr> <td>혈당</td>` +
                `<td>` + result.rows[0].predict_glucose + "</td> </tr>" +
                `<tr> <td>최고혈압</td>` +
                '<td>' + result.rows[0].predict_high_pressure + '</td> </tr>' +
                `<tr> <td>최저혈압</td>` +
                '<td>' + result.rows[0].predict_low_pressure + '</td> </tr>' +
                `<tr> <td>HR</td>` +
                '<td>' + result.rows[0].hr_avg + '</td> </tr>' +
                `<tr> <td>HRV</td>` +
                '<td>' + result.rows[0].hrv_avg + '</td> </tr>' +
                `<tr> <td>RMSSD</td>` +
                '<td>' + result.rows[0].rmssd + '</td> </tr>' +
                `<tr> <td>SDNN</td>` +
                '<td>' + result.rows[0].sdnn + '</td> </tr>' +
                `<tr> <td>PNN50</td>` +
                '<td>' + result.rows[0].pnn50 + '</td> </tr>'
            $('#bioInfo-modal-table > tbody').append(tableHtml);
            $('#bioInfo-detail-modal').modal('show');
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 조회 버튼
$('#recentSearchBtn').click(function () {
    $('#recentInfo-table').css("display", "");
    $('#hrChart').css("display", "None");
    class_num = 0;
    select_bioinfo()
})
// 표 버튼
$('#tableBtn').click(function () {
    $('#recentInfo-table').css("display", "");
    $('#hrChart').css("display", "None");
    class_num = 0;
    select_bioinfo()

})
// 그래프 버튼
$('#graphBtn').click(function () {
    class_num = 1;
    draw_chart()

})


function draw_chart() {
    var dateRange = $('#rangeDate').val()
    var dates = dateRange.split(" - ");
    var startDate = dates[0];
    var endDate = dates[1];
    if (petIdModify) {

    } else {
        Swal.fire({
            icon: 'error',
            title: '검색 실패!',
            text: '환자를 먼저 검색해주세요!',
        });
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/patient/draw_chart',
        cmmReqDataObj = {
            startDate: startDate,
            endDate: endDate,
            petId: petIdModify
        },
        cmmAsync = false,
        cmmSucc = function draw_chart(result) {

            //  차트 그리기
            // Get the chart canvas element
            let ctx = document.getElementById('hrChart').getContext('2d');
            let chartExists = typeof hrChart !== 'undefined';

            // If an existing chart exists, destroy it
            if (chartExists) {
                hrChart.destroy();
            }
            let dateLabels = [];
            let HR = [];
            let newChartData = [];
            for (let i = 0; i < result.rowLength; i++) {
                dateLabels.push(result.rows[i].created_time);
                HR.push(result.rows[i].hr_avg);
                newChartData.push(result.rows[i].predict_glucose);

            }
            let maxRepresentatives = 10;

            // 데이터 라벨에서 대표로 몇개를 선정할지 계산
            let step = Math.ceil(dateLabels.length / maxRepresentatives);

            // Select representative dates using the calculated step size
            let representativeDates = dateLabels.filter((_, index) => index % step === 0);

            // Define the data for the chart
            let data = {
                labels: dateLabels,
                datasets: [{
                    label: 'HR 그래프',
                    data: HR,
                    borderColor: 'blue',
                    fill: false,
                    yAxisID: 'y-axis-1' // Assign the heart rate dataset to the primary y-axis
                }, {
                    label: '혈당 그래프',
                    data: newChartData,
                    borderColor: 'green',
                    fill: false
                    // ,
                    // yAxisID: 'y-axis-2' // Assign the new chart dataset to the secondary y-axis
                }]
            };

            // Configure the chart options
            let options = {
                responsive: true,
                scales: {
                    y: {
                        display: false
                    }
                }
            };


            // Create the chart
            hrChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
            $('#hrChart').css("display", "");
            $('#recentInfo-table').css("display", "None");


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}


$('#rangeDate').daterangepicker();

// 1주일 조회
$('#weekBtn').on('click', function() {
  $('#rangeDate').data('daterangepicker').setStartDate(moment().subtract(1, 'weeks'));
  $('#rangeDate').data('daterangepicker').setEndDate(moment());
  if (class_num == 0) {
    select_bioinfo();
} else {
    draw_chart()
}
});

// 1개월 조회
$('#monthBtn').on('click', function() {
  $('#rangeDate').data('daterangepicker').setStartDate(moment().subtract(1, 'months'));
  $('#rangeDate').data('daterangepicker').setEndDate(moment());
  if (class_num == 0) {
    select_bioinfo();
} else {
    draw_chart()
}
});

// 1년 조회
$('#yearBtn').on('click', function() {
    $('#rangeDate').data('daterangepicker').setStartDate(moment().subtract(1, 'years'));
    $('#rangeDate').data('daterangepicker').setEndDate(moment());
    if (class_num == 0) {
        select_bioinfo();
    } else {
        draw_chart()
    }
  });
