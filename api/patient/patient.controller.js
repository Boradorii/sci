const _ = require('lodash');

// 호출할 service 정의
const service = require('./patient.service');
const svInstance = new service();

class patientController {
    async loadPatientPage(req, res, next) {
        let h_adminCode = req.params.h_adminCode; // url에 data 포함하여 전송한 경우 값 가져오기
        return res.render('web/patient/patient', {
            "patientPage": req.__('patientPage'),
            "h_adminCode": h_adminCode
        });
    };

    //  환자 및 보호자 정보 검색
    async searchPetInfo(req, res, next) {
        let h_adminCode = req.body.h_adminCode;
        let select = req.body.select;
        let name = req.body.name;
        let searchPetInfo = await svInstance.searchPetInfo(select, name, h_adminCode);

        return res.send(searchPetInfo)
    };

    //  환자 및 보호자 정보
    async petInfoLoad(req, res, next) {
        let petId = req.body.petId;
        let h_user_code = req.body.h_adminCode;
        let petInfoLoad = await svInstance.petInfoLoad(petId, h_user_code);

        return res.send(petInfoLoad)
    };
    //  환자 및 보호자 정보 수정
    async petInfoModify(req, res, next) {
        let petId = req.body.petId;
        let pet_isNeutering = req.body.pet_isNeutering;
        let pet_note = req.body.pet_note;
        let pet_weight = req.body.pet_weight;
        let piN = req.body.piN;
        let pW = req.body.pW;
        let pN = req.body.pN;

        let petInfoModify = await svInstance.petInfoModify(petId, pet_isNeutering, pet_note, pet_weight, piN, pW, pN);

        return res.send(petInfoModify);
    };

    //  진료 내역 조회
    async diagnosis_Records(req, res, next) {
        let h_adminCode = req.body.h_adminCode;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let name = req.body.name;
        let petId = req.body.petId;


        let diagnosis_Records = await svInstance.diagnosis_Records(h_adminCode, startDate, endDate, name, petId);
        return res.send(diagnosis_Records)
    };
    // 진료 내용 조회
    async diagnosis_detail(req, res, next) {
        let medi_num = req.body.medi_num;
        let diagnosis_detail = await svInstance.diagnosis_detail(medi_num);

        return res.send(diagnosis_detail)
    };
    // 진료 내용 수정
    async diagnosis_detail_modify(req, res, next) {
            let date = req.body.date,
                medi_num = req.body.medi_num,
                purpose = req.body.purpose,
                contents = req.body.contents;


            let diagnosis_detail_modify = await svInstance.diagnosis_detail_modify(date, medi_num, purpose, contents);

            return res.send(diagnosis_detail_modify)
        }
        // 진료 내용 삭제
    async diagnosis_detail_delete(req, res, next) {
        let medi_num = req.body.medi_num
        let diagnosis_detail_delete = await svInstance.diagnosis_detail_delete(medi_num);

        return res.send(diagnosis_detail_delete)
    }

    // 진료기록 진료의 목록 불러오기
    async diagnosis_regist_doctorList(req, res, next) {
        let h_user_code = req.body.h_adminCode;

        let diagnosis_regist_doctorList = await svInstance.diagnosis_regist_doctorList(h_user_code);

        return res.send(diagnosis_regist_doctorList)
    }

    // 진료기록 등록하기
    async diagnosis_regist(req, res, next) {
        let data = req.body;

        let diagnosis_regist = await svInstance.diagnosis_regist(data);

        return res.send(diagnosis_regist)
    }

    // 최근 생체정보 조회
    async select_bioinfo(req, res, next) {

        let data = req.body
        let select_bioinfo = await svInstance.select_bioinfo(data);

        return res.send(select_bioinfo)
    }

    //  최근 생체정보 차트 그리기
    async draw_chart(req, res, next) {

        let data = req.body
        let draw_chart = await svInstance.draw_chart(data);

        return res.send(draw_chart)
    }

    // 생체정보 세부내용 조회
    async bioInfo_detail(req, res, next) {
        let pd_num = req.body.pd_num;

        let bioInfo_detail = await svInstance.bioInfo_detail(pd_num);

        return res.send(bioInfo_detail)
    }



}

module.exports = patientController;