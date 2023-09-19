/** ================================================================
 *  Express에 Custom Router 등록 작업 수행 
 *  
 *  @author JG, Jo
 *  @since 2021.03.30
 *  @history 2021.04.12 JG user router 등록
 *           2021.04.22 JG error router 등록
 *           2021.04.27 MY note router 등록
 *           2021.04.29 MY report router 등록
 *           2021.05.13 MJ sensor router 등록
 *  ================================================================
 */

/* Router 선언 */
// const devGuideRouter = require('../api/00DevGuide/devGuide.router'); // 개발 가이드
// TO-DO custom router 선언


const homeRouter = require('../api/home/home.router'); // 홈 화면 라우터
const mypageRouter = require('../api/mypage/mypage.router'); //내정보 라우터
const resultRouter = require('../api/result/result.router'); // 건강상태 조회 라우터
const userRouter = require('../api/users/user.router'); // 사용자 관련 기능 수행 라우터
const errorRouter = require('../helper/error/error.router'); // 에러 처리 라우터
const healthRouter = require('../api/a_health/a_health.router'); //  건강상태 측정 라우터




const setupRouter = (app) => {

    try {
        app.use('/api/home', homeRouter); // 홈 화면
        app.use('/api/mypage', mypageRouter); // 내정보
        app.use('/api/a_health', healthRouter); // 건강상태 측정
        app.use('/api/result', resultRouter); // 건강상태 조회
        app.use('/api/users', userRouter); // 사용자 관련 기능 수행
        app.use('/error', errorRouter); // 에러 처리
        return app;
    } catch (err) {
        //console.log(err);
        console.log('[setupRouter.js] : custom router를 등록할 수 없습니다. router 경로를 확인하세요.');
        return null;
    }
}

module.exports = setupRouter;