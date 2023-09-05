/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 controller
 *  @author JMY
 *  @since 2023.06.20
 *  @history  2023.06.20 JMY 최초작성
 *  ================================================================
 */

// logger
const logger = require('../../config/loggerSettings');

// 호출할 service 정의
const service = require('./user.service');
const svInstance = new service();

class UserController {
    async loadIndexPage(req, res, next) {
        return res.render('web/index/index')
    };

    async loadSignupPage(req, res, next) { //병원 관리자 회원가입
        return res.render('web/index/signup');
    }
    async loadFindIdPage(req, res, next) { //병원 관리자 id찾기
        return res.render('web/index/findId');
    }
    async loadFindPwPage(req, res, next) { //병원 관리자 비밀번호찾기
        return res.render('web/index/findPw');
    }


    // SY

    /** ================================================================
     *  로그인
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async userLogin(req, res, next) {
        let accountId = req.body.accountId,
            accountPw = req.body.accountPw;
        let result = await svInstance.userLogin(accountId, accountPw);
        return res.json(result);
    }


    /** ================================================================
     *  로그아웃
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async userLogout(req, res, next) {
        console.log(req.body.userCode);
        let state = await svInstance.userLogout(req.body.userCode);
        return res.json(state);
    }

    /** ================================================================
     *  사용자 jwt token 검증
     *  @author SY
     *  @since 2023.06.22
     *  @history 2023.06.22 초기 작성
     *  ================================================================
     */
    async validateJwtToken(req, res, next) {
        let accessToken = req.headers['authorization'],
            userCode = req.body.userCode;

        let result = await svInstance.validateJwtToken(userCode, accessToken);
        return res.json(result);
    };

    /** ================================================================
     *  ID 찾기
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.6.20 초기 작성
     *  ================================================================
     */
    async findUserId(req, res, next) {
        let userName = req.query.name,
            eId = req.query.eId,
            eDomain = req.query.eDomain;

        let result = await svInstance.findUserId(userName, eId, eDomain);
        return res.json(result);
    }

    /** ================================================================
     *  PW 찾기_사용자 여부 확인
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async findUser(req, res, next) {
        let params = req.body;
        let result = await svInstance.findUser(params);
        return res.send(result)
    }


    /** ================================================================
     *  PW 변경
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async modifyUserPassword(req, res, next) {
        let userCode = req.body.userCode,
            pwd = req.body.pwd;

        console.log(userCode, pwd);

        let result = await svInstance.modifyUserPassword(userCode, pwd);
        return res.json(result);
    }


    /** ================================================================
     *  회원가입_병원
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async createAdminUser(req, res, next) {
        let reqDataObj = req.body;
        let result = await svInstance.createAdminUser(reqDataObj);
        return res.json(result);
    }

    /** ================================================================
     *  병원 검색
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async searchHospital(req, res, next) {
        let hp_name = req.body.hp_name;
        let result = await svInstance.searchHospital(hp_name);
        return res.json(result);
    }


    /** ================================================================
     *  병원 정보 조회
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async hospitalInfo(req, res, next) {
        let hp_code = req.body.hp_code;
        let result = await svInstance.hospitalInfo(hp_code);
        return res.json(result);
    }

    /** ================================================================
     *  중복 ID 검사_병원
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async checkIdDuplicate(req, res, next) {
        let idString = req.query.idString;
        console.log(idString);
        let result = await svInstance.checkIdDuplicate(idString);
        return res.json(result);
    }

    /** ================================================================
     *  중복 연락처 검사_병원
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async checkPhoneDuplicate(req, res, next) {
        let phone1 = req.query.phone1;
        let phone2 = req.query.phone2;
        let phone3 = req.query.phone3;
        console.log(phone1, phone2, phone3)

        let result = await svInstance.checkPhoneDuplicate(phone1, phone2, phone3);
        return res.json(result);
    }

    /** ================================================================
     *  중복 email 검사_병원
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async checkEmailDuplicate(req, res, next) {
        let eIdString = req.query.eIdString,
            eDomainString = req.query.eDomainString;
        let result = await svInstance.checkEmailDuplicate(eIdString, eDomainString);
        return res.json(result);
    }


    /** ================================================================
     *  이메일 인증번호 전송
     *  @author SY
     *  @since 2023.06.19
     *  @history 2023.06.19 초기 작성
     *  ================================================================
     */
    async sendEmail(req, res, next) {
        let context = req.__('emailAuth');
        let params = req.body;
        let result = await svInstance.sendEmail(params, context);
        return res.send(result)
    }



    //암호화 테스트
    async encryptTest(req, res, next) {
        let input = req.query.data
        let result = await svInstance.encryptTest(input)
        return res.json(result);

    };

    //복호화 테스트
    async decryptTest(req, res, next) {
        let input = req.query.data
        let result = await svInstance.decryptTest(input)
        return res.json(result);

    };
}

module.exports = UserController;