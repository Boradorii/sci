/** ================================================================
 *  아이디 찾기 js
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */


let account_id; // 유저 아이디

/** ================================================================
 *  입력 양식 유효성 검사
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function checkInput() {
    let nameChk = true;
    let emailChk = true;

    if($("#name-input").val()=='') {
        $('#name-notice').addClass('active-notice');
        $('#name-notice').removeClass('deactive-notice');
        nameChk = false;
    } else{
        $('#name-notice').addClass('deactive-notice');
        $('#name-notice').removeClass('active-notice');   
    }

    if($("#email-input").val()=='' | $("#email-input2")) {
        $('#email-notice').addClass('active-notice');
        $('#email-notice').removeClass('deactive-notice');
        emailChk = false;
    } else{
        $('#email-notice').addClass('deactive-notice');
        $('#email-notice').removeClass('active-notice');
    }

    // 유효성 검사 완료 시 true(1) 반환
    return nameChk&emailChk;
}

/** ================================================================
 *  사용자 여부 확인 (이름, 이메일 존재 여부 확인)
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function findId() {
    let isOk = false;

    let cmmContentType = 'application/json',
    cmmType = 'get',
    cmmUrl = '/api/find/account',
    cmmReqDataObj = {
        id: $("#id-input").val(),
        name: $("#name-input").val(),
        eId: $("#email-input").val(),
        eDomain: $("#email-input2").val()
    },
    cmmAsync = false,
    cmmSucc = function (result) {
        if (result.rowLength > 0) {
            account_id = result.row.h_user_account_id;
            isOk = true;
        } else {
            alert('입력하신 정보와 일치하는 사용자가 존재하지 않습니다.');
        }
    },
    cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    return isOk;
}


/** ================================================================
 *  인증번호 전송 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#sendNumber").on('click', function() {

    if(!checkInput()) {
        alert('입력 양식을 확인해 주세요.');
        return;
    }

    if(findId()) {  // 이름, 이메일 일치하는 사용자 존재
        $("#sendNumber").toggle();  // 인증번호 전송 버튼 X
        $("#wait-notice").toggle(); // 대기 문구 O
        $("#authnumber").val('');   // 인증번호 입력란 초기화
    
        setTimeout(function() {
            sendEmail();    // 메일 전송
        }, 50);
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

    $("#authnumber").val('');
    $("#sendNumber").toggle();  // 인증번호 전송 버튼 O
    $("#resendNumber").toggle();    // 재전송 버튼 X

    $("#input-authnumber").toggle();    // 인증번호 div X
    $("#email-input").attr('readonly', false);
    $("#email-input2").attr('readonly', false);

})


/** ================================================================
 *  이메일 전송
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function sendEmail() {
    $("#wait-notice").toggle(); // 대기 문구 X
    $("#resendNumber").toggle();    // 재전송 버튼 O

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
                $('#sendNumber').toggle();  // 인증번호 전송 버튼 O
            } else { // 메일 전송 성공 시
                $('#input-authnumber').toggle();    // 인증번호 입력 div O
                $("#email-input").attr('readonly', true);   // 이메일 아이디 readonly
                $("#email-input2").attr('readonly', true);   // 이메일 도메인 readonly
                
                authnumber = result.authNumber;
            }
        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
}


/** ================================================================
 *  인증번호 확인 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$('#checknumber').on('click', function() {
    if (validator($('#authnumber').val(), 'isEmpty')) {
        alert('인증번호를 입력해 주세요.');
    } else {
        if ($('#authnumber').val() == authnumber) {
            alert('이메일 인증에 성공하였습니다.');
            $("#sendNumber").toggle();
            $("#resendNumber").toggle();
            $('#input-authnumber').toggle();

            $("#result-modal").modal('show');
            $("#id-result").text(account_id);

        } else {
            alert('인증에 실패하였습니다. 인증번호를 다시 입력해 주세요.');
        }
    }
})

/** ================================================================
 *  이메일 도메인 change 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#email-select-input2").on('change', function(){
    if($(this).val()=='직접입력'){
        $("#email-input2").val('');
    }else{
        $("#email-input2").val($(this).val());
    }
});


/** ================================================================
 *  모달창 종료시 아이디 찾기 페이지 새로고침
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#result-modal").on('hidden.bs.modal', function(){
    location.reload();
});


/** ================================================================
 *  모달창 클릭 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$('.modal-btn').on('click', function (evnt) {
    let targetId = evnt.target.id;
    switch (targetId) {
        case 'modal-login-btn': // 로그인
            location.href = baseUrl;
            break;
        case 'modal-pw-btn':    // 비밀번호 찾기
            location.href = baseUrl + '/findUserPw';
            break;
    }
});