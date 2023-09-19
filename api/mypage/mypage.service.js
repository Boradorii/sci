// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./mypage.sql');
const cryptoUtil = require('../../public/javascripts/cryptoUtil');



class MypageService {


    async getUserInfo(userCode) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        let getUserInfo = await mysqlDB('selectOne', queryList.getUserInfo, [userCode]);

        getUserInfo.row.name = cryptoUtil.decrypt_aes(cryptoKey, getUserInfo.row.name);
        getUserInfo.row.phone_first = cryptoUtil.decrypt_aes(cryptoKey, getUserInfo.row.phone_first);
        getUserInfo.row.phone_middle = cryptoUtil.decrypt_aes(cryptoKey, getUserInfo.row.phone_middle);
        getUserInfo.row.phone_last = cryptoUtil.decrypt_aes(cryptoKey, getUserInfo.row.phone_last);
        getUserInfo.row.email_id = cryptoUtil.decrypt_aes(cryptoKey, getUserInfo.row.email_id);

        return getUserInfo
    }

    async deleteUser(userCode) {
        let deleteUser = await mysqlDB('update', queryList.deleteUser, [userCode]);

        return deleteUser
    }

    async updateUserInfo(userCode, nameInput, PWInput, PWConfirmInput, phone1Input, phone2Input, phone3Input) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        nameInput = cryptoUtil.encrypt_aes(cryptoKey, nameInput)
        phone1Input = cryptoUtil.encrypt_aes(cryptoKey, phone1Input)
        phone2Input = cryptoUtil.encrypt_aes(cryptoKey, phone2Input)
        phone3Input = cryptoUtil.encrypt_aes(cryptoKey, phone3Input)

        let updateUserInfo
        if (PWInput == "" && PWConfirmInput == "") {
            updateUserInfo = await mysqlDB('update', queryList.updateUserInfo, [nameInput, phone1Input, phone2Input, phone3Input, userCode]);
        } else {
            updateUserInfo = await mysqlDB('update', queryList.updateUserInfo2, [nameInput, PWInput, phone1Input, phone2Input, phone3Input, userCode]);
        }
        return updateUserInfo
    }

    async duplicatePhone(userCode, phone1Input, phone2Input, phone3Input) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        phone1Input = cryptoUtil.encrypt_aes(cryptoKey, phone1Input);
        phone2Input = cryptoUtil.encrypt_aes(cryptoKey, phone2Input);
        phone3Input = cryptoUtil.encrypt_aes(cryptoKey, phone3Input);

        let result = await mysqlDB('selectOne', queryList.select_user_phone_duplicate, [userCode, phone1Input, phone2Input, phone3Input]);
        result = (result.rowLength > 0) ? true : false; //조회결과가 있다면 중복된 연락처

        return result;
    }
    async showAnnouncement() {
        let isAnnounce = await mysqlDB('select', queryList.selectAnnouncement, []);
        return isAnnounce;
    }
    
}

module.exports = MypageService;