$('#searchBtn').on('click', function() {
    searchPetInfo()
})

// 나이 계산 함수
function calculateAge(yearOfBirth) {
    var currentYear = new Date().getFullYear();
    var age = currentYear - yearOfBirth + 1;
    return age;
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
            cmmUrl = '/api/measure/searchPetInfo',
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
                        text: '검색 결과 "' + inputValue + '"은(는) 조회되지 않습니다.',
                    });
                    return;
                }
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


// 환자 및 보호자 정보 불러오기(검색 목록 클릭하여)
function petInfoLoad(petId) {
    petIdModify = petId;
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/measure/petInfoLoad',
        cmmReqDataObj = {
            petId: petId,
            h_adminCode: h_adminCode
        },
        cmmAsync = false,

        cmmSucc = function petInfoLoad(result) {
            $("#protector-name").val(result.rows[0].p_user_name);
            $("#patient-name").val(result.rows[0].pet_name);
            $("#patient-age").val(calculateAge(result.rows[0].pet_byear));
            $("#petGender").val(result.rows[0].pet_gender);
            $('#patient-weight').val(result.rows[0].pet_weight + "kg");
            $('#select-patient-modal').appendTo("body").modal('hide');
            pW = $('#patient-weight').val();

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

$('#measureBtn').on('click', function() {
    let protectorName = $("#protector-name").val();
    let patientName = $("#patient-name").val();
    let patientAge = $("#patient-age").val();
    let patientWeight = $("#patient-weight").val();

    if (protectorName && patientName && patientAge && patientWeight) {
        $('#measure-modal1').appendTo("body").modal('show');
    } else {
        errorSwal("문항을 모두 입력해주세요.")
    }
})

$('#cancleBtn').on('click', function() {
    $('#measure-modal1').appendTo("body").modal('hide');
});



$('#nextBtn').on('click', function() {
    $('#measure-modal1').appendTo("body").modal('hide');
    $('#measure-modal2').appendTo("body").modal('show');
    let options = {
        filters: [
            { name: "SCI_PPG" }
        ]
    };

    let service_uuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    let characteristic_uuid = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
    let characteristic_uuid_value1 = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // HR uuid
    let characteristic_uuid_value2 = "63a90923-93a1-4aa2-88e6-019f1b34ea4d" // HRV uuid
    let characteristic_uuid_value3 = "539c06df-0fab-489a-b8f3-53e949e89847" // Voltage uuid

    navigator.bluetooth.requestDevice(options)
        .then((device) => {
            return device.gatt.connect();
            // Do something with the device.
        }).then(server => console.log(server))
        // .then(server => {
        //     BluetoothUUID.getService("device_information")
        //     console.log('Connected to GATT server');
        //     return server.getPrimaryService(service_uuid);
        // })
        // .then(service => {
        //     console.log('Got primary service');
        //     return Promise.all([
        //         service.getCharacteristic(characteristic_uuid_value1),
        //         service.getCharacteristic(characteristic_uuid_value2),
        //         service.getCharacteristic(characteristic_uuid_value3)
        //     ]);
        // })
        // .then(() => {
        //     $('#measure-modal2').appendTo("body").modal('hide');
        //     Swal.fire({
        //         icon: 'success',
        //         title: '연결완료',
        //         text: '기기 연결이 완료되었습니다.',
        //     });
        //     $('#measure-info').css('display', 'block')
        // })
        // .catch((error) => {
        //     console.error(`Something went wrong. ${error}`)
        //     $('#measure-modal1').appendTo("body").modal('hide');
        //     $('#measure-modal2').appendTo("body").modal('hide');
        //     Swal.fire({
        //         icon: 'error',
        //         title: '연결 실패',
        //         text: '다시 시도해주세요.',
        //     });
        // });
})