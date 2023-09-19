// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 데이터 불러오기
exports.getData =`SELECT * FROM predict_data WHERE user_code = ? and DATE(created_time) = ? 
ORDER BY created_time DESC LIMIT 1;
`