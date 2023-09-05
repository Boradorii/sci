// 암호화 키 조회
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// 환자 or 보호자 정보 검색
// 환자(pet)명으로 검색
exports.searchPetInfo = `
    SELECT pi.pet_name, pi.pet_code, pi.pet_byear, pi.pet_weight, pi.pet_breed,
       up.p_user_name, up.p_phone_first, up.p_phone_middle, up.p_phone_last, pi.pet_id
    FROM user_protector up
    JOIN pet_info pi ON up.p_user_code = pi.p_user_code
    JOIN my_hospital mh ON up.p_user_code = mh.p_user_code
    WHERE pet_name = ? AND PI.p_user_code IN (SELECT p_user_code FROM my_hospital WHERE h_user_code=?) AND mh.h_user_code=?;
`;
// 보호자(protectort)명으로 검색
exports.searchProtectorInfo = `
SELECT pi.pet_name, pi.pet_code, pi.pet_byear, pi.pet_weight, pi.pet_breed, up.p_user_name, up.p_phone_first, up.p_phone_middle, up.p_phone_last, pi.pet_id  
  FROM user_protector up    
  JOIN pet_info pi ON up.p_user_code = pi.p_user_code    
  JOIN my_hospital mh ON up.p_user_code = mh.p_user_code    
  WHERE pet_name = ? AND PI.p_user_code IN (SELECT p_user_code FROM my_hospital WHERE h_user_code=?) AND mh.h_user_code=?;
`;


// pet 정보 로드
exports.petInfoLoad = `
    SELECT *
    from pet_info pi join user_protector up
    ON pi.p_user_code = up.p_user_code
    where pi.pet_id=?;
`;