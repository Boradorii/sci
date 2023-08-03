let $idInput = $('#id-input'),
    $pwInput = $('#pw-input');
$(function() {
    $(".preloader").fadeOut();
});
$(function() {
    $('[data-toggle="tooltip"]').tooltip()
});

$('#login-btn').on("click", function() {
    if ($idInput.val() != null && $pwInput.val() != null) {
        let cmmContentType = 'application/json',
            cmmType = 'post',
            cmmUrl = '/api/userLogin',
            cmmReqDataObj = {
                accountId: $idInput.val(),
                accountPw: $pwInput.val(),
            },
            cmmAsync = false,
            cmmSucc = function(result) {
                let h_adminCode = result.userCode;
                // let userName = result.userName
                if (result.messageCode == 'ExistUser') {
                    setSessionStorage('h_adminCode', '' + h_adminCode);
                    setSessionStorage('accessToken', '' + result.accessToken)
                    culPageUrl = baseUrl + '/patient/patient/' + h_adminCode;
                    setSessionStorage('culPageUrl', culPageUrl);
                    localStorage.setItem('hosName', result.hosname);
                    changeView(culPageUrl, '');
                } else {
                    alert('아이디 또는 비밀번호를 다시 입력해 주세요.');
                }
            },
            cmmErr = function() {
                alert('로그인 실패');
                location.href = '/api';
            };


        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    } else {
        alert('아이디 또는 비밀번호를 다시 입력해 주세요.')
            // 로그인 구현 후 삭제 필요
            // culPageUrl = baseUrl + '/patient/patient/' + h_adminCode;
            // setSessionStorage('culPageUrl', culPageUrl)
            // changeView(culPageUrl, '');
            // 로그인 구현 후 삭제 필요
    }
})

$('#signup-btn').on("click", function() {
    window.location = baseUrl + "/signUp"
})

$('#find-id').on("click", function() {
    window.location = baseUrl + "/findUserId"
})

$('#find-pw').on("click", function() {
    window.location = baseUrl + "/findUserPw"
})


/** ================================================================
 *  로그인 폼 enter 이벤트
 *  @author SY
 *  @since 2023.06.21
 *  @history 2023.06.21 초기 작성
 *  ================================================================
 */
$(".form-group").on('keyup', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        $("#login-btn").click();
    }
})