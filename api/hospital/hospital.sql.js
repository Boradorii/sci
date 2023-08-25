// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 비밀번호 확인
exports.pwCheck = `
    SELECT h_user_code
    from user_hospital
    where h_user_account_pw = SHA2(?, 256) and h_user_code = ?;
`;

// 병원 정보 로드
exports.hospitalInfoLoad = `
    SELECT * 
    from user_hospital 
    where h_user_code=?;
`;

// 중복 연락처 검사_병원
exports.select_phone_duplicate =
    `
    SELECT h_user_phone_first, h_user_phone_middle, h_user_phone_last
    FROM user_hospital 
    WHERE h_user_phone_first = ? AND h_user_phone_middle = ? AND h_user_phone_last = ? AND h_user_code != ?;
`;

// 중복 email 검사_병원
exports.select_user_email_duplicate =
    `
    SELECT h_user_email_id FROM user_hospital 
    WHERE h_user_email_id = ? AND h_user_email_domain = ? AND h_user_code != ?;
`;

// 이메일 유무 확인
exports.search_user =
    `
    SELECT h_user_name, h_user_email_id, h_user_email_domain
    FROM user_hospital WHERE h_user_name=? and h_user_email_id=? and h_user_email_domain=?;
`;

// 병원 정보 수정
exports.hospitalInfoModify = `
    update user_hospital
    set h_name=?, h_address2 = ?, h_telnum=?, h_operating_time=?, h_answer_time=?,
        h_user_account_pw=SHA2(?, 256), h_user_name=?, h_user_phone_first=?, h_user_phone_middle=?, h_user_phone_last=?,
        h_user_email_id=?, h_user_email_domain=?
    where h_user_code=?;
`;

// 서비스 종료
exports.withdrawService = `
    update user_hospital
    set activate_yn = 'D', h_user_delete_date = now()
    where h_user_code=?;
`;

// 병원 직원 목록 조회
exports.staffListLoad = `
    SELECT *
    from hp_staff_info
    where h_user_code=?;
`;

// 직원 정보 조회
exports.staffInfo = `
    SELECT *
    from hp_staff_info
    where h_staff_code=?;
`;

// 중복 연락처 검사_직원
exports.select_staff_phone_duplicate =
    `
    SELECT h_staff_phone_first, h_staff_phone_middle, h_staff_phone_last
    FROM hp_staff_info 
    WHERE h_staff_phone_first = ? AND h_staff_phone_middle = ? AND h_staff_phone_last = ? AND h_staff_code != ?;
`;

// 중복 email 검사_직원
exports.select_staff_email_duplicate =
    `
    SELECT h_staff_eid FROM hp_staff_info 
    WHERE h_staff_eid = ? AND h_staff_edomain = ? AND h_staff_code != ?;
`;

// 사용자 등록
exports.insertStaff =
    `
    INSERT INTO hp_staff_info(h_user_code, h_staff_name, h_staff_phone_first, 
        h_staff_phone_middle, h_staff_phone_last, h_staff_eid, h_staff_edomain, h_staff_class, h_staff_note)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

// 사용자 수정
exports.updateStaff =
    `
    update hp_staff_info
    set h_staff_name=?, h_staff_phone_first = ?, h_staff_phone_middle=?,
        h_staff_phone_last=?, h_staff_eid=?, h_staff_edomain=?, h_staff_class=?,
        h_staff_note=?
    where h_staff_code=?;
    `;

// 사용자 삭제
exports.deleteStaff =
    `
    delete from hp_staff_info
    where h_staff_code=?;
    `;
