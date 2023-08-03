/** ================================================================
 *  사용자 관리 controller (로그인, 회원가입, 정보 수정 등)
 *  @author SY
 *  @since 2023.06.21
 *  @history 2023.06.21 초기 작성
 *  ================================================================
 */
// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./a_user.sql');

// logger
const logger = require('../../config/loggerSettings');

// crypto
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const jwt = require("jsonwebtoken");

// lodash
const _ = require('lodash');

//nodemailer
const nodemailer = require('nodemailer');

class a_userService {

    async encryptTest(inputdata) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        // let result = cryptoUtil.encrypt_aes(cryptoKey, inputdata);
        let result = cryptoUtil.encrypt_aes(cryptoKey, inputdata);
        return result
    }

    async decryptTest(inputdata) {

        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        // let result = cryptoUtil.encrypt_aes(cryptoKey, inputdata);
        let result = cryptoUtil.decrypt_aes(cryptoKey, inputdata);
        return result
    }

    //SY

    /** ================================================================
     *  사용자 jwt token 검증
     *  @author SY
     *  @since 2023.06.22
     *  @history 2023.06.22 초기 작성
     *  ================================================================
     */
    async validateJwtToken(userCode, accessToken) {
        let result = null;
        let accessTokenSlice = accessToken.slice(7) // ※access token: 'Bearer ...'
        let refreshToken = await mysqlDB('selectOne', queryList.select_jwt_token, [userCode, accessTokenSlice]);
        // if (refreshToken.state == true && refreshToken.rowLength == 1) { // refresh token이 정상적으로 존재할 때 
        if (refreshToken.rowLength == 1) { // refresh token이 정상적으로 존재할 때 
            jwt.verify(accessTokenSlice, process.env.ACCESS_SECRET_KEY, (err, decoded) => { // access token 검증  
                if (err) {
                    if (err.name !== 'TokenExpiredError') { // access token 만료 에러를 제외한 모든 에러         
                        result = {
                            success: 0,
                            alertMsg: 'Access Denied. Please log in again.',
                            errorCode: 'ACCSSTKNERR'
                        };
                    } else if (err.name === 'TokenExpiredError') { // access token이 만료된 경우
                        refreshToken = refreshToken.row.refresh_token;

                        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded_refresh) => { // refresh token 검증
                            if (err) {
                                if (err.name === 'TokenExpiredError') { // access token, refresh token 모두 만료된 경우              
                                    result = {
                                        success: 0,
                                        alertMsg: "Invalid Token...Please log in again.",
                                        errorCode: 'REFRSHTKNEXPIRED'
                                    };
                                } else if (err.name !== 'TokenExpiredError') {
                                    result = {
                                        success: 0,
                                        alertMsg: "Access Denied. Please log in again.",
                                        errorCode: 'REFSHTKNERR'
                                    };
                                }
                            } else { // refresh token이 유효한 경우          
                                const accouontId = decoded_refresh.accountId,
                                    newAccessToken = jwt.sign({ accountId: accouontId }, process.env.ACCESS_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TIME, algorithm: 'HS256' }); // 새로운 access token을 발급한다.

                                result = {
                                    success: 2,
                                    accessToken: newAccessToken
                                };
                            }
                        });
                    }
                } else { // 정상일 때
                    result = {
                        success: 1,
                        decoded: decoded
                    };
                }
            });
        } else { // refresh token 조회가 정상적이지 않을 때
            result = {
                success: 0,
                alertMsg: 'Access Denied. Please log in again.',
                errorCode: 'NOTFOUNDTOKEN'
            };
        }

        if (result.success == 2) { // 새로운 access token DB 갱신 2021.04.26 JG
            logger.debug('user' + userCode + ' new access token is generated');
            let reslt = await mysqlDB('update', queryList.update_user_access_token, [result.accessToken, userCode]);
            logger.debug('user' + userCode + ' new access token is saved:' + reslt.succ);
        }
        return result;
    };


    /** ================================================================
     *  로그인
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async userLogin(accountId, accountPw) {

        // 개인 정보 복호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        console.log(accountId)
        let result = {},
            isUser = await mysqlDB('selectOne', queryList.select_user_exist, [accountId, accountPw]);
        console.log(isUser);
        if (isUser.state == true && isUser.rowLength === 1) {
            if (isUser.row.login_check == 'Y') {
                result.logincheck = 'Y'
            }
            const payload = { accountId: accountId },
                userCode = isUser.row.p_user_code,
                accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TIME, algorithm: 'HS256' }),
                refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_TIME, algorithm: 'HS256' });

            await mysqlDB('update', queryList.update_user_login, [userCode]);
            await mysqlDB('update', queryList.update_jwt_token, [accessToken, refreshToken, userCode]); // access token, refresh token 저장

            result.messageCode = 'ExistUser'
            result.accessToken = accessToken;
            result.userCode = userCode;
            result.userName = cryptoUtil.decrypt_aes(cryptoKey, isUser.row.p_user_name);

        } else {
            result.messageCode = 'NotFoundUser';
        }
        console.log(result);
        return result;
    }


    /** ================================================================
     *  ID 찾기
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async findUserId(userName, eId, eDomain) {

        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        userName = cryptoUtil.encrypt_aes(cryptoKey, userName);
        eId = cryptoUtil.encrypt_aes(cryptoKey, eId);

        let isUser = await mysqlDB('selectOne', queryList.select_user_id, [userName, eId, eDomain]);
        return isUser;
    }


    /** ================================================================
     *  PW 찾기_사용자 여부 확인
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async findUser(params, context) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        params.name = cryptoUtil.encrypt_aes(cryptoKey, params.name);
        params.eId = cryptoUtil.encrypt_aes(cryptoKey, params.eId);

        let result = await mysqlDB('selectOne', queryList.select_user_code, [params.id, params.name, params.eId, params.eDomain]); // PWD 찾기 - 이메일 유무 확인
        return result;
    }


    /** ================================================================
     *  비밀번호 수정
     *  @author SY
     *  @since 2023.06.21
     *  @history 2023.06.21 초기 작성
     *  ================================================================
     */
    async modifyUserPassword(userCode, pwd) {
        let result = await mysqlDB('update', queryList.update_new_password, [pwd, userCode]);
        console.log(result);
        return result;
    }


    /** ================================================================
     *  회원가입
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async createAdminUser(signUpData) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        signUpData.inputList.p_user_name = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_user_name); // 이름
        signUpData.inputList.p_phone_first = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_phone_first); // 휴대폰번호 앞자리
        signUpData.inputList.p_phone_middle = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_phone_middle); // 휴대폰번호 가운데자리
        signUpData.inputList.p_phone_last = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_phone_last); // 휴대폰번호 끝자리
        signUpData.inputList.p_email_id = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_email_id); // 이메일 ID
        signUpData.inputList.p_address_1 = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_address_1); // 도로명 주소
        signUpData.inputList.p_address_2 = cryptoUtil.encrypt_aes(cryptoKey, signUpData.inputList.p_address_2); // 상세 주소

        // 최근 추가된 병원 계정 코드 가져오기
        let recentCode = await mysqlDB('selectOne', queryList.select_recent_user_account, []);

        // p_user_code 세팅 ex) p_1, p_2, p_3 ~
        if (recentCode.rowLength == 0) {
            signUpData.inputList.p_user_code = 'p_1';
        } else {
            let rCode = recentCode.row.p_user_code;
            let numberString = rCode.match(/\d+/)[0]; // 숫자 부분만 떼어내기
            let number = parseInt(numberString);
            let codeNumber = number + 1;
            signUpData.inputList.p_user_code = "p_" + codeNumber;
        }

        let accountArray = [signUpData.inputList.p_user_code, signUpData.inputList.p_user_name, signUpData.inputList.p_account_id, signUpData.inputList.p_account_pw,
            signUpData.inputList.p_phone_first, signUpData.inputList.p_phone_middle, signUpData.inputList.p_phone_last,
            signUpData.inputList.p_email_id, signUpData.inputList.p_email_domain, signUpData.inputList.p_address_1,
            signUpData.inputList.p_address_2, signUpData.inputList.p_user_provide_yn, signUpData.inputList.push_date,
        ];

        logger.info(accountArray);

        //계정 정보 등록
        let result = await mysqlDB('insert', queryList.insert_user_account, accountArray);
        return result;
    };


    /** ================================================================
     *  중복 ID 검사
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async checkIdDuplicate(idString) {
        let result = await mysqlDB('selectOne', queryList.select_user_id_duplicate, [idString]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
     *  중복 연락처 검사
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async checkPhoneDuplicate(phone1, phone2, phone3) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        phone1 = cryptoUtil.encrypt_aes(cryptoKey, phone1);
        phone2 = cryptoUtil.encrypt_aes(cryptoKey, phone2);
        phone3 = cryptoUtil.encrypt_aes(cryptoKey, phone3);

        let result = await mysqlDB('selectOne', queryList.select_phone_duplicate, [phone1, phone2, phone3]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
     *  중복 email 검사
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async checkEmailDuplicate(eIdString, eDomainString) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        eIdString = cryptoUtil.encrypt_aes(cryptoKey, eIdString);

        let result = await mysqlDB('selectOne', queryList.select_user_email_duplicate, [eIdString, eDomainString]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /** ================================================================
     *  이메일 유무 확인 및 인증번호 전송
     *  @author SY
     *  @since 2023.06.20
     *  @history 2023.06.20 초기 작성
     *  ================================================================
     */
    async sendEmail(params, context) {
        let result = {}

        //이메일 인증번호 전송
        let authNumber = ''
        for (let i = 0; i < 6; i++) {
            authNumber += Math.floor(Math.random() * 10);
        }
        let sendResult = await authEmailSend(params.eId, params.eDomain, authNumber, context);
        if (sendResult.status == 'Success') { // 이메일 전송 성공
            result["authNumber"] = authNumber;
            result["success"] = 1;
        } else { // 이메일 전송 실패
            result["success"] = 0;
        }

        return result;
    }

    /**
     *  앱 알림 토큰 업데이트
     *  관련 테이블: user_admin
     *  @params userCode - 유저코드
     *  @params aleretToken - 앱 알림 토큰
     *  @return 조회 결과 반환(json)
     *  @author MY Jang
     *  @since 2021.10.19
     *  @history 
     */
    async updateAlerToken(userCode, alertToken) {
        let updateAlertToken = await mysqlDB('update', queryList.updateAlertToken, [alertToken, userCode]);
        return updateAlertToken;
    }

    /**
     *  로그아웃
     *  관련 테이블: user_account
     *  @params userCode - 사용자 고유 번호
     *  @return result - update 결과 반환(json)
     *  @author JMY
     *  @since 2023.06.23
     */
    async userLogout(userCode) {
        let result = await mysqlDB('update', queryList.update_user_logout, [userCode]);
        return result;
    }

}

/** ================================================================
 *  이메일 인증번호 전송
 *  @author SY
 *  @since 2023.04.03
 *  @history 2023.04.03 초기 작성
 *  ================================================================
 */
async function authEmailSend(eId, eDomain, authNumber, context) {
    console.log(authNumber);
    let result = {}
    let receiveAddress = eId + '@' + eDomain
    try {
        let transporter = nodemailer.createTransport({
            // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
            service: 'gmail',
            // host를 gmail로 설정
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                // Gmail 주소 입력, 'testmail@gmail.com'
                user: process.env.NODEMAILER_USER,
                // Gmail 패스워드 입력
                pass: process.env.NODEMAILER_PASS,
            },
        });

        let info = await transporter.sendMail({
            // 보내는 곳의 이름과, 메일 주소를 입력
            from: `"SCI" <${process.env.NODEMAILER_USER}>`,
            // 받는 곳의 메일 주소를 입력
            to: receiveAddress,
            // 보내는 메일의 제목을 입력
            subject: context.title,
            // 보내는 메일의 내용을 입력
            // text: 일반 text로 작성된 내용
            // html: html로 작성된 내용
            text: authNumber,
            html: `<p>${context.context1}</p>` +
                `<p>${context.context2}</p>` + `<p>${context.context3}</p>` +
                `<br>` +
                `<h3>${context.authNumber}</h3>` +
                `<h3>${authNumber}</h3>` + `<br><br>` +
                `<p>${context.context4}</p>`
        });
        result['status'] = 'Success';
        result['code'] = '200';
        result['message'] = "Success";
    } catch (error) {
        result['status'] = 'Fail';
        result['code'] = '400';
        result['message'] = error;
    }
    return result;


}

module.exports = a_userService;