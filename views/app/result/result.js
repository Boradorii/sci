/*===============================================*/
/* global variable area                          */
/*===============================================*/

let dateFormat = 'YYYY-MM-DD',
    todayStr = moment().format(dateFormat),
    endDate = moment(todayStr).subtract(30, 'days').format(dateFormat),
    visitOk;  // init_날짜 설정 시 onChange 중복 이벤트 방지 변수

const $tab = $('[role="tab"]'); // 일간/월간 탭,

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

/*===============================================*/
/* init                                          */
/*===============================================*/
function Avg(list){
    let Avg = average(list)
    return Avg
}

let init = function() {
    if(lang=='zh'){
        lang = 'zh-CN';
    }

    $("#monthly-datepicker").datepicker({
        format: "yyyy-mm",
        viewMode: "months", 
        minViewMode: "months",
        currentDate: todayStr ,
        autoclose: true,
        language: lang
    });

    visitOk = true; // drawChart 중복 이벤트 방지
    $("#monthly-datepicker").datepicker('setDate', moment().format("YYYY-MM")); // 월간 날짜 초기화

    let dataSettings = {};
    dataSettings.startDate = todayStr;
    dataSettings.endDate = endDate;
    dataSettings.mode = 'daily';

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/result/data',
        cmmReqDataObj = {
            userCode: userCode,
            accessToken: accessToken,
            lang: lang,
            settings: dataSettings
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            if (result.dataArray.rowLength<1) {
                $("#daily-div").empty();
                $(".health-content").css('display','none');
                $(".empty-notice").css('display','block');
                $("#li-daily-area").empty();
                $("#li-monthly-area").empty();
            } else {
                $(".health-content").css('display','block');
                $(".empty-notice").css('display','none');
                drawChart(result, dataSettings.mode);
                AnalysisContents(result, dataSettings.mode);
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr); 
};

/*===============================================*/
/* event handler area                            */
/*===============================================*/

// 탭 선택 이벤트
$($tab).on('click', function(event) {
    showTabContents(event.currentTarget.id);
});

// 날짜 선택 이벤트
$($("#monthly-datepicker")).on('change', function() {
    if(!visitOk){
        let dataSettings = {};
        dataSettings.startDate = $("#monthly-datepicker").val();
        dataSettings.mode = 'monthly';

        getChart(userCode, dataSettings);
    }else{
        visitOk=false;
    }
   
});

/*===============================================*/
/* function area                                 */
/*===============================================*/

// 탭 정보 설정 함수 tabId= 'daily' or 'monthly'
function showTabContents(tabId) {
    switch (tabId) {
        case 'tab-daily':
            {
                let dataSettings = {};
                dataSettings.startDate = todayStr;
                dataSettings.endDate = endDate;
                dataSettings.mode = 'daily';

                getChart(userCode, dataSettings);
                break;
            }
        case 'tab-monthly':
            {
                visitOk=true;   // drawChart 중복 이벤트 방지
                $("#monthly-datepicker").datepicker('setDate', moment().format("YYYY-MM")); // 월간 날짜 초기화

                let dataSettings = {};
                dataSettings.startDate = moment($("#monthly-datepicker").val()).format('YYYY-MM');
                dataSettings.mode = 'monthly';

                getChart(userCode, dataSettings);
                break;
            }
    }
    return;
}

//차트 데이터 가져오기(ajax)
function getChart(userCode, dataSettings) {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/result/data',
        cmmReqDataObj = {
            userCode: userCode,
            accessToken: accessToken,
            lang: lang,
            settings: dataSettings
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            if (result.dataArray.rowLength<1) {
                Swal.fire({
                    title: NoData2,
                    html: NoDataInDate,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2500
                });
                if(dataSettings.mode=='daily'){
                    $("#daily-div").empty();
                }else{
                    $("#monthly-div").empty();
                }
                $(".health-content").css('display','none');
                $(".empty-notice").css('display','block');
                $("#li-daily-area").empty();
                $("#li-monthly-area").empty();
                $("#health-daily-area").css('display','none');
                $("#health-monthly-area").css('display','none');

            } else {
                $(".health-content").css('display','block');
                $(".empty-notice").css('display','none');
                $("#health-daily-area").css('display','none');
                $("#health-monthly-area").css('display','none');
                drawChart(result, dataSettings.mode);
                AnalysisContents(result, dataSettings.mode)
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

//차트 그리기
function drawChart(result, mode){

    let dateStr = moment().format(dateFormat);
    let datasets = [];  // chart data
    let dateArr = [];   // cahrt lable
    let cTimeArr = [];  //DB-created_time
    let hIndexArr = []; //DB-health_index
    let hChart, index;

    for(let i=0; i<result.dataArray.rowLength; i++){   //DB 날짜 Array 세팅
        hIndexArr[i] = result.dataArray.rows[i].health_index;
        cTimeArr[i] = result.dataArray.rows[i].c_time;
    }

    switch (mode) {
        case 'daily':
            {
                // 건강 조언 css
                $("#health-daily-area").css('display','block');

                //canvas 추가
                $("#daily-div").empty();
                $("#daily-div").append('&nbsp;<img src="/images/icon/green.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">좋음&nbsp;</span>');
                $("#daily-div").append('<img src="/images/icon/orange.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">보통&nbsp;</span>');
                $("#daily-div").append('<img src="/images/icon/red.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">나쁨</span><br><br>');
                $("#daily-div").append('<canvas id="daily-canvas" height="300px" width="400px"></canvas>');
                hChart = $("#daily-canvas");

                for(let i=29; i>=0; i--){    //날짜 Array 세팅
                    dateStr = moment(dateStr).subtract('1', 'day').format(dateFormat);
                    dateArr[i] = dateStr;
                }

                dateArr = [];
                dateStr = moment().format(dateFormat);

                for(let i=29; i>=0; i--){    //날짜 Array 세팅
                    dateStr = moment(dateStr).subtract('1', 'day').format("MM-DD");
                    dateArr[i] = dateStr;
                }

                break;
            }
        case 'monthly':
            {
                // 건강 조언 css
                $("#health-monthly-area").css('display','block');
                //canvas 추가
                $("#monthly-div").empty();
                $("#monthly-div").append('&nbsp;<img src="/images/icon/green.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">좋음&nbsp;</span>');
                $("#monthly-div").append('<img src="/images/icon/orange.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">보통&nbsp;</span>');
                $("#monthly-div").append('<img src="/images/icon/red.png" width="13px" alt="">&nbsp;<span style="font-size:13pt; font-weight:500;">나쁨</span><br><br>');
                $("#monthly-div").append('<canvas id="monthly-canvas" height="300px" width="400px"></canvas>');
                hChart = $("#monthly-canvas");

                let monthlyStr= moment($("#monthly-datepicker").val()).format("YYYY-MM-DD");
                let endDate = moment(monthlyStr).endOf('month').format('D');   //월 마지막 날짜 구하기

                for(let i=endDate-1; i>=0; i--){    //날짜 Array 세팅
                    dateStr = moment(monthlyStr).add(i, 'day').format(dateFormat);
                    dateArr[i] = dateStr;
                }


                for(let i=endDate-1; i>=0; i--){    //날짜 Array 세팅
                    dateStr = moment(monthlyStr).add(i, 'day').format("MM-DD");
                    dateArr[i] = dateStr;
                }

                break;
            }
    }
    
    const myChart = new Chart(hChart, {
        type:'line',
        data:{
            labels:cTimeArr,
            datasets:[{
                label: HealthIndex,
                data: hIndexArr,
                borderColor: "rgba(0, 111, 201, 1)",
                backgroundColor: "rgba(0, 111, 201, 0.8)",
                fill: false,
                borderWidth: 1,
                fontSize:15
            }]
        },
        options: {
            responsive:true,
            tooltips:{
                mode:'index',
                intersect:false,
            },
            scales:{
                xAxes: [{
                    ticks: {
                        fontSize:16
                    }
                }],
                yAxes: [{
                    ticks: {
                        min:0,
                        max:100,
                        fontSize:16
                    }
                }]
            },
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 40,
                        borderColor: 'rgba(232, 63, 48, 1)',
                        borderWidth: 1,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    },
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 80,
                        borderColor: 'rgba(251, 201, 62, 1)',
                        borderWidth: 1,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    },
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 99.5,
                        borderColor: 'rgba(142, 196, 62, 1)',
                        borderWidth: 1,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    },
                    {
                        type: 'box',
                        mode: 'horizontal',
                        yScaleID: 'y-axis-0',
                        yMin:0,
                        yMax:40,
                        borderColor: 'rgba(0,0,0,0)',
                        backgroundColor: 'rgba(232, 63, 48, 0.22)',
                        borderWidth: 2,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    },
                    {
                        type: 'box',
                        mode: 'horizontal',
                        yScaleID: 'y-axis-0',
                        yMin:40,
                        yMax:80,
                        borderColor: 'rgba(0,0,0,0)',
                        backgroundColor: 'rgba(251, 201, 62, 0.22)',
                        borderWidth: 2,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    },
                    {
                        type: 'box',
                        mode: 'horizontal',
                        yScaleID: 'y-axis-0',
                        yMin:80,
                        yMax:100,
                        borderColor: 'rgba(0,0,0,0)',
                        backgroundColor: 'rgba(142, 196, 62, 0.22)',
                        borderWidth: 2,
                        label: {
                            enabled: false,
                            backgroundColor: "rgba(0,0,0,0)",
                        }
                    }
                ]
            },
            legend: {   //label display
                display: false
            }
        }
    }); 
}


function AnalysisContents(result, mode){
    let hr_list = [], normal_list = [], glucose_list = [], pressure_list = [], health_list = []
    for(let i = 0; i < result.dataArray.rowLength; i++){
        hr_list.push(parseInt(result.dataArray.rows[i].hr))
        normal_list.push(parseInt(result.dataArray.rows[i].af_normal))
        glucose_list.push(parseInt(result.dataArray.rows[i].predict_glucose))
        pressure_list.push(parseInt(result.dataArray.rows[i].predict_high_pressure))
        health_list.push(parseInt(result.dataArray.rows[i].health_index))
    }


    let hr = parseInt(average(hr_list));
    let af_normal = parseInt(average(normal_list))
    let glucose_index = parseInt(average(glucose_list))
    let high_pressure_index = parseInt(average(pressure_list))
    let health_index = parseInt(average(health_list))


    let exercise_check = 'N'
    let hospital_check = 'N'
    let salinity_check = 'N'

    $('#health-daily-area').empty()
    $('#health-monthly-area').empty()
    let liAreaHtml = ""

    let num;
    if(mode=='daily'){
        num = 1;
    }else{
        num = 2;
    }
    if(health_index > 90){
        liAreaHtml += "<li>" + HealthAlert1 + "</li>"
    }
    else if(health_index > 80){
        liAreaHtml += "<li>" + HealthAlert2 + "</li>"
    }
    else if(health_index > 40){
        liAreaHtml += "<li>" + HealthAlert3 + "</li>"
        exercise_check = 'Y'
    }
    else if(health_index >= 0){
        liAreaHtml += "<li>" + HealthAlert4 + "</li>"
        hospital_check = 'Y'
    }

    if(hr < 30){
        liAreaHtml += "<li>" + SleepAlert1 + "</li>"
    }
    else if(hr < 50){
        liAreaHtml += "<li>" + SleepAlert2 + "</li>"
    }
    else if(hr < 70){
        liAreaHtml += "<li>" + SleepAlert3 + "</li>"
    }

    if(af_normal >= 0.8){
        liAreaHtml += "<li>" + StressAlert1 + "</li>"
    }
    else if(af_normal >= 0.6){
        liAreaHtml += "<li>" + StressAlert2 + "</li>"
    }
    else if(af_normal >= 0.3){
        liAreaHtml += "<li>" + StressAlert3 + "</li>"
    }
    else if(af_normal >= 0){
        liAreaHtml += "<li>" + StressAlert4 + "</li>"
    }
    if(glucose_index > 100 || high_pressure_index > 120){
        if(glucose_index >= 120){
            if(hospital_check == 'N'){
                liAreaHtml += "<li>" + HospitalAlert1 + "</li>"
                liAreaHtml += "<li>" + HospitalAlert2 + "</li>"
                hospital_check = 'Y'
            }
            if(exercise_check == 'N'){
                liAreaHtml += "<li>" + HospitalAlert3 + "</li>"
                exercise_check = 'Y'
            }
            liAreaHtml += "<li>" + GlucoseTest + "</li>"
        }
        else if(glucose_index >= 110){
            liAreaHtml += "<li>" + SugarAlert + "</li>"
            if(salinity_check == 'N'){
                liAreaHtml += "<li>" + SalinityAlert + "</li>"
                salinity_check = 'Y'
            }
            
        }
        else if(glucose_index >= 100){
            liAreaHtml += "<li>" + FoodAlert1 + "</li>"
            liAreaHtml += "<li>" + FoodAlert12+ "</li>"
        }


        if(high_pressure_index >= 140){
            if(hospital_check == 'N'){
                liAreaHtml += "<li>" + HospitalAlert1 + "</li>"
                liAreaHtml += "<li>" + HospitalAlert2 + "</li>"
                hospital_check = 'Y'
            }
            if(exercise_check == 'N'){
                liAreaHtml += "<li>" + HospitalAlert3 + "</li>"
                exercise_check = 'Y'
            }
            liAreaHtml += "<li>" + PressureTest + "</li>"
        }
        else if(high_pressure_index >= 130){
            if(salinity_check == 'N'){
                liAreaHtml += "<li>" + SalinityAlert + "</li>"
                salinity_check = 'Y'
            }
        }
        else if(high_pressure_index >= 120){
            liAreaHtml += "<li>" + WeightAlert + "</li>"
        }
        if(mode == "daily"){
            $('#health-daily-area').append(liAreaHtml)    
        }
        else if(mode == "monthly"){
            $('#health-monthly-area').append(liAreaHtml)
        }
    }
}
