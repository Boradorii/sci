let emailId;
let emailDomain;
let inputList = {}; // 회원가입 입력값 저장 리스트
let emailCheck = false, // 이메일 아이디 유효성 검사 여부
    domainCheck = false; // 이메일 도메인 유효성 검사 여부
let authCheck = false; // 이메일 인증 완료 여부

function init() {
    console.log(p_userCode)
    $('#password-modal').modal('show');
}

// 비밀번호 확인
function aPwCheck() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/aPwCheck',
        cmmReqDataObj = {
            'p_userCode': p_userCode,
            'pw': $('#pw-check-input').val()
        },
        cmmAsync = false,
        cmmSucc = function aPwCheck(result) {
            if (result.state == true) {
                // 모달창 닫기
                $('#password-modal').modal('hide');
                myInfoLoad();
            } else {
                if ($('#pw-check-input').val() == "") {
                    Swal.fire({
                        html: '비밀번호를 입력해 주세요.',
                    });
                } else {
                    Swal.fire({
                        html: '비밀번호가 일치하지 않습니다.<br>다시 입력해 주세요.',
                    });
                }
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

// 이메일 변경 버튼 클릭 이벤트
$("#edit-emailBtn").on('click', function() {
    $("#edit-emailBtn").toggle();
    $("#edit-emailBtn2").toggle();
    $("#email-input").attr('readonly', false);
    $("#email-input2").attr('readonly', false);
    $("#email-select-input2").toggle();
    $("#authnumber").val("");
    $("#e-auth-notice").css("display", "none");

    $("#input-authnumber").toggle();
    authCheck = false;

    selectOption(emailId);
    if ($('#email-select-input2').val() == emailDomain) {
        $('#email-input2').attr('readonly', true);
    }
});

// 이메일 변경 취소 버튼 클릭 이벤트
$("#edit-emailBtn2").on('click', function() {
    $("#edit-emailBtn").toggle();
    $("#edit-emailBtn2").toggle();
    $("#email-input").attr('readonly', true);
    $("#email-input2").attr('readonly', true);
    $("#email-select-input2").toggle();

    $("#email-input").val(emailId);
    $("#email-input2").val(emailDomain);
    $("#email-select-input2").val(emailDomain);
    authCheck = true;

    $("#input-authnumber").toggle();
});

// 이메일 변경버튼 클릭시 도메인 option값 자동선택
function selectOption(emailId) {
    let selectElement = document.getElementById("email-select-input2");
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === emailDomain) {
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

// 회원가입 입력 양식 실시간 검사
$('.form-control').not('.notval').on('click input change keyup keydown paste focusout', function(evnt) {
    let targetId;
    if (evnt != null) {
        targetId = evnt.target.id; //이벤트 발생 지점의 id
    }

    // 주소 검색 input 제외
    if (evnt.target.id == 'addressKey') {
        return;
    }

    formCheck(targetId); // 회원가입 양식 검사 호출
});

//회원가입 양식 검사 (유효성 검사)
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
    let emailDupl
        // 연락처 중복 확인
    let phoneDupl
    switch (targetId) {
        case 'name-input': // 이름
            if (!namePatternKr.test(targetVal)) { // 국문
                $("#user-name-notice").removeClass('deactive-notice');
                $("#user-name-notice").addClass('active-notice');
            } else {
                $("#user-name-notice").removeClass('active-notice');
                $("#user-name-notice").addClass('deactive-notice');
                inputList.p_user_name = targetVal;
            }
            break;

        case 'pw-input': // 비밀번호
            if (targetVal != '')
                if (!pwdPattern.test(targetVal)) {
                    $("#pwd-notice").removeClass('deactive-notice');
                    $("#pwd-notice").addClass('active-notice');
                } else {
                    $("#pwd-notice").removeClass('active-notice');
                    $("#pwd-notice").addClass('deactive-notice');
                    inputList.p_account_pw = targetVal;
                }
            break;

        case 'newPw-input': // 비밀번호 확인
            if (targetVal != '')
                if ($("#pw-input").val() != targetVal) {
                    $("#pwd-confirm-notice").removeClass('deactive-notice');
                    $("#pwd-confirm-notice").addClass('active-notice');
                } else {
                    $("#pwd-confirm-notice").removeClass('active-notice');
                    $("#pwd-confirm-notice").addClass('deactive-notice');
                }
            break;

        case 'phone1': // 연락처 1
            if (phoneDuplicateCheck($("#phone1").val(), $("#phone2").val(), $("#phone3").val())) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#phone1").val()) || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.p_phone_first = targetVal;
                }
            }
            break;

        case 'phone2': // 연락처 2
            if (phoneDuplicateCheck($("#phone1").val(), $("#phone2").val(), $("#phone3").val())) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');

                if (!phonePattern1.test($("#phone1").val()) || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.p_phone_middle = targetVal;
                }
            }
            break;

        case 'phone3': // 연락처 3
            if (phoneDuplicateCheck($("#phone1").val(), $("#phone2").val(), $("#phone3").val())) {
                $("#phone-dupl-notice").removeClass('deactive-notice');
                $("#phone-dupl-notice").addClass('active-notice');
                $("#phone-notice").removeClass('active-notice');
                $("#phone-notice").addClass('deactive-notice');
            } else {
                $("#phone-dupl-notice").removeClass('active-notice');
                $("#phone-dupl-notice").addClass('deactive-notice');
                if (!phonePattern1.test($("#phone1").val()) || !phonePattern2.test($("#phone2").val()) || !phonePattern3.test($("#phone3").val())) {
                    $("#phone-notice").removeClass('deactive-notice');
                    $("#phone-notice").addClass('active-notice');
                } else {
                    $("#phone-notice").removeClass('active-notice');
                    $("#phone-notice").addClass('deactive-notice');
                    inputList.p_phone_last = targetVal;
                }
            }
            break;

        case 'address1-input':
            if (targetVal == '') { // 도로명 주소
                $("#address1-notice").removeClass('deactive-notice');
                $("#address1-notice").addClass('active-notice');
                $("#address2-notice").removeClass('active-notice');
                $("#address2-notice").addClass('deactive-notice');
            } else {
                $("#address1-notice").removeClass('active-notice');
                $("#address1-notice").addClass('deactive-notice');
                inputList.p_address_1 = targetVal;
            }
            break;

        case 'address2-input':
            if (targetVal == '') { // 상세 주소
                $("#address2-notice").removeClass('deactive-notice');
                $("#address2-notice").addClass('active-notice');
                $("#address1-notice").removeClass('active-notice');
                $("#address1-notice").addClass('deactive-notice');
            } else {
                $("#address2-notice").removeClass('active-notice');
                $("#address2-notice").addClass('deactive-notice');
                inputList.p_address_2 = targetVal;
            }
            break;


        case 'email-input': // 이메일 아이디
            if (emailDuplicateCheck($("#email-input").val(), $("#email-input2").val())) {
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
                    inputList.p_email_id = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;

        case 'email-input2': // 이메일 도메인
            if (emailDuplicateCheck($("#email-input").val(), $("#email-input2").val())) {
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
                    inputList.p_email_domain = targetVal;
                    emailCheck = true;
                    domainCheck = true;
                }
            }
            break;
    }
}


// 내정보 불러오기
function myInfoLoad() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/myInfoLoad',
        cmmReqDataObj = {
            'p_userCode': p_userCode
        },
        cmmAsync = false,

        cmmSucc = function myInfoLoad(result) {

            $("#name-input").val(result.rows[0].p_user_name);
            $("#id-input").val(result.rows[0].p_account_id);
            $('#pw-input').val("");
            $('#newPw-input').val("");
            $("#phone1").val(result.rows[0].p_phone_first);
            $("#phone2").val(result.rows[0].p_phone_middle);
            $("#phone3").val(result.rows[0].p_phone_last);
            $("#address1-input").val(result.rows[0].p_address_1);
            $("#address2-input").val(result.rows[0].p_address_2);
            $("#phone").val(result.rows[0].h_telnum);
            $("#email-input").val(result.rows[0].p_email_id);
            $("#email-input2").val(result.rows[0].p_email_domain);

            $("#email-input").attr('readonly', true);
            $("#email-input2").attr('readonly', true);
            emailId = result.rows[0].p_email_id;
            emailDomain = result.rows[0].p_email_domain;
            authCheck = true;

            selectOption(emailDomain);
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 이메일 중복 검사
function emailDuplicateCheck(emailIdStr, emailDomainStr) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_mypage/email',
        cmmReqDataObj = {
            'eIdString': emailIdStr,
            'eDomainString': emailDomainStr,
            'p_userCode': p_userCode
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}

// 연락처 중복 검사
function phoneDuplicateCheck(phone1, phone2, phone3) {
    let isOk = '';
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_mypage/phone',
        cmmReqDataObj = {
            'phone1': phone1,
            'phone2': phone2,
            'phone3': phone3,
            'p_userCode': p_userCode
        },
        cmmAsync = false,
        cmmSucc = function(result) {
            isOk = result;
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}


// 인증번호 전송 클릭 이벤트
$("#sendnumber").on('click', function() {

    formCheck('email-input');
    formCheck('email-input2');

    authCheck = false;

    if (emailCheck & domainCheck) { // 이메일 아이디, 도메인 유효성 검사 여부
        $("#sendNumber").toggle(); // 인증번호 전송 버튼 X
        $("#authnumber").val(''); // 인증번호 입력란 초기화

        setTimeout(function() {
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
        cmmSucc = function(result) {
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
$('#checknumber').on('click', function() {
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
    // 내정보 입력값 받아오기
function getInput() {
    inputList = {};
    $('.form-control').each(function(index, item) {
        formCheck($(item).attr('id'));

    });
    return inputList;
}

// 내정보 수정하기
function myInfoModify(p_userCode) {
    let inputList = getInput();
    let checknum
    if ($('#pw-input').val() == '') {
        checknum = 8
    } else {
        checknum = 10
    }
    if (Object.keys(inputList).length != checknum) { // 정보 입력 양식 확인
        alert('내 정보 입력 양식을 확인해 주세요.')
        return;
    }

    if (!authCheck) { // 이메일 인증 여부 확인
        alert('이메일 인증을 완료해 주세요.');
        return;
    }

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/myInfoModify',
        cmmReqDataObj = {
            'p_userCode': p_userCode,
            'inputList': inputList
        },
        cmmAsync = false,
        cmmSucc = function(result) {
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
                    icon: 'error',
                    title: '수정 실패',
                    text: '수정 실패하였습니다.\n다시 시도해 주세요.',
                });
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

//  내 정보 수정
$("#modifyBtn").click(function() {
    myInfoModify(p_userCode)
});

$('#serviceEndBtn').click(function() {
    $("#withdrawal-modal").modal("show");

});

// 서비스 종료
function withdrawService() {
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/withdrawService',
        cmmReqDataObj = {
            'p_userCode': p_userCode
        },
        cmmAsync = false,
        cmmSucc = function withdrawService(result) {
            $('#withdrawal-modal').modal('hide');

            if (result.state == true) {
                Swal.fire({
                    html: '회원님의 계정이 탈퇴 처리되었습니다.<br>서비스를 이용해 주셔서 감사합니다.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 로그인 화면으로 이동 및 세션 삭제
                        window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                            action: 'logout'
                        }, '*');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '실패',
                    html: '실패하였습니다.<br>다시 시도해 주세요.',
                });
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};


/*---------------------------------------- 주소 검색 API (시작) -----------------------------------------------*/

//  주소 검색 버튼 클릭 이벤트 - searchAddress() 호출
$("#addressBtn").on('click', function() {
    searchAddress();
});


//  주소 검색창 Enter 이벤트 - searchAddress() 호출
$("#addressKey").on('keyup', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchAddress();
    }
});


// 주소 검색 api
function searchAddress() {

    // 검색어 확인
    if ($("#addressKey").val() == '') {
        alert('검색어를 입력해 주세요.');
        return;
    }

    jQuery.ajax({
        url: "https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do",
        type: "POST",
        data: {
            confmKey: "U01TX0FVVEgyMDIzMDYxOTExNDQzODExMzg1OTI=", // 발급받은 승인키 입력
            currentPage: document.getElementById("currentPage").value, // 현재 페이지 번호
            countPerPage: document.getElementById("countPerPage").value, // 페이지당 출력 개수 (5개로 설정!)
            keyword: $("#addressKey").val(), // 검색어
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


//주소 검색 모달_주소지 목록 출력
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


//주소 검색 모달_주소 선택 시 도로명 주소 세팅, 모달 종료
function setAddress(roadAddr) {
    $("#search-address-modal").modal('hide'); // 모달 종료
    $(".modal-backdrop.show").css('display', 'none');
    $("#address1-input").val(roadAddr); // 도로명 주소 세팅
    $("#pagingList").html(''); // 페이징 div 초기화

}


//페이징 생성
function pageMake(jsonStr) {
    var total = jsonStr.results.common.totalCount; // 총건수
    var pageNum = document.getElementById("currentPage").value; // 현재 페이지
    var pageBlock = Number(document.getElementById("countPerPage").value); // 페이지당 출력 개수
    var paggingStr = "";


    // 총 검색 건수가 페이지당 출력갯수보다 작으면 페이징 출력 X
    // 이부분은 따로 고칠 필요는 없으나 필요 시 인수인계 파일 도로명 주소 API 관련.txt 참고
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


// 페이징 이동 이벤트

function goPage(pageNum) {
    $("#currentPage").attr('value', pageNum); // 현재 페이지 값 변경
    searchAddress();
}


//주소 검색 모달창 종료시 기록 삭제(검색어, 검색 목록)

$("#search-address-modal").on('hidden.bs.modal', function() {
    $("#search-address-list>tbody").html('');
    $("#addressKey").val('');
});

/*---------------------------------------- 주소 검색 API (끝) -----------------------------------------------*/