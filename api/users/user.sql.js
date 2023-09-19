/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 sql
 *  @author JG, Jo
 *  @since 2021.04.12
 *  @history 2021.04.13 JG 암호화 키 조회 쿼리 추가
 *           2021.04.19 JG 사용자 가입 여부 조회, jwt 관련 쿼리 추가
 *           2021.04.26 JG access token 저장, 조회 쿼리(기존 쿼리 수정)
 *           2021.05.03 JG 사용자 상세 정보 등록/수정 쿼리에서 전화번호 삭제
 *           2021.05.11 JG 로그인 시 패밀리id, 사용자 이름 가져오도록 수정
 *           2021.05.25 JG 사용자 상세 정보 등록/수정 쿼리에 개인정보 제공 동의여부 추가,
 *                         회원탈퇴, 비밀번호 변경, 중복 검사, 로그아웃 쿼리 추가
 *  ================================================================
 */


exports.update_admin_user_login =
    `UPDATE user_admin
 SET a_user_login_check = 'Y'
 WHERE a_user_code = ?;`;

// jwt access token, refresh token 저장 
exports.update_adminuser_jwt_token = `UPDATE user_admin SET a_user_access_token = ?, a_user_refresh_token = ? WHERE a_user_code = ?;`;

// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 사용자 계정 추가
exports.insert_user_account = `INSERT INTO user_account(account_id, account_password, registered_date, name, provide_private_info_yn, gender,
                                birth_year, birth_month, birth_day, phone_first, phone_middle, phone_last, email_id, email_domain)
                                VALUES(?, SHA2(?, 256), CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`;

// 사용자 가입 여부 조회(로그인)
exports.select_user_exist =
    `SELECT user_code, name, login_check
    FROM user_account
    WHERE account_id=? AND account_password = SHA2(?, 256) AND activate_yn='Y';`

// 중복 로그인 방지
exports.update_user_login =
    `UPDATE user_account
        SET login_check = 'Y'
      WHERE user_code = ?;`;

// 로그아웃: 강제 로그아웃 될 때 accesstoken  강제 삭제되어 다른 기기에서도 로그아웃되어 access_token=NULL 주석
exports.update_user_logout =
    `UPDATE user_account
        SET login_check = 'N'/*,
            access_token = NULL*/
      WHERE user_code = ?;`

// 중복 ID 검사
exports.select_user_id_duplicate = `SELECT account_id FROM user_account WHERE account_id = ? AND activate_yn='Y';`;

exports.select_user_phone_duplicate = `SELECT user_code, phone_first, phone_middle, phone_last FROM user_account WHERE user_code !=? and phone_first = ? and phone_middle = ? and phone_last = ? AND activate_yn='Y';`;

// 메일 중복 검사 및 사용자 계정 조회
exports.select_user_account_email =
    `SELECT user_code, account_id
       FROM user_account
      WHERE email_id = ?
        AND email_domain = ?
        AND activate_yn='Y';`;

// 비밀번호 변경
exports.update_new_password =
    `UPDATE user_account
        SET account_password = SHA2(?, 256)
      WHERE user_code = ?;`;

// 회원탈퇴 등 회원 상태 변경
exports.update_user_activate =
    `UPDATE user_account
        SET activate_yn = ?,
            deactivate_date = ?
      WHERE user_code = ?;`;
// 회원 정보 조회 lcg
exports.select_user_detail_info = `
    SELECT user_code, name, account_id, phone_first, phone_middle, phone_last, gender, birth_year, birth_month, birth_day 
    FROM user_account 
    WHERE user_code = ? AND activate_yn='Y';
`;

// 회원 정보 업데이트(계정 정보)
exports.update_user_account =
    `UPDATE user_account
        SET phone_first = ?, 
            phone_middle = ? ,
            phone_last = ?
     WHERE  user_code = ?;`

// 회원 정보 업데이트(상세 정보)
exports.update_user_account =
    `UPDATE user_account
        SET name = ?
    WHERE   user_code = ?;`;

// ID 찾기
exports.select_user_id =
    `SELECT account_id
    FROM user_account
    WHERE name = ? AND email_id = ? AND email_domain = ? AND activate_yn='Y';`

// user code 찾기
exports.select_user_code =
    `SELECT user_code FROM user_account
    WHERE account_id=? AND name = ? 
    AND email_id = ? AND email_domain = ? AND activate_yn='Y'`;

// jwt access token, refresh token 저장 
exports.update_user_jwt_token = `UPDATE user_account SET access_token = ?, refresh_token = ? WHERE user_code = ?;`;

// jwt refresh token 조회
exports.select_user_jwt_token = `SELECT refresh_token FROM user_account WHERE user_code = ? and access_token = ?;`;

// 기존 로그인 여부 조회
exports.select_user_login_check = `SELECT login_check FROM user_account WHERE user_code = ?; AND activate_yn='Y'`;

// 새로 발급 받은 jwt access token 저장
exports.update_user_access_token = `UPDATE user_account SET access_token =? WHERE user_code = ?;`;


// 이메일 유무 확인
exports.search_user = `SELECT name, email_id, email_domain FROM user_account WHERE name=? and email_id=? and email_domain=? AND activate_yn='Y';`;