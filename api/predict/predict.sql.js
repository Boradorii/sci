// 암호화 키 조회
exports.select_key_string = `
    SELECT key_string 
    FROM encryption_key_info 
    WHERE activate_yn = 'Y';
`;

exports.select_age_gender = `
    SELECT pet_byear, pet_gender
    FROM pet_info
    WHERE pet_id = ?;
`

exports.select_sensorInfo = `
    SELECT *
    FROM sensor_info
    WHERE Mac_address = ?;
`;

exports.insert_sensorInfo = `
    INSERT INTO sensor_info(mac_address, user_code)
    VALUES(?,?);
`;

exports.update_sensorInfo = `
    UPDATE sensor_info
    SET user_code = ?
    WHERE Mac_address = ?;
`;

exports.insert_measurement_result = `
    INSERT INTO predict_data(pet_id, age, gender, hr, hrv, voltage, sdnn, rmssd, pnn50, hr_avg, hrv_avg, predict_glucose, predict_high_pressure, predict_low_pressure, created_time)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
`;

exports.select_measurement_result = `
    SELECT *
    FROM predict_data
    WHERE pet_id = ? AND created_time >= ?;
`;

exports.insert_real_input = `
    UPDATE measurement_result
    SET input_glucos = ?, input_high_pressure = ?, input_low_pressure = ?
    WHERE num = ?;
`;

exports.select_real_result = `
    SELECT *
    FROM measurement_result
    WHERE user_code = ? and created_time LIKE ?
    ORDER BY created_time DESC;
`;