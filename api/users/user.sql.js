/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 sql
 *  @author JMY
 *  @since 2023.06.20
 *  @history  2023.06.20 JMY 최초작성
 *  ================================================================
 */

// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// jwt access token, refresh token 저장 
exports.update_jwt_token =
    `   UPDATE user_hospital SET h_user_access_token = ?, h_user_refresh_token = ?
    WHERE h_user_code = ?;
`;

// jwt refresh token 조회
exports.select_jwt_token =
    `   SELECT h_user_refresh_token FROM user_hospital WHERE h_user_code = ? and h_user_access_token = ?;
`;

// 새로 발급 받은 jwt access token 저장
exports.update_user_access_token =
    `
    UPDATE user_hospital SET h_user_access_token =? WHERE h_user_code = ?;
`;

// 사용자 가입 여부 조회(로그인)
exports.select_user_exist =
    `   SELECT h_user_code, h_user_name, h_user_login_check,h_name
    FROM user_hospital
    WHERE h_user_account_id=? AND h_user_account_pw = SHA2(?, 256) AND activate_yn = 'Y';
`

// 로그인 업데이트 (login_check = 'Y')
exports.update_user_login =
    `   UPDATE user_hospital SET h_user_login_check = 'Y' WHERE h_user_code = ?;
`;

// 로그아웃
exports.update_user_logout =
    `   UPDATE user_hospital SET h_user_login_check ='N' WHERE h_user_code=?;
`;

// ID 찾기
exports.select_user_id =
    `
    SELECT h_user_account_id FROM user_hospital
    WHERE h_user_name = ? AND h_user_email_id = ? AND h_user_email_domain = ?;
`;

// PW 찾기_사용자 여부 확인
exports.select_user_code =
    `   SELECT h_user_code FROM user_hospital
    WHERE h_user_account_id = ? AND h_user_name = ? AND h_user_email_id = ? AND h_user_email_domain = ?;
`;

// 비밀번호 변경
exports.update_new_password =
    `   UPDATE user_hospital SET h_user_account_pw = SHA2(?, 256)  WHERE h_user_code = ?;
`;

// 최근 추가된 병원 계정 조회
exports.select_recent_user_account =
    `
    SELECT h_user_code FROM user_hospital ORDER BY h_user_code desc LIMIT 1;
`;

// 병원 계정 추가
exports.insert_hospital_account =
    `
    INSERT INTO user_hospital(h_user_code, h_user_account_id, h_user_account_pw, h_user_name, h_user_phone_first,
                    h_user_phone_middle, h_user_phone_last, h_user_email_id, h_user_email_domain,
                    h_name, h_address1, h_address2, h_telnum, h_operating_time, h_answer_time, h_user_provide_yn, h_user_login_check, h_user_registered_date)
    VALUES(?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', CURDATE());
`;

// 병원 검색
exports.select_hospital =
    `
    SELECT * FROM hp_info WHERE hp_name LIKE ?;
`;

// 병원 정보 조회
exports.select_hospitalInfo =
    `
    SELECT * FROM hp_info WHERE hp_code = ?;
`;

// 중복 ID 검사_병원
exports.select_user_id_duplicate =
    `
    SELECT h_user_account_id FROM user_hospital WHERE h_user_account_id = ?;
`;

// 중복 연락처 검사_병원
exports.select_phone_duplicate =
    `
    SELECT h_user_phone_first, h_user_phone_middle, h_user_phone_last FROM user_hospital WHERE h_user_phone_first = ? AND h_user_phone_middle = ? AND h_user_phone_last = ?;
`;

// 중복 email 검사_병원
exports.select_user_email_duplicate =
    `
    SELECT h_user_email_id FROM user_hospital WHERE h_user_email_id = ? AND h_user_email_domain = ?;
`;

// 이메일 유무 확인
exports.search_user =
    `
    SELECT h_user_name, h_user_email_id, h_user_email_domain
    FROM user_hospital WHERE h_user_name=? and h_user_email_id=? and h_user_email_domain=?;
`;