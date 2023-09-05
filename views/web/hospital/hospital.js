let uEmailId;
let uEmailDomain;
let staffEid;
let staffEdomain;
let h_staff_code;
let inputList = {}; // 병원정보 입력값 저장 리스트
let staffList = {}; // 직원정보 입력값 저장 리스트
let emailCheck = false, // 이메일 아이디 유효성 검사 여부
    domainCheck = false; // 이메일 도메인 유효성 검사 여부
let authCheck = false; // 이메일 인증 완료 여부
let passwordCheck = false;

function init() {
    if (passwordCheck == false) {
        $('#password-modal').modal('show');
    }
}

// 비밀번호 확인 엔터키
$('#pw-check-input').on('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#pwCheckBtn').click();
    }
});

// 비밀번호 확인
function pwCheck() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/pwCheck',
        cmmReqDataObj = {
            'h_adminCode': h_adminCode,
            'pw': $('#pw-check-input').val()
        },
        cmmAsync = false,
        cmmSucc = function pwCheck(result) {
            if (result.state == true) {
                // 모달창 닫기
                $('#password-modal').modal('hide');
                hospitalInfoLoad();
                staffListLoad();
                passwordCheck = true;
            } else {
                Swal.fire({
                    html: '비밀번호가 일치하지 않습니다.<br>다시 입력해 주세요.',
                });
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 비밀번호 확인 모달창 닫기(이전페이지로 이동)
function closePwModal() {
    $('#password-modal').modal('hide');
    history.go(-1);
}


// 담당자 이메일 변경 버튼 클릭 이벤트
$("#edit-emailBtn").on('click', function () {
    $("#edit-emailBtn").toggle();
    $("#edit-emailBtn2").toggle();
    $("#email-input").attr('readonly', false);
    $("#email-input2").attr('readonly', false);
    $("#email-select-input2").toggle();
    $("#authnumber").val("");
    $("#e-auth-notice").css("display", "none");

    $("#input-authnumber").toggle();
    authCheck = false;

    selectOption(uEmailDomain, "email-select-input2");
    if ($('#email-select-input2').val() == uEmailDomain) {
        $('#email-input2').attr('readonly', true);
    }
});

// 담당자 이메일 변경 취소 버튼 클릭 이벤트
$("#edit-emailBtn2").on('click', function () {
    $("#edit-emailBtn").toggle();
    $("#edit-emailBtn2").toggle();
    $("#email-input").attr('readonly', true);
    $("#email-input2").attr('readonly', true);
    $("#email-select-input2").toggle();

    $("#input-authnumber").toggle();
});

// 병원 정보
function hospitalInfoLoad() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/hospitalInfoLoad',
        cmmReqDataObj = {
            h_adminCode: h_adminCode
        },
        cmmAsync = false,

        cmmSucc = function hospitalInfoLoad(result) {
            let telnum = result.rows[0].h_telnum
            let telArray = telnum.split('-');
            console.log(telArray);
            $("#hospital-name-input").val(result.rows[0].h_name);
            $("#hospital-address1-input").val(result.rows[0].h_address1);
            $("#hospital-address2-input").val(result.rows[0].h_address2);
            $("#phone1").val(telArray[0]);
            $("#phone2").val(telArray[1]);
            $("#phone3").val(telArray[2]);
            $("#hospital-time-input").val(result.rows[0].h_operating_time);
            $("#operating-start-time").val(result.operatingTime[0]);
            $("#operating-end-time").val(result.operatingTime[1]);
            $("#id-input").val(result.rows[0].h_user_account_id);
            $("#adminuser-name-input").val(result.rows[0].h_user_name);
            $('#pwd-input').val("");
            $('#pwd-confirm-input').val("");
            $("#userPhone1").val(result.rows[0].h_user_phone_first);
            $("#userPhone2").val(result.rows[0].h_user_phone_middle);
            $("#userPhone3").val(result.rows[0].h_user_phone_last);
            $("#email-input").val(result.rows[0].h_user_email_id);
            $("#email-input2").val(result.rows[0].h_user_email_domain);

            uEmailId = result.rows[0].h_user_email_id;
            uEmailDomain = result.rows[0].h_user_email_domain;
            authCheck = true;

            selectOption(uEmailDomain, "email-select-input2");
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 이메일 변경버튼 클릭시 도메인 option값 자동선택
function selectOption(uEmailDomain, selectId) {
    let selectElement;
    selectElement = document.getElementById(selectId);
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === uEmailDomain) {
            selectElement.selectedIndex = i;
            break;
        }
        if (i == selectElement.options.length - 1) {
            selectElement.selectedIndex = 0;
        }
    }
}

// 이메일 도메인 변경
function selectEmail(ele) {
    var $ele = $(ele);
    var $email2 = $('#email-input2');

    // '1'인 경우 직접입력
    if ($ele.val() == "1") {
        $email2.attr('readonly', false);
        $email2.val('');
    } else {
        $email2.attr('readonly', true);
        $email2.val($ele.val());
    }
    formCheck('email-input2');
}

// 이메일 변경취소 버튼 클릭
$('#edit-emailBtn2').click(function () {
    $("#email-input").val(uEmailId);
    $("#email-input2").val(uEmailDomain);
    $("#email-select-input2").val(uEmailDomain);
    authCheck = true;

})

// 병원정보 입력값 받아오기
function getInput() {
    inputList = {};
    $('.form1').each(function (index, item) {
        formCheck($(item).attr('id'));

    });
    return inputList;
}


// 병원 정보 수정하기
function hospitalInfoModify(h_adminCode) {
    let inputList = getInput();
    console.log(Object.keys(inputList).length );
    if (Object.keys(inputList).length != 11) { // 병원 정보 입력 양식 확인
        alert('병원 정보 입력 양식을 확인해 주세요.')
        return;
    }

    if (!authCheck) { // 이메일 인증 여부 확인
        alert('이메일 인증을 완료해 주세요.');
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/hospitalInfoModify',
        cmmReqDataObj = {
            'h_adminCode': h_adminCode,
            'inputList': inputList
        },
        cmmAsync = false,
        cmmSucc = function hospitalInfoModify(result) {
            if (result.state == true) {
                Swal.fire({
                    icon: 'success',
                    title: '수정 완료',
                    html: '수정이 완료되었습니다.',
                }).then((result) => {
                    emailCheck = false;
                    domainCheck = false;
                    if (result.isConfirmed) {
                        window.location.href = window.location.href;
                    }
                });
            } else {
                Swal.fire({
                    icon: 'fail',
                    title: '수정 실패',
                    text: '수정 실패하였습니다.\n다시 시도해 주세요.',
                });
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

//  병원 정보 수정
$("#editBtn").click(function () {
    hospitalInfoModify(h_adminCode)
});

$('#withdrawalBtn').click(function () {
    $("#withdrawal-modal").modal("show");

});

// 서비스 종료
function withdrawService() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/withdrawService',
        cmmReqDataObj = {
            'h_adminCode': h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function withdrawService(result) {
            $('#withdrawal-modal').modal('hide');

            if (result.state == true) {
                Swal.fire({
                    html: '회원님의 계정이 탈퇴 처리되었습니다.<br>서비스를 이용해 주셔서 감사합니다.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 로그인 화면으로 이동하도록!
                        window.location.href = "/api";
                        // 세션 스토리지 데이터 삭제
                        sessionStorage.clear();
                        sessionStorage.removeItem('key');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'fail',
                    title: '실패',
                    html: '실패하였습니다.<br>다시 시도해 주세요.',
                });
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 입력 양식 실시간 검사
$('.form-control').not('.notval').on('click input change keyup keydown paste focusout', function (evnt) {
    let targetId;
    if (evnt != null) {
        targetId = evnt.target.id; //이벤트 발생 지점의 id
    }
    formCheck(targetId); // 회원가입 양식 검사 호출
});

// 유효성 검사
function formCheck(targetId) {
    let targetVal = $('#' + targetId).val();

    let namePatternKr = /^[가-힣]{2,12}$/,
        //namePatternEn = /^[a-zA-Z]{2,12}$/, // 영문 이름 정규식(향후 사용!?)
        pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*()_+])[A-Za-z\d!@#$%&*()_+]{9,16}$/,
        phonePattern1 = /^[0-9]{3}$/,
        phonePattern2 = /^[0-9]{3,4}$/,
        phonePattern3 = /^[0-9]{4}$/,
        emailPattern = /^[a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/,
        domainPattern = /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 이메일 중복 확인    
    let emailDupl;
    let insertEmailDupl;
    let updateEmailDupl;

    // 연락처 중복 확인
    let phoneDupl;
    let insertPhoneDupl;
    let updatePhoneDupl;

    switch (targetId) {
        case 'hospital-name-input':
            if (targetVal == '') { // 병원명
                $("#hospital-name-notice").removeClass('deactive-notice');
                $("#hospital-name-notice").addClass('active-notice');
            } else {
                $("#hospital-name-notice").removeClass('active-notice');
                $("#hospital-name-notice").addClass('deactive-notice');
                inputList.h_name = targetVal;
            }
            break;

        case 'hospital-address2-input':
            if (targetVal == '') { // 상세 주소
                $("#hospital-address2-notice").removeClass('deactive-notice');
                $("#hospital-address2-notice").addClass('active-notice');
            } else {
                $("#hospital-address2-notice").removeClass('active-notice');
                $("#hospital-address2-notice").addClass('deactive-notice');
                inputList.h_address2 = targetVal;
            }
            break;

            case 'phone1': // 병원 연락처 1
            if ($("#phone1").val() == '선택' || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                $("#hospital-phone-notice").removeClass('deactive-notice');
                $("#hospital-phone-notice").addClass('active-notice');
            } else {
                $("#hospital-phone-notice").removeClass('active-notice');
                $("#hospital-phone-notice").addClass('deactive-notice');
                inputList.h_telnum = targetVal;
            }
            break;

        case 'phone2': // 병원 연락처 2
            if ($("#phone1").val() == '선택' || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                $("#hospital-phone-notice").removeClass('deactive-notice');
                $("#hospital-phone-notice").addClass('active-notice');
            } else {
                $("#hospital-phone-notice").removeClass('active-notice');
                $("#hospital-phone-notice").addClass('deactive-notice');
                inputList.h_telnum += '-' + targetVal;
            }
            break;

        case 'phone3': // 병원 연락처 3
            if ($("#phone1").val() == '선택' || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                $("#hospital-phone-notice").removeClass('deactive-notice');
                $("#hospital-phone-notice").addClass('active-notice');
            } else {
                $("#hospital-phone-notice").removeClass('active-notice');
                $("#hospital-phone-notice").addClass('deactive-notice');
                inputList.h_telnum += '-' + targetVal;
            }
            break;

        case 'hospital-time-input': // 병원 운영 시간
            if (targetVal == '') {
                $("#hospital-time-notice").removeClass('deactive-notice');
                $("#hospital-time-notice").addClass('active-notice');
            } else {
                $("#hospital-time-notice").removeClass('active-notice');
                $("#hospital-time-notice").addClass('deactive-notice');
                inputList.h_operating_time = targetVal;
            }
            break;

        case 'operating-start-time': // 병원 문의 답변 가능 시간(시작)
            if (targetVal == '' || $("#operating-end-time").val() == '') {
                $("#hospital-operating-notice").removeClass('deactive-notice');
                $("#hospital-operating-notice").addClass('active-notice');
            } else {
                $("#hospital-operating-notice").removeClass('active-notice');
                $("#hospital-operating-notice").addClass('deactive-notice');
                inputList.h_answer_time = targetVal;
            }
            break;
            12
        case 'operating-end-time': // 병원 문의 답변 가능 시간(끝)
            if (targetVal == '' || $("#operating-start-time").val() == '') {
                $("#hospital-operating-notice").removeClass('deactive-notice');
                $("#hospital-operating-notice").addClass('active-notice');
            } else {
                $("#hospital-operating-notice").removeClass('active-notice');
                $("#hospital-operating-notice").addClass('deactive-notice');
                inputList.h_answer_time += '-' + targetVal;
            }
            break;

        case 'pwd-input': // 담당자 비밀번호
            if (!pwdPattern.test(targetVal)) {
                $("#pwd-notice").removeClass('deactive-notice');
                $("#pwd-notice").addClass('active-notice');
            } else {
                $("#pwd-notice").removeClass('active-notice');
                $("#pwd-notice").addClass('deactive-notice');
                inputList.h_user_account_pw = targetVal;
            }
            break;

        case 'pwd-confirm-input': // 담당자 비밀번호 확인
            if ($("#pwd-input").val() != targetVal) {
                $("#pwd-confirm-notice").removeClass('deactive-notice');
                $("#pwd-confirm-notice").addClass('active-notice');
            } else {
                $("#pwd-confirm-notice").removeClass('active-notice');
                $("#pwd-confirm-notice").addClass('deactive-notice');
            }
            break;

        case 'adminuser-name-input': // 담당자 이름
            if (!namePatternKr.test(targetVal)) { // 국문
                $("#user-name-notice").removeClass('deactive-notice');
                $("#user-name-notice").addClass('active-notice');
            } else {
                $("#user-name-notice").removeClass('active-notice');
                $("#user-name-notice").addClass('deactive-notice');
                inputList.h_user_name = targetVal;
            }
            break;

        case 'userPhone1': // 담당자 연락처 1
            phoneDupl = phoneDuplicateCheck($("#userPhone1").val(), $("#userPhone2").val(), $("#userPhone3").val());
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#userPhone1").val()) || !phonePattern2.test($("#userPone2").val()) || !phonePattern3.test($("#userPhone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.h_user_phone_first = targetVal;
                }
            }
            break;

        case 'userPhone2': // 담당자 연락처 2
            phoneDupl = phoneDuplicateCheck($("#userPhone1").val(), $("#user-phone2").val(), $("#userPhone3").val());
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#userPhone1").val()) || !phonePattern2.test($("#userPhone2").val()) || !phonePattern3.test($("#userPhone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.h_user_phone_middle = targetVal;
                }
            }
            break;

        case 'userPhone3': // 담당자 연락처 3
            phoneDupl = phoneDuplicateCheck($("#userPhone1").val(), $("#userPhone2").val(), $("#userPhone3").val());
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');
                if (!phonePattern1.test($("#userPhone1").val()) || !phonePattern2.test($("#userPhone2").val()) || !phonePattern3.test($("#userPhone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.h_user_phone_last = targetVal;
                }
            }
            break;

        case 'email-input': // 담당자 이메일 아이디
            emailDupl = emailDuplicateCheck($("#email-input").val(), $("#email-input2").val());
            if (emailDupl) {
                $("#email-dupl-notice").removeClass('deactive-notice');
                $("#email-dupl-notice").addClass('active-notice');
                $("#email-notice").removeClass('active-notice');
                $("#email-notice").addClass('deactive-notice');
                emailCheck = false;
            } else {
                $("#email-dupl-notice").removeClass('active-notice');
                $("#email-dupl-notice").addClass('deactive-notice');
                if (!emailPattern.test(targetVal) || !domainPattern.test($("#email-input2").val())) { // 이메일 아이디 유효성 검사
                    $("#email-notice").removeClass('deactive-notice');
                    $("#email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#email-notice").removeClass('active-notice');
                    $("#email-notice").addClass('deactive-notice');
                    inputList.h_user_email_id = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'email-input2': // 담당자 이메일 도메인
            emailDupl = emailDuplicateCheck($("#email-input").val(), $("#email-input2").val());
            if (emailDupl) {
                $("#email-dupl-notice").removeClass('deactive-notice');
                $("#email-dupl-notice").addClass('active-notice');
                $("#email-notice").removeClass('active-notice');
                $("#email-notice").addClass('deactive-notice');
                domainCheck = false;
            } else {
                $("#email-dupl-notice").removeClass('active-notice');
                $("#email-dupl-notice").addClass('deactive-notice');

                if (!emailPattern.test(targetVal) || !domainPattern.test($("#email-input2").val())) { // 이메일 아이디 유효성 검사
                    $("#email-notice").removeClass('deactive-notice');
                    $("#email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#email-notice").removeClass('active-notice');
                    $("#email-notice").addClass('deactive-notice');
                    inputList.h_user_email_domain = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        // 사용자 등록 모달 유효성 검사
        case 'user-name-input': // 사용자 이름
            if (!namePatternKr.test(targetVal)) { // 국문
                $("#name-notice").removeClass('deactive-notice');
                $("#name-notice").addClass('active-notice');
            } else {
                $("#name-notice").removeClass('active-notice');
                $("#name-notice").addClass('deactive-notice');
                staffList.h_staff_name = targetVal;
            }
            break;

        case 'user-phone1': // 사용자 연락처 1
            insertPhoneDupl = staffPhoneDuplicateCheck($("#user-phone1").val(), $("#user-phone2").val(), $("#user-phone3").val());
            if (insertPhoneDupl) {
                $("#user-phone-dupl-notice").removeClass('deactive-notice');
                $("#user-phone-dupl-notice").addClass('active-notice');
                $("#user-phone-notice").removeClass('active-notice');
                $("#user-phone-notice").addClass('deactive-notice');
            } else {
                $("#user-phone-dupl-notice").removeClass('active-notice');
                $("#user-phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
                    $("#user-phone-notice").removeClass('deactive-notice');
                    $("#user-phone-notice").addClass('active-notice');
                } else {
                    $("#user-phone-notice").removeClass('active-notice');
                    $("#user-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_first = targetVal;
                }
            }
            break;

        case 'user-phone2': // 사용자 연락처 2
            insertPhoneDupl = staffPhoneDuplicateCheck($("#user-phone1").val(), $("#user-phone2").val(), $("#user-phone3").val());
            if (insertPhoneDupl) {
                $("#user-phone-dupl-notice").removeClass('deactive-notice');
                $("#user-phone-dupl-notice").addClass('active-notice');
                $("#user-phone-notice").removeClass('active-notice');
                $("#user-phone-notice").addClass('deactive-notice');
            } else {
                $("#user-phone-dupl-notice").removeClass('active-notice');
                $("#user-phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
                    $("#user-phone-notice").removeClass('deactive-notice');
                    $("#user-phone-notice").addClass('active-notice');
                } else {
                    $("#user-phone-notice").removeClass('active-notice');
                    $("#user-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_middle = targetVal;
                }
            }
            break;

        case 'user-phone3': // 사용자 연락처 3
            insertPhoneDupl = staffPhoneDuplicateCheck($("#user-phone1").val(), $("#user-phone2").val(), $("#user-phone3").val());
            if (insertPhoneDupl) {
                $("user-#phone-dupl-notice").removeClass('deactive-notice');
                $("#user-phone-dupl-notice").addClass('active-notice');
                $("#user-phone-notice").removeClass('active-notice');
                $("#user-phone-notice").addClass('deactive-notice');
            } else {
                $("#user-phone-dupl-notice").removeClass('active-notice');
                $("#user-phone-dupl-notice").addClass('deactive-notice');
                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
                    $("#user-phone-notice").removeClass('deactive-notice');
                    $("#user-phone-notice").addClass('active-notice');
                } else {
                    $("#user-phone-notice").removeClass('active-notice');
                    $("#user-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_last = targetVal;
                }
            }
            break;

        case 'admin-email': // 사용자 이메일 아이디
            insertEmailDupl = staffEmailDuplicateCheck($("#admin-email").val(), $("#admin-domain").val());
            if (insertEmailDupl) {
                $("#admin-email-dupl-notice").removeClass('deactive-notice');
                $("#admin-email-dupl-notice").addClass('active-notice');
                $("#admin-email-notice").removeClass('active-notice');
                $("#admin-email-notice").addClass('deactive-notice');
                emailCheck = false;
            } else {
                $("#admin-email-dupl-notice").removeClass('active-notice');
                $("#admin-email-dupl-notice").addClass('deactive-notice');
                if (!emailPattern.test(targetVal) || !domainPattern.test($("#admin-domain").val())) { // 이메일 아이디 유효성 검사
                    $("#admin-email-notice").removeClass('deactive-notice');
                    $("#admin-email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#admin-email-notice").removeClass('active-notice');
                    $("#admin-email-notice").addClass('deactive-notice');
                    staffList.h_staff_eid = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'admin-domain': // 사용자 이메일 도메인
            insertEmailDupl = staffEmailDuplicateCheck($("#admin-email").val(), $("#admin-domain").val());
            if (insertEmailDupl) {
                $("#admin-email-dupl-notice").removeClass('deactive-notice');
                $("#admin-email-dupl-notice").addClass('active-notice');
                $("#admin-email-notice").removeClass('active-notice');
                $("#admin-email-notice").addClass('deactive-notice');
                domainCheck = false;
            } else {
                $("#admin-email-dupl-notice").removeClass('active-notice');
                $("#admin-email-dupl-notice").addClass('deactive-notice');

                if (!emailPattern.test(targetVal) || !domainPattern.test($("#admin-domain").val())) { // 이메일 아이디 유효성 검사
                    $("#admin-email-notice").removeClass('deactive-notice');
                    $("#admin-email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#admin-email-notice").removeClass('active-notice');
                    $("#admin-email-notice").addClass('deactive-notice');
                    staffList.h_staff_edomain = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'admin-type': // 사용자 분류
            if (targetVal == "100") {
                $("#admin-type-notice").removeClass('deactive-notice');
                $("#admin-type-notice").addClass('active-notice');
            } else {
                $("#admin-type-notice").removeClass('active-notice');
                $("#admin-type-notice").addClass('deactive-notice');
                staffList.h_staff_class = targetVal;
            }
            break;

        case 'admin-note': // 사용자 비고
            staffList.h_staff_note = targetVal;
            break;

        // 사용자 수정 유효성 검사
        case 'admin-edit-name': // 사용자 이름
            if (!namePatternKr.test(targetVal)) { // 국문
                $("#staff-name-notice").removeClass('deactive-notice');
                $("#staff-name-notice").addClass('active-notice');
            } else {
                $("#staff-name-notice").removeClass('active-notice');
                $("#staff-name-notice").addClass('deactive-notice');
                staffList.h_staff_name = targetVal;
            }
            break;

        case 'admin-edit-phone': // 사용자 연락처 1
            updatePhoneDupl = staffPhoneDuplicateCheck($("#admin-edit-phone").val(), $("#edit-phone2").val(), $("#edit-phone3").val());
            if (updatePhoneDupl) {
                $("#staff-phone-dupl-notice").removeClass('deactive-notice');
                $("#staff-phone-dupl-notice").addClass('active-notice');
                $("#staff-phone-notice").removeClass('active-notice');
                $("#staff-phone-notice").addClass('deactive-notice');
            } else {
                $("#staff-phone-dupl-notice").removeClass('active-notice');
                $("#staff-phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#admin-edit-phone").val()) || !phonePattern2.test($("#edit-phone2").val()) || !phonePattern3.test($("#edit-phone3").val())) {
                    $("#staff-phone-notice").removeClass('deactive-notice');
                    $("#staff-phone-notice").addClass('active-notice');
                } else {
                    $("#staff-phone-notice").removeClass('active-notice');
                    $("#staff-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_first = targetVal;
                }
            }
            break;

        case 'edit-phone2': // 사용자 연락처 2
            updatePhoneDupl = staffPhoneDuplicateCheck($("#admin-edit-phone").val(), $("#edit-phone2").val(), $("#edit-phone3").val());
            if (updatePhoneDupl) {
                $("#staff-phone-dupl-notice").removeClass('deactive-notice');
                $("#staff-phone-dupl-notice").addClass('active-notice');
                $("#staff-phone-notice").removeClass('active-notice');
                $("#staff-phone-notice").addClass('deactive-notice');
            } else {
                $("#staff-phone-dupl-notice").removeClass('active-notice');
                $("#staff-phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#admin-edit-phone").val()) || !phonePattern2.test($("#edit-phone2").val()) || !phonePattern3.test($("#edit-phone3").val())) {
                    $("#staff-phone-notice").removeClass('deactive-notice');
                    $("#staff-phone-notice").addClass('active-notice');
                } else {
                    $("#staff-phone-notice").removeClass('active-notice');
                    $("#staff-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_middle = targetVal;
                }
            }
            break;

        case 'edit-phone3': // 사용자 연락처 3
            updatePhoneDupl = staffPhoneDuplicateCheck($("#admin-edit-phone").val(), $("#edit-phone2").val(), $("#edit-phone3").val());
            if (updatePhoneDupl) {
                $("#staff-phone-dupl-notice").removeClass('deactive-notice');
                $("#staff-phone-dupl-notice").addClass('active-notice');
                $("#staff-phone-notice").removeClass('active-notice');
                $("#staff-phone-notice").addClass('deactive-notice');
            } else {
                $("#staff-phone-dupl-notice").removeClass('active-notice');
                $("#staff-phone-dupl-notice").addClass('deactive-notice');
                if (!phonePattern1.test($("#admin-edit-phone").val()) || !phonePattern2.test($("#edit-phone2").val()) || !phonePattern3.test($("#edit-phone3").val())) {
                    $("#staff-phone-notice").removeClass('deactive-notice');
                    $("#staff-phone-notice").addClass('active-notice');
                } else {
                    $("#staff-phone-notice").removeClass('active-notice');
                    $("#staff-phone-notice").addClass('deactive-notice');
                    staffList.h_staff_phone_last = targetVal;
                }
            }
            break;

        case 'admin-edit-email': // 사용자 이메일 아이디
            updateEmailDupl = staffEmailDuplicateCheck($("#admin-edit-email").val(), $("#admin-edit-domain").val());
            if (updateEmailDupl) {
                $("#staff-email-dupl-notice").removeClass('deactive-notice');
                $("#staff-email-dupl-notice").addClass('active-notice');
                $("#staff-email-notice").removeClass('active-notice');
                $("#staff-email-notice").addClass('deactive-notice');
                emailCheck = false;
            } else {
                $("#staff-email-dupl-notice").removeClass('active-notice');
                $("#staff-email-dupl-notice").addClass('deactive-notice');
                if (!emailPattern.test(targetVal) || !domainPattern.test($("#admin-edit-domain").val())) { // 이메일 아이디 유효성 검사
                    $("#staff-email-notice").removeClass('deactive-notice');
                    $("#staff-email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#staff-email-notice").removeClass('active-notice');
                    $("#staff-email-notice").addClass('deactive-notice');
                    staffList.h_staff_eid = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'admin-edit-domain': // 사용자 이메일 도메인
            updateEmailDupl = staffEmailDuplicateCheck($("#admin-edit-email").val(), $("#admin-edit-domain").val());
            if (updateEmailDupl) {
                $("#staff-email-dupl-notice").removeClass('deactive-notice');
                $("#staff-email-dupl-notice").addClass('active-notice');
                $("#staff-email-notice").removeClass('active-notice');
                $("#staff-email-notice").addClass('deactive-notice');
                domainCheck = false;
            } else {
                $("#staff-email-dupl-notice").removeClass('active-notice');
                $("#staff-email-dupl-notice").addClass('deactive-notice');

                if (!emailPattern.test(targetVal) || !domainPattern.test($("#admin-edit-domain").val())) { // 이메일 아이디 유효성 검사
                    $("#staff-email-notice").removeClass('deactive-notice');
                    $("#staff-email-notice").addClass('active-notice');
                    emailCheck = false;
                    domainCheck = false;
                } else {
                    $("#staff-email-notice").removeClass('active-notice');
                    $("#staff-email-notice").addClass('deactive-notice');
                    staffList.h_staff_edomain = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'admin-edit-type': // 사용자 분류
            if (targetVal == "100") {
                $("#staff-type-notice").removeClass('deactive-notice');
                $("#staff-type-notice").addClass('active-notice');
            } else {
                $("#staff-type-notice").removeClass('active-notice');
                $("#staff-type-notice").addClass('deactive-notice');
                staffList.h_staff_class = targetVal;
            }
            break;

        case 'admin-edit-note': // 사용자 분류
            staffList.h_staff_note = targetVal;
            break;
    }
}

// 이메일 중복
function emailDuplicateCheck(emailIdStr, emailDomainStr) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/hospital/email',
        cmmReqDataObj = {
            'eIdString': emailIdStr,
            'eDomainString': emailDomainStr,
            'h_adminCode': h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}

// 담당자 연락처 중복 검사
function phoneDuplicateCheck(phone1, phone2, phone3) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/hospital/phone',
        cmmReqDataObj = {
            'phone1': phone1,
            'phone2': phone2,
            'phone3': phone3,
            'h_adminCode': h_adminCode
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}

// 인증번호 전송 클릭 이벤트
$("#sendnumber").on('click', function () {

    formCheck('email-input');
    formCheck('email-input2');

    authCheck = false;

    if (emailCheck & domainCheck) { // 이메일 아이디, 도메인 유효성 검사 여부
        $("#sendNumber").toggle(); // 인증번호 전송 버튼 X
        $("#authnumber").val(''); // 인증번호 입력란 초기화

        setTimeout(function () {
            sendEmail(); // 메일 전송
        }, 50);

    } else {
        alert('이메일을 확인해 주세요.');
        return;
    }
})


// 이메일 전송
function sendEmail() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/sendEmail',
        cmmReqDataObj = {
            eId: $("#email-input").val(),
            eDomain: $("#email-input2").val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            if (result.success == 0) { // 메일 전송 실패시
                alert('인증번호 전송에 실패했습니다.');
                $('#sendNumber').toggle(); // 인증번호 전송 버튼 O
            } else { // 메일 전송 성공 시
                $("#e-auth-notice").toggle(); // 인증번호 입력 문구 O
                $("#email-input").attr('readonly', true); // 이메일 아이디 readonly
                $("#email-input2").attr('readonly', true); // 이메일 도메인 readonly

                authnumber = result.authNumber;
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}

// 인증번호 확인 버튼 클릭 이벤트
$('#checknumber').on('click', function () {
    if (validator($('#authnumber').val(), 'isEmpty')) {
        alert('인증번호를 입력해 주세요.');
        authCheck = false;
    } else {
        if ($('#authnumber').val() == authnumber) {
            alert('이메일 인증에 성공하였습니다.');
            $('#input-authnumber').toggle();
            uEmailId = $("#email-input").val();
            uEmailDomain = $("#email-input2").val();
            $("#e-auth-notice").toggle();
            $("#edit-emailBtn").toggle();
            $("#edit-emailBtn2").toggle();
            authCheck = true;
        } else {
            alert('인증에 실패하였습니다. 다시 시도해 주세요.');
            authCheck = false;
        }
    }
})

// 병원정보 입력값 받아오기
function getInput() {
    inputList = {};
    $('.form-control').each(function (index, item) {
        formCheck($(item).attr('id'));
    });
    return inputList;
}

// 병원 스태프 목록 조회
function staffListLoad() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/staffListLoad',
        cmmReqDataObj = {
            h_adminCode: h_adminCode
        },
        cmmAsync = false,

        cmmSucc = function staffListLoad(result) {
            $('#admin-table > tbody').empty();
            for (let i = 0; i < result.rowLength; i++) {
                let h_staff_class;
                if (result.rows[i].h_staff_class == "0") {
                    h_staff_class = "수의사"
                } else if (result.rows[i].h_staff_class == "1") {
                    h_staff_class = "동물보호사"
                } else if (result.rows[i].h_staff_class == "2") {
                    h_staff_class = "기타"
                }
                let tableHtml =
                    `<tr>` +
                    `<td>` + result.rows[i].h_staff_name + "</td>" +
                    '<td>' + result.rows[i].h_staff_phone_first + '-' + result.rows[i].h_staff_phone_middle + '-' + result.rows[i].h_staff_phone_last + '</td>' +
                    '<td>' + result.rows[i].h_staff_eid + '@' + result.rows[i].h_staff_edomain + '</td>' +
                    '<td>' + h_staff_class + '</td>' +
                    '<td>' + result.rows[i].h_staff_note + '</td>' +
                    `<td> <button id="admin-editBtn" class="btn btn-secondary btn-modal" onclick="staffInfo('${result.rows[i].h_staff_code}')">수정</button>` +
                    '<button id="admin-deleteBtn" class="btn btn-secondary btn-modal" onclick="delCheck(' + result.rows[i].h_staff_code + ')">삭제</button> </td>' +
                    '</tr>';
                $('#admin-table > tbody').append(tableHtml);
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 직원 정보
function staffInfo(h_staff_code) {
    $('#editUser-modal').modal('show');

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/staffInfo',
        cmmReqDataObj = {
            h_staff_code: h_staff_code
        },
        cmmAsync = false,

        cmmSucc = function staffInfo(result) {

            $("#h_staff_code").val(h_staff_code);
            $("#admin-edit-name").val(result.rows[0].h_staff_name);
            $("#admin-edit-phone").val(result.rows[0].h_staff_phone_first);
            $("#edit-phone2").val(result.rows[0].h_staff_phone_middle);
            $("#edit-phone3").val(result.rows[0].h_staff_phone_last);
            $("#admin-edit-email").val(result.rows[0].h_staff_eid);
            $("#admin-edit-domain").val(result.rows[0].h_staff_edomain);
            $("#admin-edit-type").val(result.rows[0].h_staff_class);
            $("#admin-edit-note").val(result.rows[0].h_staff_note);

            staffEid = result.rows[0].h_staff_eid;
            staffEdomain = result.rows[0].h_staff_edomain;
            h_staff_code = h_staff_code;
            if (staffEdomain == "naver.com" || staffEdomain == "gmail.com" || staffEdomain == "daum.net" || staffEdomain == "hanmail.net" || staffEdomain == "nate.com") {
                $("#admin-edit-domain").attr('readonly', true);
            } else {
                $("#admin-edit-domain").attr('readonly', false);
            }

            selectOption(staffEdomain, "edit-select-domain");


        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 이메일 도메인 변경
function selectEmail2(ele) {
    var $ele = $(ele);
    var $email2 = $('#admin-edit-domain');

    // '1'인 경우 직접입력
    if ($ele.val() == "1") {
        $email2.attr('readonly', false);
        $email2.val('');
    } else {
        $email2.attr('readonly', true);
        $email2.val($ele.val());
    }
    formCheck('admin-edit-domain');
}

// 이메일 도메인 변경
function selectEmail3(ele) {
    var $ele = $(ele);
    var $email2 = $('#admin-domain');

    // '1'인 경우 직접입력
    if ($ele.val() == "1") {
        $email2.attr('readonly', false);
        $email2.val('');
    } else {
        $email2.attr('readonly', true);
        $email2.val($ele.val());
    }
    formCheck('admin-domain');
}


// 사용자 이메일 중복
function staffEmailDuplicateCheck(emailIdStr, emailDomainStr) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/hospital/staffEmail',
        cmmReqDataObj = {
            'eIdString': emailIdStr,
            'eDomainString': emailDomainStr,
            'h_staff_code': $("#h_staff_code").val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}

// 사용자 연락처 중복 검사
function staffPhoneDuplicateCheck(phone1, phone2, phone3) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/hospital/staffPhone',
        cmmReqDataObj = {
            'phone1': phone1,
            'phone2': phone2,
            'phone3': phone3,
            'h_staff_code': $("#h_staff_code").val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}


// 사용자 등록 모달 열기
function insertOpen() {
    // 입력값 초기화
    $("#h_staff_code").val("");
    $('#user-name-input').val("");
    $('#user-phone1').val("선택");
    $('#user-phone2').val("");
    $('#user-phone3').val("");
    $('#admin-email').val("");
    $('#admin-domain').val("");
    $('#select-domain').val("1");
    $('#admin-type').val("100");
    $('#admin-note').val("");

    // 유효성 검사 초기화
    $("#name-notice").removeClass('active-notice');
    $("#name-notice").addClass('deactive-notice');
    $("#user-phone-notice").removeClass('active-notice');
    $("#user-phone-notice").addClass('deactive-notice');
    $("#user-phone-dupl-notice").removeClass('active-notice');
    $("#user-phone-dupl-notice").addClass('deactive-notice');
    $("#admin-email-notice").removeClass('active-notice');
    $("#admin-email-notice").addClass('deactive-notice');
    $("#admin-email-dupl-notice").removeClass('active-notice');
    $("#admin-email-dupl-notice").addClass('deactive-notice');
    $("#admin-type-notice").removeClass('active-notice');
    $("#admin-type-notice").addClass('deactive-notice');
    emailCheck = false;
    domainCheck = false;
    h_staff_code = 0;

    $('#createUser-modal').modal('show');
}


// 사용자 등록 입력값 받아오기
function getStaffInput() {
    staffList = {};
    $('.form2').each(function (index, item) {
        formCheck($(item).attr('id'));
    });
    return staffList;
}

// 사용자 수정 입력값 받아오기
function getStaffInput2() {
    staffList = {};
    $('.form3').each(function (index, item) {
        formCheck($(item).attr('id'));
    });
    return staffList;
}

// 사용자 등록/수정
function staffInfoInsertUpdate(state) {
    let staffList;
    let staffUrl;
    if (state == "등록") {
        staffUrl = "insertStaff";
        staffList = getStaffInput();
    } else {
        staffUrl = "updateStaff";
        staffList = getStaffInput2();
    }
    if (Object.keys(staffList).length != 8) { // 직원 정보 입력 양식 확인
        alert('사용자 ' + state + ' 입력 양식을 확인해 주세요.')
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/' + staffUrl,
        cmmReqDataObj = {
            'h_adminCode': h_adminCode,
            'h_staff_code': $("#h_staff_code").val(),
            'staffList': staffList
        },
        cmmAsync = false,
        cmmSucc = function staffInfoInsertUpdate(result) {
            if (result.state == true) {
                Swal.fire({
                    icon: 'success',
                    title: state + ' 성공',
                    text: '사용자가 ' + state + '되었습니다.',
                }).then((result) => {
                    emailCheck = false;
                    domainCheck = false;
                    if (result.isConfirmed) {
                        staffListLoad();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'fail',
                    title: state + ' 실패',
                    text: state + ' 실패하였습니다.',
                });
            }
            closeModal();

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 사용자 등록
$("#adminCreateBtn").click(function () {
    staffInfoInsertUpdate("등록");
});

//  사용자 정보 수정
$("#adminEditBtn").click(function () {
    staffInfoInsertUpdate("수정")
});

// 모달창 닫기
function closeModal() {
    emailCheck = false;
    domainCheck = false;
    $('#createUser-modal').modal('hide');
    $('#editUser-modal').modal('hide');
    $('#delUser-modal').modal('hide');
    $('#withdrawal-modal').modal('hide');
}

//  사용자 정보 삭제
function delCheck(h_staff_code) {
    $('#staff_code').val(h_staff_code);
    $('#delUser-modal').modal('show');
};

// 사용자 삭제
function deleteStaff() {
    console.log($('#staff_code').val());
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospital/deleteStaff',
        cmmReqDataObj = {
            'h_staff_code': $('#staff_code').val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            $('#delUser-modal').modal('hide');
            if (result.state == true) {
                Swal.fire({
                    icon: 'success',
                    title: '삭제 성공',
                    text: '사용자가 삭제되었습니다.',
                })
                staffListLoad();
            } else {
                Swal.fire({
                    icon: 'fail',
                    title: '삭제 실패',
                    text: '사용자 삭제 실패하였습니다.',
                });
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};