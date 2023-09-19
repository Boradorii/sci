async function init() {
    console.log(userInfo)
    $('#name-input').val(userInfo.row.name)
    $('#id-input').val(userInfo.row.account_id)
    $('#phone1').val(userInfo.row.phone_first)
    $('#phone2').val(userInfo.row.phone_middle)
    $('#phone3').val(userInfo.row.phone_last)
    $('#email-input').val(userInfo.row.email_id)
    $('#email-input2').val(userInfo.row.email_domain)
}

// 회원 정보 수정
$('#submit-btn').on('click', function() {
    let nameInput = $('#name-input').val()
    let PWInput = $('#pwd-input').val()
    let PWConfirmInput = $('#pwd-confirm-input').val()
    let phone1Input = $('#phone1').val()
    let phone2Input = $('#phone2').val()
    let phone3Input = $('#phone3').val()

    let name_length = validator($('#name-input').val(), 'stringLength')
    let PW_length = validator($('#pwd-input').val(), 'bytesLength')
    let PWConfirm_length = validator($('#pwd-confirm-input').val(), 'bytesLength')
    let phone1_length = validator($('#phone1').val(), 'bytesLength')
    let phone2_length = validator($('#phone2').val(), 'bytesLength')
    let phone3_length = validator($('#phone3').val(), 'bytesLength')

    let form_check = 0

    if (name_length == 0) {
        $('#name-notice').removeClass('deactive-notice')
        $('#name-notice').addClass('active-notice')
        $("#name-notice").css("color", "red");
    } else if (name_length < 2 || name_length > 8) {
        $('#name-notice').removeClass('deactive-notice')
        $('#name-notice').addClass('active-notice')
        $("#name-notice").css("color", "red");
    } else {
        $('#name-notice').removeClass('active-notice')
        $('#name-notice').addClass('deactive-notice')
        form_check += 1
    }

    if (PW_length == 0 && PWConfirm_length == 0) {
        $('#pwd-notice').removeClass('active-notice')
        $('#pwd-notice').addClass('deactive-notice')
        form_check += 1
    }

    if (PW_length != 0) {
        if (validator($('#pwd-input').val(), 'isCombEngNumSp') == false) {
            $('#pwd-notice').removeClass('deactive-notice')
            $('#pwd-notice').addClass('active-notice')
            $("#pwd-notice").css("color", "red");
            $("#pwd-confirm-notice").css("color", "red");
        } else if (PWInput != PWConfirmInput) {
            $('#pwd-confirm-notice').removeClass('deactive-notice')
            $('#pwd-confirm-notice').addClass('active-notice')
            $("#pwd-confirm-notice").css("color", "red");
        } else {
            $('#pwd-notice').removeClass('active-notice')
            $('#pwd-notice').addClass('deactive-notice')
            $('#pwd-confirm-notice').removeClass('active-notice')
            $('#pwd-confirm-notice').addClass('deactive-notice')
            form_check += 1
        }
    }

    if (phone1_length == 3 && phone2_length == 4 && phone3_length == 4) {
        $('#phone-notice').removeClass('active-notice')
        $('#phone-notice').addClass('deactive-notice')
        form_check += 1
    } else {
        $('#phone-notice').removeClass('deactive-notice')
        $('#phone-notice').addClass('active-notice')
        $("#phone-notice").css("color", "red");
    }

    if (form_check == 3) {
        let usercode = userCode
        let cmmContentType = 'application/json',
            cmmType = 'post',
            cmmUrl = '/api/mypage/duplicatePhone',
            cmmReqDataObj = {
                userCode: usercode,
                phone1Input: phone1Input,
                phone2Input: phone2Input,
                phone3Input: phone3Input
            },
            cmmAsync = false,
            cmmSucc = function(result) {
                if (result == true) {
                    $("#phone-duplicate-notice").removeClass('deactive-notice')
                    $("#phone-duplicate-notice").addClass('active-notice')
                    $("#phone-duplicate-notice").css("color", "red");
                } else {
                    $("#phone-duplicate-notice").removeClass('active-notice')
                    $("#phone-duplicate-notice").addClass('deactive-notice')
                    let cmmContentType = 'application/json',
                        cmmType = 'post',
                        cmmUrl = '/api/mypage/updateUserInfo',
                        cmmReqDataObj = {
                            userCode: usercode,
                            nameInput: nameInput,
                            PWInput: PWInput,
                            PWConfirmInput: PWConfirmInput,
                            phone1Input: phone1Input,
                            phone2Input: phone2Input,
                            phone3Input: phone3Input
                        },
                        cmmAsync = false,
                        cmmSucc = function(result) {
                            if (result.state == true) {
                                Swal.fire({
                                    title: InformationModified,
                                    icon: 'success',
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    timer: 2500,
                                    willClose: () => {
                                        window.parent.postMessage({
                                            action: 'MyPage'
                                        }, '*'); // TO-DO: 임시로 모든 도메인 허용(*)하였음. 추후 수정할 것
                                    }
                                })
                            } else {
                                Swal.fire({
                                    title: Retry,
                                    icon: 'error',
                                    showConfirmButton: false,
                                    timer: 2500
                                })
                            }
                        },
                        cmmErr = function() {
                            alert('error')
                        };
                    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr)
                }
            },
            cmmErr = function() {
                alert('error')
            };
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr)
    }
})

// 회원 탈퇴
$('#delete-btn').on('click', function() {
    Swal.fire({
        title: WithdrawalAlert,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: Withdrawal,
        cancelButtonText: Cancellation,
        confirmButtonColor: '#FF0000',
    }).then((result) => {
        if (result.isConfirmed) {
            let usercode = userCode
            let cmmContentType = 'application/json',
                cmmType = 'post',
                cmmUrl = '/api/mypage/deleteUser',
                cmmReqDataObj = {
                    userCode: usercode
                },
                cmmAsync = false,
                cmmSucc = function(result) {
                    if (result.succ == 1) {
                        Swal.fire({
                            title: WithdrawalCompleted,
                            icon: 'success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 2500,
                            willClose: () => {
                                window.parent.postMessage({
                                    action: 'IntroPage'
                                }, '*'); // TO-DO: 임시로 모든 도메인 허용(*)하였음. 추후 수정할 것
                            }
                        })
                    } else {
                        Swal.fire({
                            title: Retry,
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 2500
                        })
                    }
                },
                cmmErr = function() {
                    alert('error')
                };
            commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr)
        }
    });
});