exports.myPet = `SELECT pet_id, pet_name FROM pet_info WHERE p_user_code=?;`;

exports.firstPet = `SELECT pet_id, pet_name FROM pet_info WHERE p_user_code=? and pet_first_yn='Y';`

exports.select_measurement_result = `
    SELECT *
    FROM predict_data
    WHERE pet_id = ? AND created_time >= ?;
`;

exports.myHosList = `SELECT uh.h_user_code, uh.h_name, uh.h_address1, uh.h_address2 
FROM my_hospital as mh 
LEFT JOIN user_hospital as uh ON uh.h_user_code=mh.h_user_code 
WHERE mh.p_user_code=?;`;

exports.select_pet_name = `SELECT * FROM pet_info WHERE pet_id=?`

exports.selectResult = `SELECT * FROM predict_data WHERE pet_id=? AND created_time BETWEEN ? AND ?;`;

exports.selectDaily = `SELECT hr_avg, predict_glucose, predict_high_pressure, predict_low_pressure, created_time FROM predict_data WHERE pet_id=? AND created_time like ? ORDER BY created_time DESC;`;

exports.selectMonthResult = `SELECT * FROM predict_data WHERE pet_id=? AND created_time like ?;`;