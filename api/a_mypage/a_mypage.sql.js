// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 우리 아이 관리에서 반려동물 추가
exports.loadPetList = `
    select *
    from pet_info
    where p_user_code =? order by pet_first_yn desc;
`;
// 우리 아이 등록
exports.insertPet = `
    insert into pet_info (pet_code, pet_name, pet_byear, pet_weight, pet_breed,p_user_code, pet_isNeutering, pet_gender )
    values(?,?,?,?,?,?,?,?);
`;
// 반려견 리스트에 등록된 반려견 수
exports.first = `
    select *
    from pet_info
    where p_user_code =?;
`;
// 반려견 리스트에 한마리 뿐일 때 자동 대표반려견 설정
exports.doFirst = `
    UPDATE pet_info
    SET pet_first_yn = 'Y'
    WHERE p_user_code = ?;
`;


// 대표 반려견 설정
exports.setFirst = `
    UPDATE pet_info
    SET pet_first_yn = 'Y'
    WHERE p_user_code = ? AND pet_id = ?;
`;
// 대표 반려견 나머지 해제 
exports.setSecond = `
    UPDATE pet_info
    SET pet_first_yn = 'N'
    WHERE p_user_code = ? AND pet_id != ?;
`;


// 기존 대표 반려견 펫 아이디 가져오기
exports.exFirst = `
        select pet_id
        from pet_info
        where p_user_code =? and pet_first_yn='Y';
    `;
// 반려견 수정 페이지 데이터 가져오기
exports.loadModifyPageData = `
    select *
    from pet_info
    where pet_id =?;
`;
// 반려견 수정기능
exports.modifyMyPet = `
    UPDATE pet_info
    SET pet_name = ?, pet_byear =?, pet_weight = ?, pet_breed =?, pet_isNeutering=?, pet_gender=?, pet_code =?
    WHERE p_user_code = ? AND pet_id = ?;
`;

//  반려견 삭제
exports.myPetDelete = `
    DELETE FROM pet_info
    WHERE pet_id = ?;
`;

// 알림관리 페이지 날짜 및 push허용 데이터 로드
exports.alertPushDateLoad = `
    select push_date, p_user_provide_yn
    from user_protector
    where p_user_code=?;
`;

// 알림관리 페이지 데이터 로드
exports.alertDataLoad = `
    select *
    from alert_list
    where p_user_code=?;
`;

// 푸쉬 설정 on
exports.allowPushSetting = `
    UPDATE user_protector
    SET p_user_provide_yn = 'Y'
    WHERE p_user_code = ?;
`;
// 푸쉬 설정 off
exports.disallowPushSetting = `
    UPDATE user_protector
    SET p_user_provide_yn = 'N'
    WHERE p_user_code = ?;
`;

exports.select_pushSetting = `
    select p_user_provide_yn
    from user_protector
    where p_user_code=?;
`;

// 알림 확인 여부 체크
exports.checkAlert = `
    UPDATE alert_list
    SET alert_check = 'Y'
    WHERE p_user_code = ?;
`;

// 내 정보 로드
exports.myInfoLoad = `
    SELECT * 
    from user_protector 
    where p_user_code=?;
`;

// 중복 연락처 검사
exports.select_phone_duplicate =
    `
    SELECT p_phone_first, p_phone_middle, p_phone_last
    FROM user_protector
    WHERE p_phone_first = ? AND p_phone_middle = ? AND p_phone_last = ? AND p_user_code != ?;
`;

// 중복 email 검사
exports.select_user_email_duplicate =
    `
    SELECT p_email_id FROM user_protector 
    WHERE p_email_id = ? AND p_email_domain = ? AND p_user_code != ?;
`;

// 이메일 유무 확인
exports.search_user =
    `
    SELECT p_user_name, p_email_id, p_email_domain
    FROM user_protector WHERE p_user_name=? and p_email_id=? and p_email_domain=?;
`;

// 정보 수정
exports.myInfoModify = `
    update user_protector
    set p_user_name=?, p_account_pw=SHA2(?, 256), p_phone_first=?, p_phone_middle=?, 
        p_phone_last=?, p_email_id=?, p_email_domain=?, p_address_1=?, p_address_2=? 
    where p_user_code=?;
`;

// 서비스 종료
exports.withdrawService = `
    update user_protector 
    set activate_yn = 'D', p_delete_date = now() 
    where p_user_code=?;
`;