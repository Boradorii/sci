/** =============================================
 * 초기 화면 controller(회원가입, 로그인, 정보수정 관리)
 * @since 2023.05.31
 * @history 2023.05.31. JMY 초기작성
 * ==============================================
 */

// logger
const logger = require('../../config/loggerSettings');

// 호출할 service 정의
// const service = require('./index.service');
// const svInstance = new service();

class indexClass {
    async loadIndexPage(req, res, next) {
        return res.render('web/index/index')
    }
}

module.exports = indexClass