/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 router
 *  @author SY
 *  @since 2023.06.22
 *  @history  2023.06.22 초기 작성
 *  ================================================================
 */


//앱 토큰 저장
exports.updateAlertToken = `UPDATE user_protector SET p_app_token=? WHERE p_user_code=?;`;


// SY

// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// jwt access token, refresh token 저장 
exports.update_jwt_token = `UPDATE user_protector SET p_user_access_token = ?, p_user_refresh_token = ? WHERE p_user_code = ?;`;

// jwt refresh token 조회
exports.select_jwt_token =
    `SELECT p_user_refresh_token FROM user_protector WHERE p_user_code = ? and p_user_access_token = ?;`;

// 새로 발급 받은 jwt access token 저장
exports.update_user_access_token =
    `UPDATE user_protector SET p_user_access_token =? WHERE p_user_code = ?;`;


// 로그인 업데이트 (login_check = 'Y')
exports.update_user_login = `UPDATE user_protector SET p_user_login_check = 'Y' WHERE p_user_code = ?;`;

// 사용자 가입 여부 조회(로그인)
exports.select_user_exist = `SELECT p_user_code, p_user_name, p_user_login_check
    FROM user_protector
    WHERE p_account_id=? AND p_account_pw = SHA2(?, 256) and activate_yn = 'Y';`;

// 로그아웃
exports.update_user_logout =
    `UPDATE user_protector SET p_user_login_check ='N' WHERE p_user_code=?;`;

// 최근 추가된 병원 계정 조회
exports.select_recent_user_account = `SELECT p_user_code FROM user_protector ORDER BY p_user_code desc LIMIT 1;`;

// 병원 계정 추가
exports.insert_user_account = `
    INSERT INTO user_protector(p_user_code, p_user_name, p_account_id, p_account_pw, p_phone_first, p_phone_middle, p_phone_last, p_email_id, p_email_domain,
                            p_address_1, p_address_2, p_user_provide_yn, p_user_login_check, push_date, p_register_date)
    VALUES(?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?, ?, 'N', ?, CURDATE());`;

// 중복 ID 검사
exports.select_user_id_duplicate =
    `SELECT p_account_id FROM user_protector WHERE p_account_id = ?;`;

// 중복 연락처 검사
exports.select_phone_duplicate =
    `SELECT p_phone_first, p_phone_middle, p_phone_last FROM user_protector WHERE p_phone_first = ? AND p_phone_middle = ? AND p_phone_last = ?;`;

// 중복 email 검사
exports.select_user_email_duplicate =
    `
    SELECT p_email_id FROM user_protector WHERE p_email_id = ? AND p_email_domain = ?;
`;

// 이메일 유무 확인
exports.search_user = `
    SELECT h_user_name, h_user_email_id, h_user_email_domain
    FROM user_protector WHERE h_user_name=? and h_user_email_id=? and h_user_email_domain=?;
`;

// user code 찾기
exports.select_user_code = `   
    SELECT p_user_name, p_email_id, p_email_domain, p_user_code
    FROM user_protector WHERE p_account_id = ? AND p_user_name = ? AND p_email_id = ? AND p_email_domain = ?;
`;

// ID 찾기
exports.select_user_id = `
    SELECT p_account_id FROM user_protector
    WHERE p_user_name = ? AND p_email_id = ? AND p_email_domain = ?;
`;

// PW 찾기_사용자 여부 확인
exports.select_user_code = `
    SELECT p_user_code FROM user_protector
    WHERE p_account_id = ? AND p_user_name = ? AND p_email_id = ? AND p_email_domain = ?;
`;

// 비밀번호 변경
exports.update_new_password = `UPDATE user_protector SET p_account_pw = SHA2(?, 256)  WHERE p_user_code = ?;`;