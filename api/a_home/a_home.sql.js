// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 반려견 정보 가져오기
exports.selectPetInfo = `
    select *
    from pet_info
    where pet_first_yn = 'Y' and p_user_code = ?;
`;
// 당일 측정 기록 조회를 위한 대표 반려견의 pet_id 가져오기
exports.mainPetId = `
    select pet_id
    from pet_info
    where pet_first_yn = 'Y' and p_user_code = ?;
`;
// 당일 측정 기록 조회
exports.selectTodayList = `
    select hr_avg, predict_glucose, created_time
    from predict_data
    where pet_id =? and created_time like ?;
`;

exports.alert_icon = `
    select count(*) as cnt
    from alert_list
    where alert_check = 'N' and p_user_code = ?;
`;