// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 최근 30일간 건강지수 조회
exports.select_health_index_daily =
    `SELECT t1.*, DATE_FORMAT(t1.created_time, '%m-%d') AS c_time
    FROM predict_data t1
    WHERE user_code = ? AND created_time BETWEEN ? AND ?
      AND created_time = (
        SELECT MAX(t2.created_time)
        FROM predict_data t2
        WHERE t2.user_code = t1.user_code AND DATE(t2.created_time) = DATE(t1.created_time)
      )
      ORDER BY created_time;
      `;
// 월간 건강지수 조회
exports.select_health_index_monthly =
    `SELECT t1.* , DATE_FORMAT(t1.created_time, '%m-%d') AS c_time
    FROM predict_data t1 
    WHERE user_code=? AND created_time LIKE ? 
    AND created_time = (
        SELECT MAX(t2.created_time)
        FROM predict_data t2
        WHERE t2.user_code = t1.user_code AND DATE(t2.created_time) = DATE(t1.created_time)
      )
      ORDER BY created_time;
      `;