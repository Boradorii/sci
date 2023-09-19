/** ================================================================
 *  로그인, 회원가입, 정보 수정 등 사용자 관리 로직 구현
 *  @author JG, Jo
 *  @since 2021.04.12
 *  @history 2021.04.19 JG 로그인 기능 추가(jwt)
 *           2021.05.25 JG ID 중복 검사 기능 추가
 *  ================================================================
 */
// DB connection
const mysqlDB = require('../../config/db/database_mysql');
const queryList = require('./user.sql');

// logger
const logger = require('../../config/loggerSettings');

// crypto
const cryptoUtil = require('../../public/javascripts/cryptoUtil');
const jwt = require("jsonwebtoken");

// lodash
const _ = require('lodash');
const { result } = require('lodash');

//nodemailer
const nodemailer = require('nodemailer');
const e = require('express');

class userService {

    /**
     *  사용자 계정 생성(회원가입)
     *  관련 테이블: user_account, user_account
     *  @params signUpData - 사용자 계정 생성에 필요한 정보를 담은 object
     *  @return result - insert 결과 반환(json)
     *  @author SY
     *  @since 2023.02.21
     *  @history 2023.02.21 user_account -> user_account 수정
     * 
     * */
    async createUser(signUpData) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        signUpData.name = cryptoUtil.encrypt_aes(cryptoKey, signUpData.name); // 사용자명
        signUpData.bYear = cryptoUtil.encrypt_aes(cryptoKey, signUpData.bYear); // 생년
        signUpData.bMonth = cryptoUtil.encrypt_aes(cryptoKey, signUpData.bMonth); // 생월
        signUpData.bDay = cryptoUtil.encrypt_aes(cryptoKey, signUpData.bDay); // 생일
        signUpData.phone1 = cryptoUtil.encrypt_aes(cryptoKey, signUpData.phone1); // 폰번호 1
        signUpData.phone2 = cryptoUtil.encrypt_aes(cryptoKey, signUpData.phone2); // 폰번호 2
        signUpData.phone3 = cryptoUtil.encrypt_aes(cryptoKey, signUpData.phone3); // 폰번호 3    
        signUpData.eId = cryptoUtil.encrypt_aes(cryptoKey, signUpData.eId); //이메일 아이디

        let accountArray;
        accountArray = [signUpData.id, signUpData.pwd, signUpData.name, signUpData.provideYN, signUpData.gender,
            signUpData.bYear, signUpData.bMonth, signUpData.bDay, signUpData.phone1, signUpData.phone2, signUpData.phone3, signUpData.eId, signUpData.eDomain
        ];

        logger.info(accountArray);

        // 계정 정보 등록
        let result = await mysqlDB('insert', queryList.insert_user_account, accountArray);
        return result;
    }

    /**
     *  사용자 로그인 수행
     *  관련 테이블: user_account, user_account
     *  @params accountID - 사용자 계정 ID(String)
     *  @params accountPW - 사용자 계정 PW(String, SHA2 HASH)
     *  @return 조회 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.04.19
     *  @history 2021.04.26 JG access token DB에 저장하도록 수정
     *           2021.05.11 JG DB name(복호화), family_id 조회 추가
     *           2021.05.26 JG 중복 로그인 방지  
     */
    async userLogin(accountId, accountPw) {
        let result = {},
            isUser = await mysqlDB('selectOne', queryList.select_user_exist, [accountId, accountPw]);

        if (isUser.state == true && isUser.rowLength === 1) {
            if (isUser.row.login_check == 'Y') {
                result.logincheck = 'Y'
            }
            const payload = { accountId: accountId },
                userCode = isUser.row.user_code,
                accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_TIME, algorithm: 'HS256' }),
                refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_TIME, algorithm: 'HS256' });

            await mysqlDB('update', queryList.update_user_login, [userCode]); //로그인 상태 'Y'로 변경
            await mysqlDB('update', queryList.update_user_jwt_token, [accessToken, refreshToken, userCode]); // access token, refresh token 저장

            result.messageCode = 'ExistUser'
            result.accessToken = accessToken;
            result.userCode = userCode;
            result.familyId = isUser.row.family_id;

            // 개인 정보 복호화
            let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
            cryptoKey = cryptoKey.row.key_string;
            result.userName = cryptoUtil.decrypt_aes(cryptoKey, isUser.row.name);

            // 중복 로그인 방지
            /* if(isUser.row.login_check == 'Y') {
              result.messageCode = 'alreadyLogin';
            } else {
              await mysqlDB('update', queryList.update_user_login, [userCode]);
            } */ // 정상적으로 로그아웃 하지않으면 중복 로그인 체크가 적용되지 않아 임시로 주석처리함 다른 로직이 필요할듯

        } else {
            result.messageCode = 'NotFoundUser';
        }

        return result;
    }

    /**
     *  사용자 인증 토큰 검증
     *  관련 테이블: user_account
     *  @params userCode - 사용자 고유식별 번호
     *  @params accessToken - 사용자 인증 토큰
     *  @return 조회 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.04.19
     *  @history 2021.04.26 JG refresh token 조회 시 access token 조건 추가
     */
    async validateJwtToken(userCode, accessToken) {
        let result = null;
        let accessTokenSlice = accessToken.slice(7) // ※access token: 'Bearer ...'
        let refreshToken = await mysqlDB('selectOne', queryList.select_user_jwt_token, [userCode, accessTokenSlice]);
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
    }

    /**
     *  ID 중복 조회 및 결과 반환
     *  관련 테이블: user_account
     *  @params idString - 중복 검사할 id (string)
     *  @return 중복 ID인 경우 true, 아닌 경우 false
     *  @author JG, Jo
     *  @since 2021.05.25
     */
    async checkIdDuplicate(idString) {
        let result = await mysqlDB('selectOne', queryList.select_user_id_duplicate, [idString]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    async checkPhoneDuplicate(userCode, phone1String, phone2String, phone3String) {
        if (typeof(userCode) == 'undefined') {
            userCode = 0
        }
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        phone1String = cryptoUtil.encrypt_aes(cryptoKey, phone1String);
        phone2String = cryptoUtil.encrypt_aes(cryptoKey, phone2String);
        phone3String = cryptoUtil.encrypt_aes(cryptoKey, phone3String);

        let result = await mysqlDB('selectOne', queryList.select_user_phone_duplicate, [userCode, phone1String, phone2String, phone3String]);
        result = (result.rowLength > 0) ? true : false; //조회결과가 있다면 중복된 연락처

        return result;
    };
    /**
     *  email 중복 조회 및 결과 반환
     *  관련 테이블: user_account
     *  @params eIdString - email id (string)
     *  @params eDomainString - email domain (string)
     *  @return 중복 email인 경우 true, 아닌 경우 false
     *  @author JG, Jo
     *  @since 2021.05.26
     */
    async checkEmailDuplicate(eIdString, eDomainString) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        eIdString = cryptoUtil.encrypt_aes(cryptoKey, eIdString);

        let result = await mysqlDB('selectOne', queryList.select_user_account_email, [eIdString, eDomainString]);
        result = (result.rowLength > 0) ? true : false;
        return result;
    }

    /**
     *  로그아웃
     *  관련 테이블: user_account
     *  @params userCode - 사용자 고유 번호
     *  @return result - update 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     */
    async userLogout(userCode) {
        let result = await mysqlDB('update', queryList.update_user_logout, [userCode]);
        return result;
    }

    /**
     *  회원정보 조회
     *  관련 테이블: user_account, user_account
     *  @params userCode
     *  @return 조회 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history   
     */
    async userInfoShow(userCode) {
        let result = {},
            isUser = await mysqlDB('selectOne', queryList.select_user_detail_info, [userCode]);

        if (isUser.state == true && isUser.rowLength === 1) {
            let resultRow = isUser.row;

            result.messageCode = 'ExistUser'
            result.userCode = userCode;
            result.id = resultRow.account_id;

            // 개인 정보 복호화
            let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
            cryptoKey = cryptoKey.row.key_string;

            result.gender = resultRow.gender;
            result.birth_year = cryptoUtil.decrypt_aes(cryptoKey, resultRow.birth_year);
            result.birth_month = cryptoUtil.decrypt_aes(cryptoKey, resultRow.birth_month);
            result.birth_day = cryptoUtil.decrypt_aes(cryptoKey, resultRow.birth_day);

            result.name = cryptoUtil.decrypt_aes(cryptoKey, resultRow.name);
            result.phone1 = cryptoUtil.decrypt_aes(cryptoKey, resultRow.phone_first);
            result.phone2 = cryptoUtil.decrypt_aes(cryptoKey, resultRow.phone_middle);
            result.phone3 = cryptoUtil.decrypt_aes(cryptoKey, resultRow.phone_last);

        } else {
            result.messageCode = 'NotFoundUser';
        }
        return result;
    }

    /**
     *  사용자 계정 정보 및 사용자 상세 정보 수정
     *  관련 테이블: user_account, user_account
     *  @params modifyData - 사용자 계정 생성에 필요한 정보를 담은 object
     *  @return result - insert 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history 
     */

    async modifyUserInfo(modifyData) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        modifyData.name = cryptoUtil.encrypt_aes(cryptoKey, modifyData.name); // 사용자명
        modifyData.phone1 = cryptoUtil.encrypt_aes(cryptoKey, modifyData.phone1);
        modifyData.phone2 = cryptoUtil.encrypt_aes(cryptoKey, modifyData.phone2);
        modifyData.phone3 = cryptoUtil.encrypt_aes(cryptoKey, modifyData.phone3);


        let accountArray, userInfoArray;

        accountArray = [modifyData.phone1, modifyData.phone2, modifyData.phone3, modifyData.userCode];
        userInfoArray = [modifyData.name, modifyData.userCode];

        logger.info(accountArray);
        logger.info(userInfoArray);

        // 계정 정보 수정
        let result = await mysqlDB('update', queryList.update_user_account, accountArray);

        // 사용자 상세 정보 수정
        if (result.state == true) {
            result = await mysqlDB('update', queryList.update_user_account, userInfoArray);
        }

        return result;
    }

    /**
     *  비밀번호 수정
     *  관련 테이블: user_account
     *  @params userCode - 사용자 고유 번호
     *  @params pwd - 변경할 비밀번호
     *  @return result - insert 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history 
     */
    async modifyUserPassword(userCode, pwd) {
        let result = await mysqlDB('update', queryList.update_new_password, [pwd, userCode]);
        return result;
    }

    /**
     *  사용자 계정 활성 상태 변경(회원탈퇴)
     *  관련 테이블: user_account
     *  @params userCode - 사용자 고유 번호
     *  @params pwd - 변경할 비밀번호
     *  @return result - insert 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history 
     */
    async modifyUserActivate(activateYN, deactivateDate, userCode) {
        let result = await mysqlDB('update', queryList.update_user_activate, [activateYN, deactivateDate, userCode]);
        return result;
    }

    /**
     *  ID 찾기
     *  관련 테이블: user_account, user_account
     *  @params userName
     *  @params email
     *  @return 조회 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history   
     */
    async findUserId(userName, eId, eDomain) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        userName = cryptoUtil.encrypt_aes(cryptoKey, userName);
        eId = cryptoUtil.encrypt_aes(cryptoKey, eId);

        let result = {},
            isUser = await mysqlDB('selectOne', queryList.select_user_id, [userName, eId, eDomain]);

        if (isUser.state == true && isUser.rowLength === 1) {
            let resultRow = isUser.row;

            result.messageCode = 'foundId';
            result.id = resultRow.account_id;
        } else {
            result.messageCode = 'NotFoundUser';
        }
        return result;
    }


    /*
     *  userCode 찾기
     *  관련 테이블: user_account, user_account
     *  @params accountId
     *  @params userName
     *  @params email
     *  @return 조회 결과 반환(json)
     *  @author JG, Jo
     *  @since 2021.05.26
     *  @history   
     */
    async findUserCode(accountId, userName, eId, eDomain) {
        // 개인 정보 암호화
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        userName = cryptoUtil.encrypt_aes(cryptoKey, userName);
        eId = cryptoUtil.encrypt_aes(cryptoKey, eId);

        let result = {},
            isUser = await mysqlDB('selectOne', queryList.select_user_code, [accountId, userName, eId, eDomain]);

        if (isUser.state == true && isUser.rowLength === 1) {
            let resultRow = isUser.row;

            result.messageCode = 'foundUserCode';
            result.userCode = resultRow.user_code;


        } else {
            result.messageCode = 'NotFoundUser';
        }

        return result;
    }

    /*
     *  생년 복호화
     *  관련 테이블: user_account
     *  @params birth_year
     *  @return 조회 결과 반환(json)
     *  @author MiYeong Jang
     *  @since 2021.07.08
     *  @history   
     */
    async decryptBirth(params) {
        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;

        let birth_year = cryptoUtil.decrypt_aes(cryptoKey, params);
        let result = {
            "birth": birth_year
        }
        return result;
    }

    //이메일로 인증번호 전송
    async authEmail(params, context) {
        let result = {}

        let cryptoKey = await mysqlDB('selectOne', queryList.select_key_string, []);
        cryptoKey = cryptoKey.row.key_string;
        let username = params.name,
            userEId = params.eId

        params.name = cryptoUtil.encrypt_aes(cryptoKey, params.name);
        params.eId = cryptoUtil.encrypt_aes(cryptoKey, params.eId);
        let checkUser
        if (Object.keys(params).length == 3) {
            checkUser = await mysqlDB('selectOne', queryList.search_user, [params.name, params.eId, params.eDomain])
        } else {
            checkUser = await mysqlDB('selectOne', queryList.select_user_code, [params.id, params.name, params.eId, params.eDomain])
        }
        if (checkUser.rowLength == 1) {
            //이메일 인증번호 전송
            let authNumber = ''
            for (let i = 0; i < 6; i++) {
                authNumber += Math.floor(Math.random() * 10)
            }
            let sendResult = await authEmailSend(username, userEId, params.eDomain, authNumber, context)
            if (sendResult.status == 'Success') {
                result["authNumber"] = authNumber
                result["success"] = 1
            } else {
                result["success"] = 0
            }
        } else {
            result["success"] = 2
        }
        return result
    }


}

async function authEmailSend(name, eId, eDomain, authNumber, context) {
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
    return result
}


module.exports = userService;