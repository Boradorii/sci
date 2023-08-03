/** ================================================================
 *  Express Loader Class
 *  @author JG, Jo
 *  @since 2021.03.30
 *  @history 2021.04.06 JG 다국어 기능 추가(i18n)
 *           2021.04.07 JG View Engine(Nunjucks) 추가
 *           2021.05.07 JG 시스템 에러 발생 시 에러 처리 페이지 이동 
 *           2021.05.11 JG 정적 리소스 경로 추가(/web)
 *  ================================================================
 */
// logger 2021.05.07 JG
const logger = require('../config/loggerSettings'); //log 파일 저장/

/* Config */
const config = require('dotenv').config({ path: './config/env/.env.local' }); // 로컬/개발/운영에 따라 env 파일 경로 수정해서 사용

/* Helper scripts */
const setupRouter = require('../helper/setupRouter'); //라우터 세팅

/* MiddleWare & Module 선언  */
const express = require('express');
const compression = require('compression'); //데이터 전송 시 압축
const morgan = require('morgan'); // 로그관리
const path = require('path');

const i18n = require('../config/global/i18n');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');

// cors 오류 방지
const cors = require('cors');

const nunjucks = require('nunjucks');

class ExpressLoader {
    constructor() {
        const app = express();

        /* View engin */
        app.set('view engine', 'html');
        nunjucks.configure('views', {
            express: app,
            watch: true
        });

        /* Middleware 등록 */
        app.use(compression());
        app.use(morgan('dev'));
        app.use(express.json()); // Express 4.16 버전 이후부터는 body-parser 대신 express.json() 모듈 사용

        app.use(cookieParser());
        app.use(i18n); // express, cookieParser 미들웨어 설정 밑에 위치 해야 에러 발생 X

        // cors 오류 방지
        app.use(cors());
        // cors 오류 방지

        app.use(express.urlencoded({ extended: false })); //클라이언트로 부터 받은 http 요청 메시지 형식에서 body데이터를 해석하기 위해
        app.use(express.static(path.join(__dirname, '../public'))); // static file 사용을 위해
        app.use('/web', express.static('views/web'));
        app.use('/app', express.static('views/app'));

        /* Router 등록 실행 */
        this.app = setupRouter(app);

        /* Error Handler 등록 */
        // 다른 미들웨어 제일 아래에 위치해야함
        this.app.use(function(req, res, next) { // 404 error
            logger.error('[Router Error]: ' + req.originalUrl);
            return res.render('web/error/errorPage', { // 에러 처리 페이지 이동 2021.04.30 JG
                'errorCode': 'ROUTERROR',
                'errorTitle': req.__('errorPage').errorTitleRout,
                'errorMsg': req.__('errorPage').errorMsgRout
            });
        });

        this.app.use(function(error, req, res, next) { // other error
            logger.error('[System Error]: ' + error.message);
            logger.error(error);
            return res.render('web/error/errorPage', { // 에러 처리 페이지 이동 2021.05.07 JG
                'errorCode': 'SYSERROR',
                'errorTitle': req.__('errorPage').errorTitleSystem,
                'errorMsg': req.__('errorPage').errorMsgSystem
            });
        });
        this.app = app;
    }

    get expressApp() {
        return this.app;
    }

    get portInfo() {
        return process.env.APP_PORT || 4000;
    }
}

module.exports = ExpressLoader;