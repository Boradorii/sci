/** ================================================================
 *  Express에 Custom Router 등록 작업 수행 
 *  @author JMY
 *  @since 2023.05.24
 *  @history 2023.05.24 JMY 신규작성
 *  ================================================================
 */

/* Router 선언 */

// TO-DO custom router 선언
// 라우터 주소 작성

// ======web============
const errorRouter = require('../helper/error/error.router'); // 에러 페이지 라우터 
const indexRouter = require('../api/index/index.router')
const measureRouter = require('../api/measurement/measurement.router'); // 혈당혈압 측정페이지 라우터
const patientRouter = require('../api/patient/patient.router'); //환자관리 라우터
const noticeRouter = require('../api/notice/notice.router'); // 병원관리 페이지 라우터
const hospitalRouter = require('../api/hospital/hospital.router'); // 병원관리 페이지 라우터
const userRouter = require('../api/users/user.router'); // 로그인 관련 라우터

// ======app============
const a_userRouter = require('../api/a_user/a_user.router'); // 앱 사용자 라우터
const ahomeRouter = require('../api/a_home/a_home.router'); // 앱 홈 화면 라우터
const ahealthRouter = require('../api/a_health/a_health.router'); // 앱 건강관리 화면 라우터
const ahospitalRouter = require('../api/a_hospital/a_hospital.router'); //앱 병원찾기 화면 라우터
const amypageRouter = require('../api/a_mypage/a_mypage.router'); //앱 마이페이지 화면 라우터
// ======공통============
const predictRouter = require('../api/predict/predict.router'); //예측 수행 라우터
// 라우터 주소 작성



const setupRouter = (app) => {
    try {
        // 라우터 사용 등록
        // ======공통============
        app.use('/api/predict', predictRouter);
        // ======web============
        app.use('/error', errorRouter); // 에러 처리
        app.use('/api', indexRouter);
        app.use('/api/measure', measureRouter) //혈당혈압측정 페이지
        app.use('/api/patient', patientRouter); // 환자관리 페이지
        app.use('/api/notice', noticeRouter); // 병원관리 페이지
        app.use('/api/hospital', hospitalRouter); // 병원관리 페이지
        app.use('/api', userRouter)

        // ======app============
        app.use('/api/a_user', a_userRouter);
        app.use('/api/a_home', ahomeRouter); // 홈 화면
        app.use('/api/a_health', ahealthRouter); // 건강관리 화면
        app.use('/api/a_hospital', ahospitalRouter); // 동물병원 화면
        app.use('/api/a_mypage', amypageRouter); // 동물병원 화면
        // 라우터 사용 등록

        return app;
    } catch (err) {
        console.log('[setupRouter.js] : custom router를 등록할 수 없습니다. router 경로를 확인하세요.');
        return null;
    }
}

module.exports = setupRouter;