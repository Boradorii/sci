// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 미확인 알림 리스트 조회
exports.noticeNList = `
SELECT up.p_user_name, pi.pet_name, il.inquiry_created_time, il.inquiry_num 
FROM inquiry_list il 
JOIN pet_info pi ON il.pet_id = pi.pet_id 
JOIN user_protector up ON up.p_user_code = pi.p_user_code 
where il.alert_check='N' and il.h_user_code = ? order by il.inquiry_created_time desc;
`;

// 확인 알림 리스트 조회
exports.noticeYList = `
SELECT up.p_user_name, pi.pet_name, il.inquiry_created_time, il.alert_check_time, il.inquiry_num 
FROM inquiry_list il 
JOIN pet_info pi ON il.pet_id = pi.pet_id 
JOIN user_protector up ON up.p_user_code = pi.p_user_code 
where il.alert_check='Y' and il.h_user_code = ? order by il.inquiry_created_time desc;
`;

// 문진표 내용 조회
exports.inquiryList = `
SELECT questionnaire, symptom, opinion 
FROM inquiry_list 
where inquiry_num = ? ; 
`;

// 환자 or 보호자 정보 검색
// 환자(pet)명으로 검색
exports.searchPetInfo = `
    SELECT up.p_user_name, pi.pet_name, il.inquiry_created_time, il.alert_check_time, il.inquiry_num 
    FROM inquiry_list il 
    JOIN pet_info pi ON il.pet_id = pi.pet_id 
    JOIN user_protector up ON up.p_user_code = pi.p_user_code 
    WHERE pi.pet_name = ? AND il.alert_check='Y' and il.h_user_code = ? AND il.inquiry_created_time between ? AND ? order by il.inquiry_created_time desc;
`;
// 보호자(protectort)명으로 검색
exports.searchProtectorInfo = `
SELECT up.p_user_name, pi.pet_name, il.inquiry_created_time, il.alert_check_time, il.inquiry_num 
FROM inquiry_list il 
JOIN pet_info pi ON il.pet_id = pi.pet_id 
JOIN user_protector up ON up.p_user_code = pi.p_user_code 
WHERE up.p_user_name = ? AND il.alert_check='Y' and il.h_user_code = ? AND il.inquiry_created_time between ? AND ? order by il.inquiry_created_time desc; 
`;

exports.inquiry_post = `
    update inquiry_list
    set opinion = ?
    where inquiry_num = ?;

`;
exports.inquiry_check = `
    update inquiry_list
    set alert_check = 'Y',alert_check_time = NOW()
    where inquiry_num = ?;
`;




