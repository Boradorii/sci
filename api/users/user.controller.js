/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 controller
 *  @author JG, Jo
 *  @since 2021.04.12
 *  @history 2021.04.19 JG 로그인 기능 추가(jwt)
 *           2021.05.26 JG 중복 검사, 회원정보 조회, 회원 탈퇴 관련 기능 추가
 *  ================================================================
 */

// logger
const logger = require('../../config/loggerSettings');

// 호출할 service 정의
const service = require('./user.service');
const svInstance = new service();

class UserController {

    // 사용자 계정 생성 2021.04.12 
    async createUser(req, res, next) {
        let reqDataObj = req.body;
        let result = await svInstance.createUser(reqDataObj);
        return res.json(result);
    }

    // 사용자 로그인 2021.04.19
    async userLogin(req, res, next) {
        let accountId = req.body.accountId,
            accountPw = req.body.accountPw;

        let result = await svInstance.userLogin(accountId, accountPw);
        return res.json(result);
    }

    // 사용자  jwt token 검증 2021.04.19
    async validateJwtToken(req, res, next) {
        let accessToken = req.headers['authorization'],
            userCode = req.body.userCode;

        let result = await svInstance.validateJwtToken(userCode, accessToken);
        return res.json(result);
    }

    // 중복 ID 검사 2021.05.26
    async checkIdDuplicate(req, res, next) {
        let idString = req.query.idString;
        let result = await svInstance.checkIdDuplicate(idString);
        return res.json(result);
    }

    // 중복 Phone 검사
    async checkPhoneDuplicate(req, res, next) {
        let userCode = req.query.userCode;
        let phone1String = req.query.phone1String;
        let phone2String = req.query.phone2String;
        let phone3String = req.query.phone3String;

        let result = await svInstance.checkPhoneDuplicate(userCode, phone1String, phone2String, phone3String);
        return res.json(result);
    }

    // 중복 email 검사 2021.05.26
    async checkEmailDuplicate(req, res, next) {
        let eIdString = req.query.eIdString,
            eDomainString = req.query.eDomainString;
        let result = await svInstance.checkEmailDuplicate(eIdString, eDomainString);
        return res.json(result);
    }

    // 로그아웃 2021.05.26
    async userLogout(req, res, next) {
        let state = await svInstance.userLogout(req.body.userCode);
        return res.json(state);
    }

    // 회원정보 조회 2021.05.26
    async userInfoShow(req, res, next) {
        let result = await svInstance.userInfoShow(req.query.userCode);
        return res.json(result);
    }

    // 사용자 정보 수정 2021.05.26 
    async modifyUserInfo(req, res, next) {
        let reqDataObj = req.body;

        let result = await svInstance.modifyUserInfo(reqDataObj);
        return res.json(result);
    }

    // 비밀번호 변경 2021.05.26 
    async modifyUserPassword(req, res, next) {
        let reqDataObj = req.body,
            userCode = reqDataObj.userCode,
            pwd = reqDataObj.pwd;

        let result = await svInstance.modifyUserPassword(userCode, pwd);
        return res.json(result);
    }

    // 회원탈퇴 2021.05.26 
    async withdrawalUser(req, res, next) {
        let reqDataObj = req.body,
            userCode = reqDataObj.userCode,
            activateYN = reqDataObj.activateYN,
            deactivateDate = reqDataObj.deactivateDate;

        let result = await svInstance.modifyUserActivate(activateYN, deactivateDate, userCode);
        return res.json(result);
    }

    // ID 찾기 2021.05.26 
    async findUserId(req, res, next) {
        let reqDataObj = req.query,
            userName = reqDataObj.name,
            eId = reqDataObj.eId,
            eDomain = reqDataObj.eDomain
            // phone1 = reqDataObj.phone1,
            // phone2 = reqDataObj.phone2,
            // phone3 = reqDataObj.phone3;

        let result = await svInstance.findUserId(userName, eId, eDomain);
        return res.json(result);
    }

    // user code 찾기 2021.05.26 
    async findUserCode(req, res, next) {
        let reqDataObj = req.query,
            accountId = reqDataObj.id,
            userName = reqDataObj.name,
            eId = reqDataObj.eId,
            eDomain = reqDataObj.eDomain;

        let result = await svInstance.findUserCode(accountId, userName, eId, eDomain);
        console.log(result)
        return res.json(result);
    }

    //생년 복호화
    async userBirthInfo(req, res, next) {
        let params = req.body
        let result = await svInstance.decryptBirth(params.data);
        return res.send(result.birth)
    }

    //이메일 인증코드 전송
    async authEmail(req, res, next) {
        let context = req.__('emailAuth')
        let params = req.body
        let result = await svInstance.authEmail(params, context);
        return res.send(result)
    }
}

module.exports = UserController;