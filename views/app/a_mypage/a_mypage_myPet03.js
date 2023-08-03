loadModifyPageData(modifyPetId);

// 수정 페이지로 이동시 데이터 불러오기
function loadModifyPageData(petId) {
    let currentYear = new Date().getFullYear();
    console.log("돌아가나여?", petId)
    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/loadModifyPageData',
        cmmReqDataObj = {
            petId: petId
        },
        cmmAsync = false,

        cmmSucc = function loadModifyPageData(result) {
            $('#modify_name').val(result.row.pet_name);
            $('#modify_age').val(currentYear - result.row.pet_byear);
            $('#modify_weight').val(result.row.pet_weight);
            if (result.row.pet_gender == 'M') {
                $('#modify_male').prop('checked', true);
            } else {
                $('#modify_female').prop('checked', true);
            }

            if (result.row.pet_isNeutering == 'Y') {
                $('#modify_neuteredRadioY').prop('checked', true);
            } else {
                $('#modify_neuteredRadioN').prop('checked', true);
            }
            $("#modify_kind").val(result.row.pet_breed);
            $("#modify_code").val(result.row.pet_code);

            console.log($('#modify_name').val());

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

$('#modify_delete').click(function () {
    Swal.fire({
        icon: 'warning',
        title: '삭제하시겠습니까?',
        text: '삭제 후에 다시 되돌릴 수 없습니다.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            // Perform the deletion here
            Swal.fire({
                icon: 'success',
                title: '삭제 성공!',
                text: '삭제하였습니다.',
            }).then((result) => {
                if (result.isConfirmed) {
                    myPetDelete(modifyPetId);
                    let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
                    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                        action: 'go-petManage'
                    }, '*');
                    location.href = reqUrl;

                }
            });


        } else {
            // Action canceled
            Swal.fire({
                icon: 'info',
                title: '삭제 취소',
                text: '취소하였습니다.',
            });
        }
    });


});

// 반려견 삭제
function myPetDelete(modifyPetId) {

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/myPetDelete',
        cmmReqDataObj = {
            p_user_code: p_userCode,
            petId: modifyPetId
        },
        cmmAsync = false,

        cmmSucc = function myPetDelete(result) {
            if (result.succ == 1) {
                Swal.fire({
                    icon: 'success',
                    title: '삭제 성공!',
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
            } else {

            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}


// 반려견 등록 페이지에서 취소 버튼
$('#modify_cancel').click(function () {

    let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
        action: 'go-petManage'
    }, '*');
    location.href = reqUrl;

});

// 반려견 수정 버튼
$('#modifyBtn').click(function () {
    modifyMyPet(modifyPetId)
})
// 반려견 수정 기능
function modifyMyPet(modifyPetId) {
    let agePattern = /^\d{1,2}$/;
    let weightPattern = /^\d{1,3}(\.\d{1})?$/;
    let codePattern = /^\d{15}$/;
    if ($('#modify_name').val() == "") {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 이름을 입력주세요!',
        });
        return;
    } else if (!agePattern.test($('#modify_age').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '나이는 최대 두자리까지 숫자로만 입력주세요!',
        });
        return;

    } else if (!weightPattern.test($('#modify_weight').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '몸무게는 최대 소수점 한자리까지 숫자로 입력해주세요!',
        });
        return;
    } else if (!$('input[name=modify_gender]:checked').val()) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 성별을 선택해주세요.',
        });
        return;
    } else if (!$('input[name=neuteredRadio]:checked').val()) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 중성화 여부를 선택해주세요.',
        });
        return;
    } else if ($('#modify_kind').val() == "품종") {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '반려동물의 품종을 선택해주세요.',
        });
        return;
    }

    if ($('#modify_code').val() == "") {
    } else if (!codePattern.test($('#modify_code').val())) {
        Swal.fire({
            icon: 'info',
            title: '등록 실패!',
            text: '동물등록번호는 비워두거나 15자리 숫자로 입력해주세요!',
        });
        return;
    }
    var isNeutering = $('input[name=neuteredRadio]:checked').val();
    var gender = $('input[name=modify_gender]:checked').val();

    let cmmContentType = 'application/json',
        cmmType = 'post',
        cmmUrl = '/api/a_mypage/modifyMyPet',
        cmmReqDataObj = {
            p_user_code: p_userCode,
            petId: modifyPetId,
            pet_name: $('#modify_name').val(),
            pet_age: $('#modify_age').val(),
            pet_weight: $('#modify_weight').val(),
            pet_gender: gender,
            pet_isNeutering: isNeutering,
            pet_breed: $('#modify_kind').val(),
            pet_code: $('#modify_code').val()
        },
        cmmAsync = false,

        cmmSucc = function modifyMyPet(result) {
            if (result.succ == 1) {
                Swal.fire({
                    icon: 'success',
                    title: '수정 성공!',
                    text: '수정되었습니다.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        let reqUrl = baseUrl + '/a_mypage/myPetPage?p_userCode=' + p_userCode;
                        window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
                            action: 'go-petManage'
                        }, '*');
                        location.href = reqUrl;

                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: '수정 실패!',
                    text: '수정된 내용이 없습니다.',
                })
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}