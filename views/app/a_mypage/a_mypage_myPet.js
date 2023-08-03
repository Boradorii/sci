
function init() {
    loadPetList()
}


function insertPet() {
    let agePattern = /^\d{1,2}$/;
    let weightPattern = /^\d{1,3}(\.\d{1})?$/;
    let codePattern = /^\d{15}$/;
    if ($('#name-input').val() == "") {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 이름을 입력주세요!',
        });
        return;
    } else if (!agePattern.test($('#age-input').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '나이는 최대 두자리까지 숫자로만 입력주세요!',
        });
        return;

    } else if (!weightPattern.test($('#weight-input').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '몸무게는 최대 소수점 한자리까지 숫자로 입력해주세요!',
        });
        return;
    } else if (!$('input[name=gender]:checked').val()) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 성별을 선택해주세요.',
        });
        return;
    } else if (!$('input[name=neuteredRadioOptions]:checked').val()) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 중성화 여부를 선택해주세요.',
        });
        return;
    } else if ($('#kind').val() == "품종") {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 품종을 선택해주세요.',
        });
        return;
    }

    if ($('#code-input').val() == "") {
    } else if (!codePattern.test($('#code-input').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '동물등록번호는 비워두거나 15자리 숫자로 입력해주세요!',
        });
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/insertPet',
        cmmReqDataObj = {
            age: $('#age-input').val(),
            name: $('#name-input').val(),
            weight: $('#weight-input').val(),
            p_user_code: p_userCode,
            gender: $('input[name=gender]:checked').val(),
            pet_isNeutering: $('input[name=neuteredRadioOptions]:checked').val(),
            breed: $('#kind').val(),
            pet_code: $('#code-input').val()
        },
        cmmAsync = false,

        cmmSucc = function insertPet(result) {

            Swal.fire({
                icon: 'success',
                title: '등록 성공!',
                text: '우리 아이 관리에 등록되었습니다.',
            }).then((result) => {
                if (result.isConfirmed) {
                    let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
                    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                        action: 'go-petManage'
                    }, '*');
                    location.href = reqUrl;

                }
            });


            loadPetList();


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

// 우리 아이 관리 페이지 로드
function loadPetList() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/loadPetList',
        cmmReqDataObj = {
            p_user_code: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function loadPetList(result) {
            if (result.rowLength == 0) {
                let petInfoHtml =
                    '<h6 style="font-weight: 700; font-size: 15pt; margin-top: 15px;  text-align: center;" id="petInfo">'
                    + '등록된 우리 아이가 없어요!<br>' + `우측 상단의` + '&nbsp;' + `'+'` + '&nbsp;' + `버튼을 눌러 등록해주세요!</h6>`;
                $('#box').append(petInfoHtml);
            } else {
                for (let i = 0; i < result.rowLength; i++) {
                    if (result.rows[i].pet_first_yn == 'Y') {
                        let petInfoHtml =
                            `<div class="card card-box" style="width: 80%;">
                        <div>
                            <div class="row">
                                <h4 style="margin-top: 15px; margin-left: 35px; font-weight: 700;" class="row flex-grow-1">` + result.rows[i].pet_name + '</h4>' +
                            `<i onclick='setRepresent(this)' id="${result.rows[i].pet_id}" class="material-icons mr-2" style="color: gold; font-size: 30px;">star</i>` +
                            `<i onclick='modifyMyPet(${result.rows[i].pet_id})' class="material-icons mr-3" style="color: black; font-size: 30px;">create</i>` +
                            '</div>' +
                            '<h6 style="font-weight: 700; margin-bottom: 15px;" class="ml-4" id="petInfo">'
                            + result.rows[i].pet_breed + ' | ' + result.rows[i].pet_byear + '세 | ' + result.rows[i].pet_gender + '</h6></div></div>';
                        $('#box').append(petInfoHtml);

                    } else {
                        let petInfoHtml =
                            `<div class="card card-box" style="width: 80%;">
                        <div>
                            <div class="row">
                                <h4 style="margin-top: 15px; margin-left: 35px; font-weight: 700;" class="row flex-grow-1">` + result.rows[i].pet_name + '</h4>' +
                            `<i onclick='setRepresent(this)' id="${result.rows[i].pet_id}" class="material-icons mr-2" style="color: gainsboro; font-size: 30px;">star</i>` +
                            `<i onclick='modifyMyPet(${result.rows[i].pet_id})' class="material-icons mr-3 create" style="color: black; font-size: 30px;">create</i>` +
                            '</div>' +
                            '<h6 style="font-weight: 700; margin-bottom: 15px;" class="ml-4" id="petInfo">'
                            + result.rows[i].pet_breed + ' | ' + result.rows[i].pet_byear + '세 | ' + result.rows[i].pet_gender + '</h6></div></div>';
                        $('#box').append(petInfoHtml);

                    }


                }
            }


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

// 반려견 등록 페이지에서 등록 버튼
$('#petRegi').click(function () {
    insertPet()
});

// 반려견 등록 페이지에서 취소 버튼
$('#cancel').click(function () {

    let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
        action: 'go-petManage'
    }, '*');
    location.href = reqUrl;

});

// 대표 반려견 아이콘 변경 및 대표 반려견 설정
function setRepresent(target) {
    console.log(target.id)

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/setRepresent',
        cmmReqDataObj = {
            p_user_code: p_userCode,
            petId: target.id
        },
        cmmAsync = false,

        cmmSucc = function setRepresent(result) {
            $('#' + result.row.pet_id).css('color', 'gainsboro');
            $(target).css('color', 'gold');
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

// 연필 아이콘을 클릭하여 수정 페이지로 이동
function modifyMyPet(pet_id) {


    let reqUrl = baseUrl + '/a_mypage';
    reqUrl += '/myPetPage3';
    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
        action: 'go-petManage'
    }, '*');
    reqUrl += '?p_userCode=' + p_userCode + '&pet_id=' + pet_id; /* + '&lang=' + lang + "&accessToken=" + accessToken*/;
    // reqUrl += '?p_userCode=' + p_userCode;
    location.href = reqUrl;


    //앱>> 페이지 이동 시 필수 작성(뒤로가기 버튼 구현시 필요)
    window.parent.postMessage({
        action: 'moveFrameY' //메인페이지에서 하위 메뉴로 들어갔을 때 페이지 이동 표시("Y": 하위 메뉴/"N": 메인메뉴)
    }, '*'); // TO-DO: 임시로 모든 도메인 허용(*)하였음. 추후 수정할 것
}

