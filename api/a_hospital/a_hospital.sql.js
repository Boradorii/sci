// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

exports.visitHos = `SELECT mr.p_user_code, mr.h_user_code, mr.medi_created_time, uh.h_name
    FROM medical_record AS mr 
    LEFT JOIN user_hospital AS uh
    ON mr.h_user_code=uh.h_user_code
    WHERE mr.p_user_code=? ORDER BY mr.medi_created_time DESC LIMIT 1`

exports.myHos = `select h_user_code from my_hospital where p_user_code=?`

exports.findHos = `select h_user_code, h_name, h_address1, h_address2 from user_hospital where h_name like ? or h_address1 like?`;

exports.deleteMyHos = `delete from my_hospital where p_user_code=? and h_user_code=?;`;

exports.insertMyHos = `insert into my_hospital(p_user_code, h_user_code) values(?, ?);`;

exports.localHosList = `SELECT h_user_code, h_name, h_address1, h_address2 from user_hospital where h_address1 like ?;`;

exports.myHosList = `SELECT uh.h_user_code, uh.h_name, uh.h_address1, uh.h_address2 
FROM my_hospital as mh 
LEFT JOIN user_hospital as uh ON uh.h_user_code=mh.h_user_code 
WHERE mh.p_user_code=?;`;


exports.hInfo = `SELECT h_user_code, h_name, h_address1, h_address2, h_telnum, h_operating_time, h_answer_time FROM user_hospital where h_user_code=?;`;

exports.myPet = `SELECT pet_id, pet_name FROM pet_info WHERE p_user_code=?;`;

exports.sendInquiry = `INSERT INTO inquiry_list(pet_id, inquiry_title,inquiry_created_time, h_user_code, questionnaire, symptom, p_user_code) VALUES(?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?, ?)`

exports.selectTreatData = `SELECT mr.*,uh.h_name, pet.pet_name, hsi.h_staff_name 
FROM medical_record AS mr 
LEFT JOIN user_hospital AS uh ON mr.h_user_code=uh.h_user_code 
LEFT JOIN pet_info AS pet ON mr.pet_id=pet.pet_id 
LEFT JOIN hp_staff_info AS hsi ON mr.h_staff_code=hsi.h_staff_code AND mr.h_user_code=hsi.h_user_code 
WHERE mr.p_user_code=? and medi_created_time BETWEEN ? AND ? ORDER BY mr.medi_created_time DESC;
 `
exports.sendAlertState =
    `SELECT count(*)
    FROM alert_list
    WHERE p_user_code=? and alert_check = 'N';`;

exports.hospital_alert_check =
    `SELECT distinct(h_user_code)
    FROM inquiry_list;`;

exports.count_hosAlert =
    `SELECT count(*)
    FROM inquiry_list
    WHERE h_user_code = ? and alert_check = 'N'`;

exports.count_total_hosAlert =
    `update user_hospital
    set h_alert_count = ?
    WHERE h_user_code = ?`;

exports.p_alert_check =
    `SELECT distinct(p_user_code)
    FROM alert_list;`;

exports.count_total_p_Alert =
    `update user_protector
    set p_alert_count = ?
    WHERE p_user_code = ?`;


exports.count_p_alert =
    `SELECT count(*)
    FROM alert_list
    WHERE p_user_code = ? and alert_check = 'N'`;


exports.check_hospital_alert =
    `SELECT h_alert_count
    FROM user_hospital
    WHERE h_user_code = ?`;

exports.selectInquiryData =
    `
    SELECT il.inquiry_created_time, uh.h_user_name, pi.pet_name, il.alert_check_time, il.inquiry_num
    FROM inquiry_list il
    JOIN user_hospital uh ON il.h_user_code = uh.h_user_code
    JOIN pet_info pi ON il.pet_id = pi.pet_id
    WHERE il.p_user_code = ?
    AND il.inquiry_created_time >= ?
    AND il.inquiry_created_time < DATE_ADD(?, INTERVAL 1 DAY)
    ORDER BY il.inquiry_created_time DESC;
    `;