const $datePicker = $('#biometric-datepicker'); // 날짜 선택 입력란

// 좋음, 보통, 나쁨 아이콘 ID값
const $hrIcon = $("#hr-val-icon");  //심박수 상태 아이콘
const $glucoseIcon = $("#glucose-val-icon");  //수면품질 상태 아이콘
const $stressIcon = $("#stress-val-icon");  //스트레스 상태 아이콘

let dateFormat = 'YYYY-MM-DD',
    todayStr = moment(new Date()).format(dateFormat);

// // ⓘ 버튼 안내 메시지
// setTimeout(function () {
//     $("#click-alert").fadeOut();
// }, 2000);

// 날짜 선택 이벤트
$datePicker.on('change', function () {
    getData(userCode, $datePicker.val());
});

// ⓘ 버튼 클릭 이벤트
$("#real-time-info").on('click', function () {
    $("#real-time-modal").modal();
});
$("#health-state-info").on('click', function () {
    $("#health-state-modal").modal();
});
$("#hr-info").on('click', function () {
    $("#hr-modal").modal();
});
$("#arrhythmia-info").on('click', function () {
    $("#arrhythmia-modal").modal();
});
$("#bloodSugar-info").on('click', function () {
    $("#bloodSugar-modal").modal();
});
$("#bloodPressure-info").on('click', function () {
    $("#bloodPressure-modal").modal();
});
$("#health-info").on('click', function () {
    $("#health-modal").modal();
});

$("#sensor-info").on('click', function (e) {
    e.stopPropagation();
    $("#sensor-modal").modal();
});

async function init() {

    $('#sensorActiveDiv').empty();
    let sensorActiveHtml = ''
    if (SensorActive == 0) {
        sensorActiveHtml = '<img id="sensor-icon" src="/images/icon/red.png" width="7%" alt=""><span class="second_text">&nbsp;' + NotConnected + '</span>'
        $('#real_hr_value').text("- BPM")
    }
    else {
        sensorActiveHtml = '<img id="sensor-icon" src="/images/icon/green.png" width="7%" alt=""><span class="second_text">&nbsp;' + Connecting + '</span>'
        $('#real_hr_value').text(HrActive + " BPM")
    }
    $('#sensorActiveDiv').append(sensorActiveHtml)

    // MAterial Date picker setting
    $datePicker.bootstrapMaterialDatePicker({
        weekStart: 0,
        time: false,
        format: 'YYYY-MM-DD',
        currentDate: todayStr,
        maxDate: todayStr,
        lang: lang
    });

    // // ⓘ 버튼 안내 메시지
    // setTimeout(function () {
    //     $("#click-alert").fadeOut();
    // }, 2000);

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/home/data',
        cmmReqDataObj = {
            userCode: userCode,
            selectDay: $datePicker.val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            setData(result);
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}



// 건강정보 데이터 가져오기
function getData(userCode, selectDay) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/home/data',
        cmmReqDataObj = {
            userCode: userCode,
            selectDay: selectDay
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            if (result.rowLength==0) {
                Swal.fire({
                    title: NoData,
                    html: NoDataInDate,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2500,
                    willClose: function () {
                        // ⓘ 버튼 안내 메시지
                        setTimeout(function () {
                            $("#click-alert").fadeOut();
                        }, 2000);
                    }
                });
                setData(result);
            } else {
                setData(result);
                // ⓘ 버튼 안내 메시지
                setTimeout(function () {
                    $("#click-alert").fadeOut();
                }, 2000);
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

// 데이터 세팅
function setData(result) {
    let hr;
    let af_brachial;
    let af_normal;
    let af_tachycardia;
    let health_index;
    let glucose_index;
    let high_pressure_index;
    let low_pressure_index;
    let data;

    if(result.rowLength == 0){
        hr = "-";
        af_brachial = "-";
        af_normal = "-";
        af_tachycardia = "-";
        health_index = "-";
        glucose_index = "-";
        high_pressure_index = "-";
        low_pressure_index = "-";
        data = 0;
    }else{
        hr = parseInt(result.rows[0].hr);
        af_brachial = (result.rows[0].af_brachial);
        af_normal = (result.rows[0].af_normal);
        af_tachycardia = (result.rows[0].af_tachycardia);
        health_index = parseInt(result.rows[0].health_index);
        glucose_index = parseInt(result.rows[0].predict_glucose);
        high_pressure_index = parseInt(result.rows[0].predict_high_pressure);
        low_pressure_index = parseInt(result.rows[0].predict_low_pressure);
        data = health_index; 
    }
    if (result.rowLength != 0) {
        $(".hr_value").text(hr);             //심박수
        $(".tachycardia_value").text(af_tachycardia);             //빈맥
        $(".normal_rate_value").text(af_normal);             //정상
        $(".bradycardia_value").text(af_brachial);             //서맥
        $(".rate_value").text("빈맥 : "+af_tachycardia+"|정상 : "+af_normal+"|서맥 : "+af_brachial);
        $(".glucose_value").text(glucose_index);          //혈당
        $(".bloodSugar_value").text(glucose_index);          
        $(".pressure_high_value").text(high_pressure_index);          //최고혈압
        $(".pressure_low_value").text(low_pressure_index);          //최저혈압
        $(".bloodPressure_value").text(high_pressure_index+"/"+low_pressure_index);          // 최고혈압/최저혈압
        $("#health_index_value").text(health_index);   //건강지수
        $("#glucose-val-icon").css("display", "none");    //혈당 아이콘 세팅
        $("#bloodPressure-val-icon").css("display", "none");   //혈압 아이콘 세팅
        $("#healthIndex-val-icon").css("display", "none");
        $("#triangle_icon").css("display", "none");
        $("#health_trend_value").css("color", "black");
        $('#li-area').empty();
        $("#health-info-area").css('display', 'none');
        
    } else {
        $("#health-info-area").css('display', 'block');
        $("#triangle_icon").css("display", "block");
        //$("#real_hr_value").text();
        $(".hr_value").text(hr);             //심박수
        $(".tachycardia_value").text(af_tachycardia);             //빈맥
        $(".normal_rate_value").text(af_normal);             //정상
        $(".bradycardia_value").text(af_brachial);             //서맥
        $(".rate_value").text("빈맥 : "+af_tachycardia+"|정상 : "+af_normal+"|서맥 : "+af_brachial);
        $(".glucose_value").text(glucose_index);          //혈당
        $(".bloodSugar_value").text(glucose_index);          
        $(".pressure_high_value").text(high_pressure_index);          //최고혈압
        $(".pressure_low_value").text(low_pressure_index);          //최저혈압
        $(".bloodPressure_value").text(high_pressure_index+"/"+low_pressure_index);          // 최고혈압/최저혈압

        
        if (af_normal >= 0.8) {
            $("#hr_img").attr('src', "/images/icon/happy.png");
            $("#hr_info").text(StressAlert1);
        }
        else if (af_normal >= 0.6) {
            $("#hr_img").attr('src', "/images/icon/yoga.png");
            $("#hr_info").text(StressAlert2);
        }
        else if (af_normal >= 0.3) {
            $("#hr_img").attr('src', "/images/icon/exercise.png");
            $("#hr_info").text(StressAlert3);
        }
        else if (af_normal >= 0) {
            $("#hr_img").attr('src', "/images/icon/doctor.png");
            $("#hr_info").text(StressAlert4);
        }

        if (glucose_index > 50 && glucose_index < 100) {
            $("#glucose-val-icon").attr('src', "/images/icon/green.png");
        }else if (glucose_index < 120) {
            $("#glucose-val-icon").attr('src', "/images/icon/orange.png");
        }else if (glucose_index < 300) {
            $("#glucose-val-icon").attr('src', "/images/icon/red.png");
        }else {
            $("#glucose-val-icon").attr('src', "/images/icon/doctor.png");
        }

        let healthIndexP = health_index - 4 + "%"

        if (health_index >= 81) { // 범위 세분화 필요
            $("#healthIndex-val-icon").attr("src", "/images/icon/green.png");
            $("#triangle_icon").css("left", healthIndexP);
        } else if (health_index >= 41 && health_index <= 80) {
            $("#healthIndex-val-icon").attr("src", "/images/icon/orange.png");
            $("#triangle_icon").css("left", healthIndexP);
        } else {
            $("#healthIndex-val-icon").attr("src", "/images/icon/red.png");
            $("#triangle_icon").css("left", healthIndexP);
        }

        let exercise_check = 'N'
        let hospital_check = 'N'
        let salinity_check = 'N'

        if (health_index > 90) {
            $("#health_index_img").attr('src', "/images/icon/health_index_good.png");
            $("#health_index_info").text(HealthAlert1);
        }
        else if (health_index > 80) {
            $("#health_index_img").attr('src', "/images/icon/health_index_good.png");
            $("#health_index_info").text(HealthAlert2);
        }
        else if (health_index > 40) {
            $("#health_index_img").attr('src', "/images/icon/diet.png");
            $("#health_index_info").text(HealthAlert3);
            exercise_check = 'Y'
        }
        else if (health_index >= 0) {
            $("#health_index_img").attr('src', "/images/icon/hospital.png");
            $("#health_index_info").text(HealthAlert4);
            hospital_check = 'Y'
        }

        $('#li-area').empty()
        let liAreaHtml = ""

        if (glucose_index > 100 || high_pressure_index > 120) {
            liAreaHtml += "<hr>"
            liAreaHtml += "<strong>" + HealthTips + "</strong>"
            liAreaHtml += "<ul>"

            if (glucose_index >= 120) {
                if (hospital_check == 'N') {
                    liAreaHtml += "<li>" + HospitalAlert1 + "</li>"
                    liAreaHtml += "<li>" + HospitalAlert2 + "</li>"
                    hospital_check = 'Y'
                }
                if (exercise_check == 'N') {
                    liAreaHtml += "<li>" + HospitalAlert3 + "</li>"
                    exercise_check = 'Y'
                }
                liAreaHtml += "<li>" + GlucoseTest + "</li>"
            }
            else if (glucose_index >= 110) {
                liAreaHtml += "<li>" + SugarAlert + "</li>"
                if (salinity_check == 'N') {
                    liAreaHtml += "<li>" + SalinityAlert + "</li>"
                    salinity_check = 'Y'
                }
            }
            else if (glucose_index >= 100) {
                liAreaHtml += "<li>" + FoodAlert1 + "</li>"
                liAreaHtml += "<li>" + FoodAlert2 + "</li>"
            }

            if (high_pressure_index >= 140) {
                if (hospital_check == 'N') {
                    liAreaHtml += "<li>" + HospitalAlert1 + "</li>"
                    liAreaHtml += "<li>" + HospitalAlert2 + "</li>"
                    hospital_check = 'Y'
                }
                if (exercise_check == 'N') {
                    liAreaHtml += "<li>" + HospitalAlert3 + "</li>"
                    exercise_check = 'Y'
                }
                liAreaHtml += "<li>" + PressureTest + "</li>"
            }
            else if (high_pressure_index >= 130) {
                if (salinity_check == 'N') {
                    liAreaHtml += "<li>" + SalinityAlert + "</li>"
                    salinity_check = 'Y'
                }
            }
            else if (high_pressure_index >= 120) {
                liAreaHtml += "<li>" + WeightAlert + "</li>"
            }
            liAreaHtml += "</ul>"
            $('#li-area').append(liAreaHtml)
        }
    }

    // 건강지수 그래프 그리기
    let liElements = document.querySelectorAll('.step_progress li');

    let colors = ['#ff4f36', '#ff4e3f', '#ff6a31', '#ff8a24', '#fead17', '#fece05', '#e0de10', '#b9dc1c', '#8fde2c', '#65db3b', '#36dd4e', '#1bd75c'];

    liElements.forEach(function (li, index) {
        let value = (index + 1) * (100 / liElements.length);
        let backgroundColor;

        if (value <= data) {
            backgroundColor = colors[index];
        } else {
            backgroundColor = '#d2d2d2';
        }

        li.style.backgroundColor = backgroundColor;

        if (value <= data) {
            li.classList.add('data_active');
        } else {
            li.classList.remove('data_active');
        }

        //$(".step_progress li.data_active:last").addClass("last-active");

    });
};
