exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

exports.getUserInfo = `
    SELECT account_id, name, phone_first, phone_middle, phone_last, email_id, email_domain
    FROM user_account
    WHERE user_code = ?;
`;

exports.deleteUser = `
    UPDATE user_account
    SET login_check = 'N', access_token = NULL, refresh_token = NULL, activate_yn = 'N', deactivate_date = CURDATE(), user_app_token = NULL
    WHERE user_code = ?;
`;

exports.updateUserInfo = `
    UPDATE user_account
    SET name = ?, phone_first = ?, phone_middle = ?, phone_last = ?
    WHERE user_code = ?;
`;

exports.updateUserInfo2 = `
    UPDATE user_account
    SET name = ?, account_password = SHA2(?, 256), phone_first = ?, phone_middle = ?, phone_last = ?
    WHERE user_code = ?;
`;

exports.select_user_phone_duplicate = `
    SELECT user_code, phone_first, phone_middle, phone_last 
    FROM user_account 
    WHERE user_code !=? and phone_first = ? and phone_middle = ? and phone_last = ? AND activate_yn='Y';`;

    
exports.selectAnnouncement = `
SELECT SEQ, Title, Contents, Date
FROM announcement
ORDER BY Date desc;
`;
