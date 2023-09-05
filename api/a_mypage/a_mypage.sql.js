// ��ȣȭ Ű ��ȸ
exports.select_key_string = `SELECT key_string FROM encryption_key_info WHERE activate_yn = 'Y';`;

// �츮 ���� �������� �ݷ����� �߰�
exports.loadPetList = `
    select *
    from pet_info
    where p_user_code =? order by pet_first_yn desc;
`;
// �츮 ���� ���
exports.insertPet = `
    insert into pet_info (pet_code, pet_name, pet_byear, pet_weight, pet_breed,p_user_code, pet_isNeutering, pet_gender )
    values(?,?,?,?,?,?,?,?);
`;
// �ݷ��� ����Ʈ�� ��ϵ� �ݷ��� ��
exports.first = `
    select *
    from pet_info
    where p_user_code =?;
`;
// �ݷ��� ����Ʈ�� �Ѹ��� ���� �� �ڵ� ��ǥ�ݷ��� ����
exports.doFirst = `
    UPDATE pet_info
    SET pet_first_yn = 'Y'
    WHERE p_user_code = ?;
`;


// ��ǥ �ݷ��� ����
exports.setFirst = `
    UPDATE pet_info
    SET pet_first_yn = 'Y'
    WHERE p_user_code = ? AND pet_id = ?;
`;
// ��ǥ �ݷ��� ������ ���� 
exports.setSecond = `
    UPDATE pet_info
    SET pet_first_yn = 'N'
    WHERE p_user_code = ? AND pet_id != ?;
`;


// ���� ��ǥ �ݷ��� �� ���̵� ��������
exports.exFirst = `
        select pet_id
        from pet_info
        where p_user_code =? and pet_first_yn='Y';
    `;
// �ݷ��� ���� ������ ������ ��������
exports.loadModifyPageData = `
    select *
    from pet_info
    where pet_id =?;
`;
// �ݷ��� �������
exports.modifyMyPet = `
    UPDATE pet_info
    SET pet_name = ?, pet_byear =?, pet_weight = ?, pet_breed =?, pet_isNeutering=?, pet_gender=?, pet_code =?
    WHERE p_user_code = ? AND pet_id = ?;
`;

//  �ݷ��� ����
exports.myPetDelete = `
    DELETE FROM pet_info
    WHERE pet_id = ?;
`;
exports.myPetDelete2 = `
    DELETE FROM medical_record
    WHERE pet_id = ?;
`;
exports.myPetDelete3 = `
    DELETE FROM predict_data
    WHERE pet_id = ?;
`;
exports.myPetDelete4 = `
    DELETE FROM alert_list
    WHERE pet_id = ?;
`;

// �˸����� ������ ��¥ �� push��� ������ �ε�
exports.alertPushDateLoad = `
    select push_date, p_user_provide_yn
    from user_protector
    where p_user_code=?;
`;

// �˸����� ������ ������ �ε�
exports.alertDataLoad = `
    select *
    from alert_list
    where p_user_code=?  order by alert_created_time desc;
`;

// Ǫ�� ���� on
exports.allowPushSetting = `
    UPDATE user_protector
    SET p_user_provide_yn = 'Y'
    WHERE p_user_code = ?;
`;
// Ǫ�� ���� off
exports.disallowPushSetting = `
    UPDATE user_protector
    SET p_user_provide_yn = 'N'
    WHERE p_user_code = ?;
`;

exports.select_pushSetting = `
    select p_user_provide_yn
    from user_protector
    where p_user_code=?;
`;

// �˸� Ȯ�� ���� üũ
exports.checkAlert = `
    UPDATE alert_list
    SET alert_check = 'Y'
    WHERE p_user_code = ? and alert_created_time = ?;
`;

// �˸� �ڵ� ����

exports.alert_delete_auto = `
    DELETE FROM alert_list
    WHERE 
        (p_user_code = ? AND alert_created_time <= DATE_SUB(NOW(), INTERVAL 2 WEEK) and alert_class = 1)
        OR
        (p_user_code = ? AND alert_created_time <= DATE_SUB(NOW(), INTERVAL 2 WEEK) and alert_class = 2)
        OR
        (p_user_code = ? AND alert_class = 0 AND alert_created_time <= DATE_SUB(NOW(), INTERVAL 1 DAY));
`;

// �˸� ���� ��ư Ŭ���Ͽ� ����
exports.alert_delete = `
    DELETE FROM alert_list
    WHERE alert_num = ? ;
`;


exports.select_inquiry_num = `
    select inquiry_num
    from alert_list
    WHERE p_user_code = ? and alert_created_time = ? order by alert_created_time desc;
`;
exports.inquiry_answer = `
    select il.opinion, il.inquiry_title, pi.pet_name, uh.h_name
    from inquiry_list il
    join user_hospital uh on il.h_user_code = uh.h_user_code
    join pet_info pi on il.pet_id = pi.pet_id
    WHERE inquiry_num = ?;
`;

// ��й�ȣ Ȯ��
exports.aPwCheck = `
    SELECT p_user_code
    from user_protector
    where p_account_pw = SHA2(?, 256) and p_user_code = ?;
`;

// �� ���� �ε�
exports.myInfoLoad = `
    SELECT * 
    from user_protector 
    where p_user_code=?;
`;

// �ߺ� ����ó �˻�
exports.select_phone_duplicate =
    `
    SELECT p_phone_first, p_phone_middle, p_phone_last
    FROM user_protector
    WHERE p_phone_first = ? AND p_phone_middle = ? AND p_phone_last = ? AND p_user_code != ?;
`;

// �ߺ� email �˻�
exports.select_user_email_duplicate =
    `
    SELECT p_email_id FROM user_protector 
    WHERE p_email_id = ? AND p_email_domain = ? AND p_user_code != ?;
`;

// �̸��� ���� Ȯ��
exports.search_user =
    `
    SELECT p_user_name, p_email_id, p_email_domain
    FROM user_protector WHERE p_user_name=? and p_email_id=? and p_email_domain=?;
`;

// ���� ����
exports.myInfoModify = `
    update user_protector
    set p_user_name=?, p_account_pw=SHA2(?, 256), p_phone_first=?, p_phone_middle=?, 
        p_phone_last=?, p_email_id=?, p_email_domain=?, p_address_1=?, p_address_2=? 
    where p_user_code=?;
`;

exports.myInfoModify_noPw = `update user_protector
    set p_user_name=?, p_phone_first=?, p_phone_middle=?, 
        p_phone_last=?, p_email_id=?, p_email_domain=?, p_address_1=?, p_address_2=? 
    where p_user_code=?;`

// ���� ����
exports.withdrawService = `
    update user_protector 
    set activate_yn = 'D', p_delete_date = now() 
    where p_user_code=?;
`;