/** ================================================================
 *  회원가입 js
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *           2023.06.19 회원가입 기능 구현
 *           2023.06.20 이메일 인증_재전송 버튼 추가
 *  ================================================================
 */


let inputList = {}; // 회원가입 입력값 저장 리스트
let emailCheck = false, // 이메일 아이디 유효성 검사 여부
    domainCheck = false; // 이메일 도메인 유효성 검사 여부
let authCheck = false; // 이메일 인증 완료 여부



/** ================================================================
 *  회원가입 입력 양식 실시간 검사
 * (입력란 클릭, 값 변경, 붙여넣기 등의 이벤트가 발생하는 경우)
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
$('.form-control').not('.notval').on('click input change keyup keydown paste focusout', function(evnt) {
    let targetId;
    if (evnt != null) {
        targetId = evnt.target.id; //이벤트 발생 지점의 id
    }

    // 병원 검색, 주소 검색 input 제외
    if (evnt.target.id == 'searchKey' | evnt.target.id == 'addressKey') {
        return;
    }

    formCheck(targetId); // 회원가입 양식 검사 호출
});



/** ================================================================
 *  회원가입 양식 검사 (유효성 검사)
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
function formCheck(targetId) {
    let targetVal = $('#' + targetId).val();

    let namePatternKr = /^[가-힣]{2,12}$/,
        //namePatternEn = /^[a-zA-Z]{2,12}$/, // 영문 이름 정규식(향후 사용!?)
        idPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/,
        pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*()_+])[A-Za-z\d!@#$%&*()_+]{9,16}$/,
        phonePattern1 = /^[0-9]{3}$/,
        phonePattern2 = /^[0-9]{3,4}$/,
        phonePattern3 = /^[0-9]{4}$/,
        emailPattern = /^[a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/,
        domainPattern = /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 이메일 중복 확인    
    let emailDupl = emailDuplicateCheck($("#email-input").val(), $("#email-input2").val());
    // 담당자 연락처 중복 확인
    let phoneDupl = phoneDuplicateCheck($("#user-phone1").val(), $("#user-phone2").val(), $("#user-phone3").val());

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

        case 'hospital-address1-input':
            if (targetVal == '') { // 도로명 주소
                $("#hospital-address1-notice").removeClass('deactive-notice');
                $("#hospital-address1-notice").addClass('active-notice');
                $("#hospital-address2-notice").removeClass('active-notice');
                $("#hospital-address2-notice").addClass('deactive-notice');
            } else {
                $("#hospital-address1-notice").removeClass('active-notice');
                $("#hospital-address1-notice").addClass('deactive-notice');
                inputList.h_address1 = targetVal;
            }
            break;

        case 'hospital-address2-input':
            if (targetVal == '') { // 상세 주소
                $("#hospital-address2-notice").removeClass('deactive-notice');
                $("#hospital-address2-notice").addClass('active-notice');
                $("#hospital-address1-notice").removeClass('active-notice');
                $("#hospital-address1-notice").addClass('deactive-notice');
            } else {
                $("#hospital-address2-notice").removeClass('active-notice');
                $("#hospital-address2-notice").addClass('deactive-notice');
                inputList.h_address1 = targetVal;
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

        case 'id-input': // 담당자 아이디
            if (idDuplicateCheck(targetVal)) { // 아이디 중복검사
                $("#id-dupl-notice").removeClass('deactive-notice');
                $("#id-dupl-notice").addClass('active-notice');
            } else {
                $("#id-dupl-notice").removeClass('active-notice');
                $("#id-dupl-notice").addClass('deactive-notice');
                if (!idPattern.test(targetVal)) { // 아이디 유효성 검사
                    $("#id-notice").removeClass('deactive-notice');
                    $("#id-notice").addClass('active-notice');
                } else {
                    $("#id-notice").removeClass('active-notice');
                    $("#id-notice").addClass('deactive-notice');
                    inputList.h_user_account_id = targetVal;
                }
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

        case 'user-name-input': // 담당자 이름
            if (!namePatternKr.test(targetVal)) { // 국문
                $("#user-name-notice").removeClass('deactive-notice');
                $("#user-name-notice").addClass('active-notice');
            } else {
                $("#user-name-notice").removeClass('active-notice');
                $("#user-name-notice").addClass('deactive-notice');
                inputList.h_user_name = targetVal;
            }
            break;

        case 'user-phone1': // 담당자 연락처 1
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.h_user_phone_first = targetVal;
                }
            }
            break;

        case 'user-phone2': // 담당자 연락처 2
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.h_user_phone_middle = targetVal;
                }
            }
            break;

        case 'user-phone3': // 담당자 연락처 3
            if (phoneDupl) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');
                if (!phonePattern1.test($("#user-phone1").val()) || !phonePattern2.test($("#user-phone2").val()) || !phonePattern3.test($("#user-phone3").val())) {
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
            if (emailDupl) {
                $("#email-dupl-notice").removeClass('deactive-notice');
                $("#email-dupl-notice").addClass('active-notice');
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
            if (emailDupl) {
                $("#email-dupl-notice").removeClass('deactive-notice');
                $("#email-dupl-notice").addClass('active-notice');
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
    }
}


/** ================================================================
 *  ID 중복 검사
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
function idDuplicateCheck(idStr) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/duplicate/id',
        cmmReqDataObj = { idString: idStr },
        cmmAsync = false,
        cmmSucc = function(result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}



/** ================================================================
 *  Email 중복 검사
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function emailDuplicateCheck(emailIdStr, emailDomainStr) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/duplicate/email',
        cmmReqDataObj = {
            'eIdString': emailIdStr,
            'eDomainString': emailDomainStr
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}

/** ================================================================
 *  담당자 연락처 중복 검사
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function phoneDuplicateCheck(phone1, phone2, phone3) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/duplicate/phone',
        cmmReqDataObj = {
            'phone1': phone1,
            'phone2': phone2,
            'phone3': phone3
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}


/** ================================================================
 *  인증번호 전송 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
$("#sendNumber").on('click', function() {

    formCheck('email-input');
    formCheck('email-input2');

    authCheck = false;

    if (emailCheck & domainCheck) { // 이메일 아이디, 도메인 유효성 검사 여부
        $("#sendNumber").toggle(); // 인증번호 전송 버튼 X
        $("#wait-notice").toggle(); // 대기 문구 O
        $("#authnumber").val(''); // 인증번호 입력란 초기화

        setTimeout(function() {
            sendEmail(); // 메일 전송
        }, 50);

    } else {
        alert('이메일을 확인해 주세요.');
        return;
    }
});


/** ================================================================
 *  재전송 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#resendNumber").on('click', function() {

    authCheck = false;

    if (emailCheck & domainCheck) { // 이메일 아이디, 도메인 유효성 검사 여부
        $("#authnumber").val('');

        $("#sendNumber").toggle();
        $("#resendNumber").toggle();

        $("#email-input").attr('readonly', false);
        $("#email-input2").attr('readonly', false);

    } else {
        alert('이메일을 확인해 주세요.');
        return;
    }
})


/** ================================================================
 *  이메일 전송
 *  @author SY
 *  @since 2023.04.26
 *  @history 2023.04.26 초기 작성
 *  ================================================================
 */
function sendEmail() {
    $("#wait-notice").toggle(); // 대기 문구 X
    $("#resendNumber").toggle(); // 재전송 버튼 O


    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/sendEmail',
        cmmReqDataObj = {
            eId: $("#email-input").val(),
            eDomain: $("#email-input2").val()
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            if (result.success == 0) { // 메일 전송 실패시
                alert('인증번호 전송에 실패했습니다.');
                $('#sendNumber').toggle(); // 인증번호 전송 버튼 O
            } else { // 메일 전송 성공 시

                $('#input-authnumber').toggle(); // 인증번호 입력 div O
                $("#email-input").attr('readonly', true); // 이메일 아이디 readonly
                $("#email-input2").attr('readonly', true); // 이메일 도메인 readonly

                authnumber = result.authNumber;
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}



/** ================================================================
 *  인증번호 확인 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.04.26
 *  @history 2023.04.26 초기 작성
 *  ================================================================
 */
$('#checknumber').on('click', function() {
    if (validator($('#authnumber').val(), 'isEmpty')) {
        alert('인증번호를 입력해 주세요.');
        authCheck = false;
    } else {
        if ($('#authnumber').val() == authnumber) {
            alert('이메일 인증에 성공하였습니다.');
            $('#input-authnumber').toggle();
            authCheck = true;
        } else {
            alert('인증에 실패하였습니다. 다시 시도해 주세요.');
            authCheck = false;
        }
    }
})



/** ================================================================
 *  회원가입 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.04.26
 *  @history 2023.04.26 초기 작성
 *  ================================================================
 */
$("#submit-btn").on('click', function() {

    let inputList = getInput(); // 회원가입 입력값

    // 약관 동의 확인
    if ($("#dogdoc-ToS-chk").prop('checked') && $("#private-policy-chk").prop('checked')) { // 필수항목 체크 여부
        // 개인정보 제3자 제공 동의 여부 확인
        let provideYN = $('#provide-ToS-chk').prop('checked');
        if (provideYN) {
            inputList.h_user_provide_yn = 'Y';
        } else {
            inputList.h_user_provide_yn = 'N';
        }
    } else {
        alert('필수 약관 동의를 모두 체크해 주세요.');
        return;
    }

    // console.log(Object.keys(inputList).length)
    // console.log(inputList);
    if (Object.keys(inputList).length != 14) { // 회원가입 입력 양식 확인
        alert('회원가입 입력 양식을 확인해 주세요.')
        return;
    } else {
        inputList.h_address1 = $("#hospital-address1-input").val();
        inputList.h_address2 = $("#hospital-address2-input").val();
    }

    if (!authCheck) { // 이메일 인증 여부 확인
        alert('이메일 인증을 완료해 주세요.');
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/signup',
        cmmReqDataObj = {
            'inputList': inputList
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            if (result.state == true) {
                alert('정상적으로 가입되었습니다.');
                location.href = '/api';
            } else {
                alert('가입에 실패하였습니다.')
            }
        },
        cmmErr = function() {
            alert(i18next.t('가입 실패. 잠시 후 다시 시도해주세요.'));
            location.href = '/api';
        };

    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return;
});



/** ================================================================
 *  회원가입 입력값 받아오기
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function getInput() {
    inputList = {};
    $('.form-control').each(function(index, item) {
        formCheck($(item).attr('id'));
    });
    return inputList;
}


/** ================================================================
 *  이메일 도메인 change 이벤트
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#email-select-input2").on('change', function() {
    if ($(this).val() == '직접입력') {
        $("#email-input2").val('');
    } else {
        $("#email-input2").val($(this).val());
    }
});


/** ================================================================
 *  이메일 아이디, 도메인 변경이 있을 경우 이메일 인증 초기화
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#email-input").on('input', function() { //input 이벤트 - 일반입력, 붙여넣기, 자동입력 등 이벤트 감지
    authCheck = false;
    $('#input-authnumber').addClass("deactive-notice");
    $('#input-authnumber').removeClass("active-notice");
    $("#e-auth-notice").text('');

});
$("#email-input2").on('input', function() {
    authCheck = false;
    $('#input-authnumber').addClass("deactive-notice");
    $('#input-authnumber').removeClass("active-notice");
    $("#e-auth-notice").text('');
});


/** ================================================================
 *  필수항목 모두 동의하기 체크 이벤트
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
$("#all-requirements").on('click', function() {
    if ($("#all-requirements").prop('checked')) {
        $("#dogdoc-ToS-chk").prop('checked', true);
        $("#private-policy-chk").prop('checked', true);
        $("#provide-ToS-chk").prop('checked', true);
    } else {
        $("#dogdoc-ToS-chk").prop('checked', false);
        $("#private-policy-chk").prop('checked', false);
        $("#provide-ToS-chk").prop('checked', false);
    }
});


/*---------------------------------------- 병원 검색 API (시작) -----------------------------------------------*/
/** ================================================================
 *  병원 검색 버튼 클릭 이벤트 - searchHospital() 호출
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#searchBtn").on('click', function() {
    searchHospital();
});


/** ================================================================
 *  병원 검색창 Enter 이벤트 - searchHospital() 호출
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#searchKey").on('keyup', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchHospital();
    }
});


/** ================================================================
 *  병원 검색
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */

function searchHospital() {
    if ($("#searchKey").val() == '') {
        alert('병원명을 입력해 주세요.');
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/searchHospital',
        cmmReqDataObj = {
            'hp_name': $("#searchKey").val()
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            $("#search-hospital-list>tbody").html('');
            if (result.rowLength > 0) {
                let html = '';
                for (let i = 0; i < result.rowLength; i++) {
                    html += "<tr style='cursor: pointer;' onclick='selectHospital(\"" + result.rows[i].hp_code + "\");'>" +
                        "<td>" + result.rows[i].hp_name + "</td>" +
                        "<td>" + result.rows[i].hp_roadaddress + "</td>" +
                        "</tr>";
                }
                $("#search-hospital-list>tbody:last").append(html);
            } else {
                alert('해당 병원이 존재하지 않습니다. 검색어를 다시 입력해 주세요.');
            }
        },
        cmmErr = function() {
            alert('해당하는 병원이 존재하지 않습니다. 다시 검색해 주세요.');
        };
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return;
}


/** ================================================================
 *  병원 클릭 이벤트(병원 상세정보 자동 입력)
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function selectHospital(hp_code) {
    $("#search-hospital-modal").modal('hide');

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/hospitalInfo',
        cmmReqDataObj = {
            'hp_code': hp_code
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            if (result.rowLength > 0) {
                $("#hospital-name-input").val(result.rows[0].hp_name);

                if (result.rows[0].hp_roadaddress != '') {
                    $("#hospital-address1-input").val(result.rows[0].hp_roadaddress);
                }

                let tel = result.rows[0].hp_telnum.split("-");
                if (tel.length == 3) {
                    $("#phone1").val(tel[0]);
                    $("#phone2").val(tel[1]);
                    $("#phone3").val(tel[2]);
                } else { // 지역번호 없는 경우
                    $("#phone2").val(tel[0]);
                    $("#phone3").val(tel[1]);
                }
            }
        },
        cmmErr = function() {
            alert('해당하는 병원이 존재하지 않습니다. 다시 검색해 주세요.');
        };

    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return;
}


/** ================================================================
 *  병원 검색 모달창 종료시 검색 기록 삭제(검색어, 검색 목록)
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#search-hospital-modal").on('hidden.bs.modal', function() {
    $("#search-hospital-list>tbody").html('');
    $("#searchKey").val('');
})

/*---------------------------------------- 병원 검색 API (끝) -----------------------------------------------*/


/*---------------------------------------- 주소 검색 API (시작) -----------------------------------------------*/
/** ================================================================
 *  주소 검색 버튼 클릭 이벤트 - searchAddress() 호출
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#addressBtn").on('click', function() {
    searchAddress();
});


/** ================================================================
 *  주소 검색창 Enter 이벤트 - searchAddress() 호출
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#addressKey").on('keyup', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchAddress();
    }
});


/** ================================================================
 *  주소 검색 api
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function searchAddress() {

    // 검색어 확인
    if ($("#addressKey").val() == '') {
        alert('검색어를 입력해 주세요.');
        return;
    }

    jQuery.ajax({
        url: "http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do",
        type: "POST",
        data: {
            confmKey: "U01TX0FVVEgyMDIzMDYxOTExNDQzODExMzg1OTI=", // 승인키
            currentPage: document.getElementById("currentPage").value, // 현재 페이지 번호
            countPerPage: document.getElementById("countPerPage").value, // 페이지당 출력 개수
            keyword: $("#addressKey").val(),
            resultType: "json"
        },
        dataType: "jsonp",
        crossDomain: true,
        success: function(jsonStr) {
            jQuery("#list").html("");
            let errCode = jsonStr.results.common.errorCode;
            let errDesc = jsonStr.results.common.errorMessage;

            if (errCode == "0") {
                if (jsonStr != null) {
                    makeListJson(jsonStr);
                }
            } else {
                alert(errDesc);
            }
        },
        error: function(xhr, status, error) {
            alert("에러발생");
        }

    });
}


/** ================================================================
 *  주소 검색 모달_주소지 목록 출력
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function makeListJson(jsonStr) {

    let htmlStr = "";
    if (jsonStr.results.common.totalCount > 0) {
        $("#totoalOutcome").css("display", "block");
        $("#totalCnt").html(jsonStr.results.common.totalCount);
        $(jsonStr.results.juso).each(function() {

            let zipNo = this.zipNo; // 우편번호
            let roadAddr = this.roadAddr; // 도로명 주소
            let jibunAddr = this.jibunAddr; // 지번 주소

            htmlStr += "<tr style='cursor:pointer; text-align:center;' onClick='setAddress(\"" + roadAddr + "\");'>";
            htmlStr += "<td>" + zipNo + "</td>";
            htmlStr += "<td>도로명 : " + roadAddr + "<br/>";
            htmlStr += "지번 : " + jibunAddr + "</td>";
            htmlStr += "</tr>";
        });
        pageMake(jsonStr);
    } else {
        alert('검색 결과가 존재하지 않습니다. 다시 검색해 주세요.')
    }
    $("#search-address-list>tbody").html(htmlStr);

}


/** ================================================================
 *  주소 검색 모달_주소 선택 시 도로명 주소 세팅, 모달 종료
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function setAddress(roadAddr) {
    $("#search-address-modal").modal('hide'); // 모달 종료
    $("#hospital-address1-input").val(roadAddr); // 도로명 주소 세팅
    $("#pagingList").html(''); // 페이징 div 초기화
}


/** ================================================================
 *  페이징 생성
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function pageMake(jsonStr) {
    var total = jsonStr.results.common.totalCount; // 총건수
    var pageNum = document.getElementById("currentPage").value; // 현재 페이지
    var pageBlock = Number(document.getElementById("countPerPage").value); // 페이지당 출력 개수
    var paggingStr = "";


    // 총 검색 건수가 페이지당 출력갯수보다 작으면 페이징 출력 X
    if (total > pageBlock) {
        var totalPages = Math.floor((total - 1) / pageNum) + 1;
        var firstPage = Math.floor((pageNum - 1) / pageBlock) * pageBlock + 1;

        if (firstPage <= 0) { firstPage = 1; };
        var lastPage = (firstPage - 1) + pageBlock;

        if (lastPage > totalPages) { lastPage = totalPages; };

        var nextPage = lastPage + 1;
        var prePage = firstPage - pageBlock;

        if (firstPage > pageBlock) {
            paggingStr += "<a style='color:black;' href='javascript:;' onClick='goPage(" + prePage + ");'>◀</a>";
            paggingStr += "&nbsp;";
        }

        for (let num = firstPage; lastPage >= num; num++) {
            if (pageNum == num) { // 현재 페이지와 동일한 경우
                paggingStr += "<a style='font-weight:bold; color:black;' href='javascript:;'>" + num + "</a>";
                paggingStr += "&nbsp;";
            } else {
                paggingStr += "<a style='color:black;' href='javascript:;' onClick='goPage(" + num + ");'>" + num + "</a>";
                paggingStr += "&nbsp;";
            }
        }
        if (lastPage < totalPages) {
            paggingStr += "<a style='color:black;' href='javascript:;' onClick='goPage(" + nextPage + ");'>▶</a>";
        }
    }
    $("#pagingList").html(paggingStr);
}


/** ================================================================
 *  페이징 이동 이벤트
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
function goPage(pageNum) {
    $("#currentPage").attr('value', pageNum); // 현재 페이지 값 변경
    searchAddress();
}


/** ================================================================
 *  주소 검색 모달창 종료시 기록 삭제(검색어, 검색 목록)
 *  @author SY
 *  @since 2023.06.19
 *  @history 2023.06.19 초기 작성
 *  ================================================================
 */
$("#search-address-modal").on('hidden.bs.modal', function() {
    $("#search-address-list>tbody").html('');
    $("#addressKey").val('');
})

/*---------------------------------------- 주소 검색 API (끝) -----------------------------------------------*/

/** ================================================================
 *  약관 모달 세팅
 *  @author SY
 *  @since 2023.06.16
 *  @history 2023.06.16 초기 작성
 *  ================================================================
 */
function showModal(idStr) {
    let txt;
    $("#tos-modal").modal();

    switch (idStr) {
        case 'detail-tos':
            $("#tos-title").text('독닥독닥 서비스 이용약관');
            txt =
                `
            제1장 총칙
            제1조 (목적)
            이 약관은 주식회사 SCI (이하 “회사”라 합니다)가 제공하는
            건강관리 서비스 앱(이하 “APP“라 합니다)의 서비스 이용 및 제공에 관한 제반 사항의 규정을 목적으로 합니다.
            
            제2조 (용어의 정의)
            본 약관에서 사용하는 용어는 다음과 같이 정의한다.
            
            1. “서비스”라 함은 구현되는 PC, 모바일 기기를 통하여 “이용자”가 이용할 수 있는
                보장분석서비스 등 회사가 제공하는 제반 서비스를 의미합니다.
            2. “이용자”란 “APP”에 접속하여 서비스를 이용하는 회원 및 비회원을 말합니다.
            3. “회원”이란 “APP”에 개인정보를 제공하여 회원 등록을 한 자로서,
                “APP”에서 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
            4. “비회원”이란 “APP” 회원등록을 하지 않은 자를 말합니다.
            
            이 약관에서 사용하는 용어의 정의는 본 조 제1항에서 정하는 것을 제외하고는
            관계법령 및 서비스별 정책에서 정하는 바에 의하며,
            이에 정하지 아니한 것은 일반적인 상 관례에 따릅니다.

            제3조 (약관의 효력 및 변경)
            
            1. 본 약관은 회원가입 화면에 게시하여 공시하며 회사는 사정변경 및 영업상 중요한 사유가 있을 경우
               약관을 변경할 수 있으며 변경된 약관은 공지사항을 통해 공시한다.
            2. 본 약관 및 차후 회사 사정에 따라 변경된 약관은 이용자에게 공시함으로써 효력을 발생한다.
            
            제4조 (약관 외 준칙)
            
            본 약관에 명시되지 않은 사항이 전기통신기본법, 전기통신사업법, 정보통신촉진법,
            ‘전자상거래등에서의 소비자 보호에 관한 법률’, ‘약관의 규제에관한법률’, ‘전자거래기본법’,
            ‘전자서명법’, ‘정보통신망 이용촉진등에 관한 법률’, ‘소비자보호법’ 등 기타 관계 법령에
            규정되어 있을 경우 그 규정을 따르도록 한다.
            
            제 2장 이용계약
            제 5조 (이용신청)
            이용신청자가 회원가입 안내에서 본 약관과 개인정보보호정책에 동의하고
            등록절차(회사의 소정 양식의 가입 신청서 작성)를 걸쳐 동의하면 이용신청을 할 수 있다.
            이용신청자는 반드시 실명과 실제 정보를 사용해야 하며 1개의 생년월일에 대하여 1건의 이용신청을 할 수 있다.
            실명이나 실제 정보를 입력하지 않은 이용자는 법적인 보호를 받을 수 없으며, 서비스 이용에 제한을 받을 수 있다.
            
            제 6조 (이용신청의 승낙)
            회사는 제5조에 따른 이용신청자에 대하여 제2항 및 제3항의 경우를 예외로 하여 서비스 이용을 승낙한다.
            회사는 아래 사항에 해당하는 경우에 그 제한사유가 해소될 때까지 승낙을 유보할 수 있다.

            가. 서비스 관련 설비에 여유가 없는 경우
            나. 기술상 지장이 있는 경우
            다. 기타 회사 사정상 필요하다고 인정되는 경우
            3. 회사는 아래 사항에 해당하는 경우에 승낙을 하지 않을 수 있다.
            가. 다른 사람의 명의를 사용하여 신청한 경우
            나. 이용자 정보를 허위로 기재하여 신청한 경우
            다. 사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우
            라. 기타 회사가 정한 이용신청 요건이 미비한 경우
            
            제 3장 계약 당사자의 의무
            제 7조 (회사의 의무)
            
            회사는 사이트를 안정적이고 지속적으로 운영할 의무가 있다.
            회사는 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정될 경우에는 즉시 처리해야 한다.
            단, 즉시 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 공지사항 또는 전자우편을 통해 통보해야 한다.
            제 1항의 경우 수사상의 목적으로 관계기관 및 정보통신윤리위원회의 요청이 있거나 영장 제시가 있는 경우,
            기타 관계 법령에 의한 경우는 예외로 한다.
            
            제 8조 (이용자의 의무)
            이용자는 본 약관 및 회사의 공지사항, APP 이용안내 등을 숙지하고 준수해야 하며
            기타 회사 업무에 방해되는 행위를 해서는 안된다.
            이용자는 회사의 사전 승인 없이 본 사이트를 이용해 어떠한 영리행위도 할 수 없다.
            이용자는 본 사이트를 통해 얻는 정보를 회사의 사전 승낙 없이 복사, 복제, 변경, 변역, 출판, 방송 및
            기타의 방법으로 사용하거나 이를 타인에게 제공할 수 없다.
            
            제 4장 서비스의 제공 및 이용
            
            제 9 조 (서비스 이용)
            이용자는 본 약관의 규정된 사항을 준수해 APP을 이용한다.
            본 약관에 명시되지 않은 서비스 이용에 관한 사항은 회사가 정해 ‘공지사항’에 게시하거나
            또는 별도로 공지하는 내용에 따른다.
            
            제 10 조 (정보의 제공)
            회사는 이용자가 서비스 이용 중 필요하다고 인정되는 다양한 정보에 대하여 전자메일이나
            서신우편 등의 방법으로 회원에게 정보를 제공할 수 있다.
            
            제 11 조 (광고게재)
            회사는 서비스의 운용과 관련하여 서비스 화면, 홈페이지, 전자우편 등에 광고 등을 게재할 수 있다.
            회사는 사이트에 게재되어 있는 광고주의 판촉활동에 회원이 참여하거나
            교신 또는 거래의 결과로서 발생하는 모든 손실 또는 손해에 대해 책임을 지지 않는다.
            
            제 12 조 (서비스 이용의 제한)
            본 사이트 이용 및 행위가 다음 각 항에 해당하는 경우 회사는 해당 이용자의 이용을 제한할 수 있다.
            
            1. 공공질서 및 미풍양속, 기타 사회질서를 해하는 경우
            2. 범죄행위를 목적으로 하거나 기타 범죄행위와 관련된다고 객관적으로 인정되는 경우
            3. 타인의 명예를 손상시키거나 타인의 서비스 이용을 현저히 저해하는 경우
            4. 타인의 의사에 반하는 내용이나 광고성 정보 등을 지속적으로 전송하는 경우
            5. 해킹 및 컴퓨터 바이러스 유포 등으로 서비스의 건전한 운영을 저해하는 경우
            6. 다른 이용자 또는 제3자의 지적재산권을 침해하거나 지적재산권자가 지적 재산권의 침해를
               주장할 수 있다고 판단되는 경우
            7. 타인의 아이디 및 비밀번호를 도용한 경우
            8. 기타 관계 법령에 위배되는 경우 및 회사가 이용자로서 부적당하다고 판단한 경우
            
            제 13 조 (서비스 제공의 중지)
            회사는 다음 각 호에 해당하는 경우 서비스의 전부 또는 일부의 제공을 중지할 수 있다.
            
            1. 전기통신사업법 상에 규정된 기간통신 사업자 또는 인터넷 망 사업자가 서비스를 중지했을 경우
            2. 정전으로 서비스 제공이 불가능할 경우
            3. 설비의 이전, 보수 또는 공사로 인해 부득이한 경우
            4. 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 어려운 경우
            5. 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가 발생하거나 발생할 우려가 있는 경우
            
            제 14 조 (게시물 관리)
            회사는 건전한 통신문화 정착과 효율적인 사이트 운영을 위하여 이용자가 게시하거나 제공하는 자료가
            제12조에 해당한다고 판단되는 경우에 임의로 삭제, 자료이동, 등록거부를 할 수 있다.
            
            제 15 조 (서비스 이용 책임)
            이용자는 회사에서 권한 있는 사원이 서명한 명시적인 서면에 구체적으로 허용한 경우를 제외하고는
            서비스를 이용하여 불법상품을 판매하는 영업활동을 할 수 없으며 특히 해킹, 돈벌기 광고,
            음란 사이트를 통한 상업행위, 상용 S/W 불법제공 등을 할 수 없다.
            이를 어기고 발생한 영업활동의 결과 및 손실, 관계기관에 의한 구속 등 법적 조치 등에 관해서는
            회사가 책임을 지지 않는다.
            
            제 6 장 기타
            제 19 조 (면책 및 손해배상)
            1. 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
               회사의 서비스 제공 책임이 면제된다.
            2. 회사는 이용자간 또는 이용자와 제3자간의 상호거래 관계에서 발생되는 결과에 대하여
               어떠한 책임도 부담하지 않는다.
            3. 회사는 이용자가 게시판에 게재한 정보, 자료, 내용 등에 관하여 사실의 정확성, 신뢰도 등에
               어떠한 책임도 부담하지 않으며 이용자는 본인의 책임 아래 본 사이트를 이용해야 한다.
            4. 이용자가 게시 또는 전송한 자료 등에 관하여 손해가 발생하거나 자료의 취사선택,
              기타 무료로 제공되는 서비스 이용과 관련해 어떠한 불이익이 발생하더라도 이에 대한 모든 책임은 이용자에게 있다.
            5. 아이디와 비밀번호의 관리 및 이용자의 부주의로 인하여 발생되는 손해
               또는 제3자에 의한 부정사용 등에 대한 책임은 이용자에게 있다.
            6. 이용자가 본 약관의 규정을 위반함으로써 회사에 손해가 발생하는 경우 이 약관을 위반한 이용자는
               회사에 발생한 모든 손해를 배상해야 하며 동 손해로부터 회사를 면책시켜야 한다.
            
            제 20 조 (개인신용정보 제공 및 활용에 대한 동의서)
            회사가 회원 가입과 관련해 취득한 개인 신용 정보는 신용정보의 이용 및 보호에 관한 법률
            제23조의 규정에 따라 타인에게 제공 및 활용 시 이용자의 동의를 얻어야 한다.
            이용자의 동의는 회사가 회원으로 가입한 이용자의 신용정보를 신용정보기관, 신용정보업자 및 기타 이용자 등에게
            제공해 이용자의 신용을 판단하기 위한 자료로서 활용하거나
            공공기관에서 정책자료로 활용하는데 동의하는 것으로 간주한다.
            
            제 21 조 (분쟁의 해결)
            1. 회사와 이용자는 본 사이트 이용과 관련해 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 해야 한다.
            2. 제1항의 규정에도 불구하고 동 분쟁으로 인하여 소송이 제기될 경우
               동 소송은 회사의 본사 소재지를 관할하는 법원의 관할로 본다.
            

            <부칙>
            본 약관은 2023년 03월 14일부터 적용한다.

            `;
            $("#tos-contents").text(txt);
            break;

        case 'detail-private':
            $("#tos-title").text('개인정보 수집 이용 동의');
            txt =
                `
            개인정보 수집ㆍ이용 동의(필수 사항)
            
            소프트웨어융합연구소 주식회사(이하 “SCI”)는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라
            다음과 같이 회원의 개인정보를 수집ㆍ이용합니다. 본 개인정보의 수집ㆍ이용에 동의하지 않으실 경우
            어플리케이션을 통한 회원가입이 불가능하며, SCI에서 제공하는 서비스를 이용할 수 없습니다.
                        
            1. 개인정보 수집ㆍ이용 목적

            (1) 홈페이지 회원 가입 및 관리
                회원가입 의사확인, 본인 식별ㆍ인증, 회원자격 유지ㆍ관리, 서비스 부정이용 방지,
                이용약관 위반 회원에 대한 이용제한 조치, 서비스의 원활한 운영에 지장을 미치는 행위 및
                서비스 부정이용행위 제재, 가입 및 가입횟수 제한, 탈퇴의사 확인

            (2) 재화 또는 서비스 제공
                웹/모바일 홈페이지, 어플리케이션을 통한 서비스(병원 별 환자 관리)제공,
                서비스 이용과 관련된 회원확인 등 문제해결
                        
            (3) 서비스 개선
                웹 홈페이지, 모바일 홈페이지, 어플리케이션(이용약관 상 정의에 따름)을 이용한 서비스를 이용자의 컴퓨터 등
                정보통신기기에 최적화된 방식으로 제공할 수 있도록 개선, 서비스 개발, 개선 등
                SCI의 업무와 관련된 통계자료의 작성
                        
            (4) 민원 처리
                민원인의 신원확인, 민원사항 확인, 사실조사를 위한 연락ㆍ통지, 처리결과 통보
                        
            2. 수집하는 개인정보
                        
            (1) 회원정보: 성명, 연락처, 이메일 
            (2) 재화 또는 서비스 제공(센서 구매 시): 제품 배송 및 서비스 이행: 배송(조립)지 주소, 휴대전화번호
                        
            3. 개인정보의 보유ㆍ이용 기간
                        
            (1) 수집된 개인정보는 원칙적으로 회원가입 시부터 회원탈퇴 시까지 이용됩니다.          
            (2) 회원탈퇴 시 개인정보를 보유해야 하는 경우 또는 이미 발생한 민원처리 등
                회원탈퇴 이후에도 개인정보를 이용하여야 하는 사유가 있는 경우를 제외하고는
                개인정보를 지체 없이 관련 법령이 정한 바에 따라 파기합니다.
                        
            `;
            $("#tos-contents").text(txt);
            break;

        case 'detail-provide':
            $("#tos-title").text('개인정보 제3자 제공 동의');
            txt = `
            개인정보 제3자 제공 동의(선택 사항)
            
            본인은 아래의 수집 · 이용 목적을 위해 표에 열거된 본인의 개인(신용) 정보를
            제 3자에게 제공 및 이용하는 것에 대해 동의합니다.
                        
            1. 제공받는자
            (주)소프트웨어융합연구소, 기타 협력기관(서비스 이용 동물병원)     

            2. 이용목적
            관리 대상자 모니터링 및 
            협력기관과 협업을 통해 더 나은 서비스 제공하기 위함

            3. 개인정보 제공 항목
            병원 정보 : 병원명, 병원 주소, 병원 연락처, 운영시간, 문의 답변 시간
            담당자 정보 : 담당자 성명, 담당자 연락처, 담당자 이메일 

            4. 보유기간
            회원 탈퇴 시까지
            
            `;
            $("#tos-contents").text(txt);
            break;
    }
}