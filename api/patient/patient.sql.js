// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 환자 or 보호자 정보 검색
// 환자(pet)명으로 검색
exports.searchPetInfo = `
    SELECT pi.pet_name, pi.pet_code, pi.pet_byear, pi.pet_weight, pi.pet_breed, pi.pet_note,
       up.p_user_name, up.p_phone_first, up.p_phone_middle, up.p_phone_last, pi.pet_id
    FROM user_protector up
    JOIN pet_info pi ON up.p_user_code = pi.p_user_code
    JOIN my_hospital mh ON up.p_user_code = mh.p_user_code
    WHERE pet_name = ? AND PI.p_user_code IN (SELECT p_user_code FROM my_hospital WHERE h_user_code=?);
`;
// 보호자(protectort)명으로 검색
exports.searchProtectorInfo = `
    SELECT pi.pet_name, pi.pet_code, pi.pet_byear, pi.pet_weight, pi.pet_breed, pi.pet_note, up.p_user_name, up.p_phone_first, up.p_phone_middle, up.p_phone_last, pi.pet_id
    FROM user_protector up Join pet_info pi
    ON up.p_user_code = pi.p_user_code
    JOIN my_hospital mh ON up.p_user_code = mh.p_user_code
    where p_user_name=? AND PI.p_user_code IN (SELECT p_user_code FROM my_hospital WHERE h_user_code=?);
`;

// pet 정보 로드
exports.petInfoLoad = `
    SELECT *
    from pet_info pi join user_protector up
    ON pi.p_user_code = up.p_user_code
    where pi.pet_id=?;
`;
// pet 정보 수정
exports.petInfoModify = `
    update pet_info
    set pet_isNeutering=?, pet_weight = ?, pet_note=?
    where pet_id=?;
`;
// 진료 내역 전체 조회
exports.diagnosis_Records_total = `
    SELECT mr.*, pi.*
    FROM medical_record mr
    JOIN pet_info pi ON mr.pet_id = pi.pet_id
    WHERE mr.h_user_code = ? AND mr.pet_id = ? and mr.medi_created_time between ? AND ? order by medi_created_time desc;
`;
// 진료 내역 조회
exports.diagnosis_Records = `
    SELECT mr.*, pi.*
    FROM medical_record mr
    JOIN pet_info pi ON mr.pet_id = pi.pet_id
    JOIN hp_staff_info hsi ON mr.h_staff_code = hsi.h_staff_code
    where mr.h_user_code=? and mr.pet_id=? and hsi.h_staff_name=? and mr.medi_created_time between ? AND ? order by medi_created_time desc;
`;

// 진료 내용 불러오기
exports.diagnosis_detail = `
    SELECT medi_created_time, medi_purpose, medi_contents, h_user_code, h_staff_code
    FROM medical_record
    where medi_num=?;
`;
// 진료 내용 진단의 불러오기 (스태프코드)
exports.diagnosis_detail_doctorName = `
    SELECT hsi.h_staff_name
    FROM hp_staff_info hsi
    JOIN medical_record mr ON hsi.h_staff_code = mr.h_staff_code
    WHERE mr.medi_num = ?;
`;

// 진료 내역 진단의 이름 가져오기
exports.diagnosis_doctorName = `
    SELECT h_staff_name
    FROM hp_staff_info
    where h_user_code= ? and h_staff_code = ?;
`;

// 진료 내용 수정
exports.diagnosis_detail_modify = `
    update medical_record
    set medi_created_time = ?, medi_purpose = ?, medi_contents = ?
    where medi_num=?;
`;

// 진료 내용 수정 시 시간 데이터 저장용
exports.subDate = `
    SELECT medi_created_time
    FROM medical_record
    where medi_num= ?;
`;

// 진료 내용 삭제
exports.diagnosis_detail_delete = `
    delete FROM medical_record
    where medi_num= ?;
`;

// 진료 기록의 진료의 목록 불러오기
exports.diagnosis_regist_doctorList = `
    SELECT h_staff_name, h_staff_eid
    FROM hp_staff_info
    where h_user_code = ?;
`;

// 진료 내역의 진료 기록 등록하기
exports.diagnosis_regist = `
    insert into medical_record (medi_created_time, medi_purpose, medi_contents, pet_id, h_user_code, h_staff_code,p_user_code )
    values (NOW(),?, ?, ?, ?, ?,?);
`;

// staff 이름으로 staff code 찾기
exports.find_h_staff_code = `
    SELECT h_staff_code
    FROM hp_staff_info
    where h_user_code = ? and h_staff_name = ? and h_staff_eid=?;
`;

// petId로 p_user_code 찾기
exports.find_p_user_code = `
    SELECT p_user_code
    FROM pet_info
    where pet_id =?;
`;

// 진료 등록 시 alert_list에도 알림 추가
exports.diagnosis_regist_alert = `
insert into alert_list (p_user_code, pet_id, alert_class, alert_created_time)
values(?,?,1,NOW());
`;


// 최근 생체정보 조회
exports.select_bioinfo = `
    SELECT *
    FROM predict_data
    where pet_id = ? and created_time between ? and ? order by created_time desc;
`;
exports.draw_chart = `
    SELECT *
    FROM predict_data
    where pet_id = ? and created_time between ? and ? order by created_time;
`;


// 생체정보 세부내용 조회
exports.bioInfo_detail = `
    SELECT *
    FROM predict_data
    where pd_num=?;
`;






