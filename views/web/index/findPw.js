/** ================================================================
 *  비밀번호 찾기/변경 js
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */


// 비밀번호 유효성 검증용 변수
let pwdChk1 = false,
    pwdChk2 = false; 

    
/** ================================================================
 *  입력 양식 유효성 검사
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function checkInput() {
    let idChk = true;
    let nameChk = true;
    let emailChk = true;
    idPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/

    if (!idPattern.test($("#id-input").val())) { // 아이디 유효성 검사
        $("#id-notice").removeClass('deactive-notice');
        $("#id-notice").addClass('active-notice');
        idChk = false;
    } else {
        $("#id-notice").removeClass('active-notice');
        $("#id-notice").addClass('deactive-notice');
    }
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
    return idChk & nameChk & emailChk;
}


/** ================================================================
 *  사용자 여부 확인 (아이디, 이름, 이메일 존재 여부 확인)
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function findPwd() {
    let isOk = false;

    let cmmContentType = 'application/json',
    cmmType = 'post',
    cmmUrl = '/api/findUser',
    cmmReqDataObj = {
        id: $("#id-input").val(),
        name: $("#name-input").val(),
        eId: $("#email-input").val(),
        eDomain: $("#email-input2").val()
    },
    cmmAsync = false,
    cmmSucc = function (result) {
        if (result.rowLength > 0) {
            $("#modal-user-code").attr('value', result.row.h_user_code);
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
    console.log(checkInput());
    if(!checkInput()) {
        alert('입력 양식을 확인해 주세요.');
        return;
    }

    if(findPwd()) {  // 이름, 이메일 일치하는 사용자 존재
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

            $("#modify-modal").modal('show');
        } else {
            alert('인증에 실패하였습니다. 인증번호를 다시 입력해 주세요.');
        }
    }
});


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
 *  모달_비밀번호 변경 버튼 클릭 이벤트
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#modal-submit-btn").on('click', function(){

    formCheck('pwd-input');
    formCheck('pwd-confirm-input');

    if(pwdChk1&pwdChk2){
        let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/modify/password',
        cmmReqDataObj = {
            userCode : $("#modal-user-code").val(),
            pwd: $("#pwd-input").val()
        },
        cmmAsync = false,
        cmmSucc = function (result) {
            if (result.state) {
                alert('비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.');
                location.href = baseUrl;
                return;
            } else {
                alert('수정 실패하였습니다. 다시 시도해 주세요.');
                location.reload();
                return;
            }
        },
        cmmErr = function () {
            alert(i18next.t('수정 실패! 잠시후 다시 실행해주세요.'));
        };
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    }else{
        alert('입력 양식을 확인해 주세요.');
        return;
    }
});


/** ================================================================
 *  입력 양식 실시간 검사
 * (입력란 클릭, 값 변경, 붙여넣기 등의 이벤트가 발생하는 경우)
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$('.form-control').not('.notval').on('click input change keyup keydown paste focusout', function(evnt) {
    let targetId;
    if (evnt != null) {
        targetId = evnt.target.id; //이벤트 발생 지점의 id
    }
    formCheck(targetId);    // 회원가입 양식 검사 호출
});


/** ================================================================
 *  비밀번호 변경
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
function formCheck(targetId) {
    let targetVal = $('#' + targetId).val();
    let pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&*()_+])[A-Za-z\d!@#$%&*()_+]{9,16}$/;

    switch (targetId) {
        case 'pwd-input':    // 담당자 비밀번호
            if (!pwdPattern.test(targetVal)) {
                $("#pwd-notice").removeClass('deactive-notice');
                $("#pwd-notice").addClass('active-notice');
            } else {
                $("#pwd-notice").removeClass('active-notice');
                $("#pwd-notice").addClass('deactive-notice');
                pwdChk1 = true;
            }
            break;

        case 'pwd-confirm-input':   // 담당자 비밀번호 확인
            if ($("#pwd-input").val() != targetVal) {
                $("#pwd-confirm-notice").removeClass('deactive-notice');
                $("#pwd-confirm-notice").addClass('active-notice');
            } else {
                $("#pwd-confirm-notice").removeClass('active-notice');
                $("#pwd-confirm-notice").addClass('deactive-notice');
                pwdChk2 = true;
            }
            break;
    };
}


/** ================================================================
 *  모달창 종료시 비밀번호 찾기 페이지 새로고침
 *  @author SY
 *  @since 2023.06.20
 *  @history 2023.06.20 초기 작성
 *  ================================================================
 */
$("#modify-modal").on('hidden.bs.modal', function(){
    location.reload();
});
