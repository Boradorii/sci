const _ = require('lodash');

// 호출할 service 정의
const service = require('./notice.service');
const svInstance = new service();

class noticeController {
    async loadNoticePage(req, res, next) {
        let h_adminCode = req.params.h_adminCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('web/notice/notice', {
            "noticePage": req.__('noticePage'),
            "h_adminCode": h_adminCode
        });
    };

    //  미확인 알림 내역 조회
    async noticeNList(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let noticeNList = await svInstance.noticeNList(h_user_code);

        return res.send(noticeNList)
    };

    //  확인 알림 내역 조회
    async noticeYList(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let noticeYList = await svInstance.noticeYList(h_user_code);

        return res.send(noticeYList)
    };

    //  문진표 내용 조회
    async inquiryList(req, res, next) {
        let inquiry_num = req.body.inquiry_num;
        let inquiryList = await svInstance.inquiryList(inquiry_num);

        return res.send(inquiryList)
    };

    //  확인 알림 내역 검색
    async searchInfo(req, res, next) {
        let h_user_code = req.body.h_adminCode;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let name = req.body.name;
        let select = req.body.select;

        let searchInfo = await svInstance.searchInfo(h_user_code, startDate, endDate, name, select);
        return res.send(searchInfo)
    };


    //  문의 답변 전송 버튼 클릭 시 답변을 inquiry_list의 opinion에 등록
    async inquiry_post(req, res, next) {
        let inquiry_num = req.body.inquiry_num;
        let inquiry_contents = req.body.inquiry_contents;
        console.log(inquiry_contents);
        let inquiry_post = await svInstance.inquiry_post(inquiry_num, inquiry_contents);
        return res.send(inquiry_post)
    };



}

module.exports = noticeController;