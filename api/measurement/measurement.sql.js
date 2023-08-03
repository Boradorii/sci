// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;