let hosList


init();

// 병원찾기 페이지 접속 시 등록되어있는 병원 목록 전체 표시
function init() {
    findHos('')
}

//병원 검색 버튼 클릭이벤트
$('#hos-searchbtn').on('click', function() {
    let hosSearch = $('#hos-search').val();
    if (hosSearch == '') {
        errorSwal("병원명 또는 주소를 입력해 주세요")
    } else {
        findHos(hosSearch)
    }
});

$('.selectBtn').on('click', function(evnt) {
    switch (evnt.currentTarget.id) {
        case "all-btn":
            $('.localList').addClass('hide');
            $('.localList').removeClass('block');
            $('.myHos-list').addClass('hide');
            $('.myHos-list').removeClass('block');
            $('#all-btn').addClass('clickBtn');
            $('#local-btn').removeClass('clickBtn');
            $('#myHos-btn').removeClass('clickBtn');
            findHos('')
            break;
        case "local-btn":
            $('.localList').addClass('block');
            $('.localList').removeClass('hide');
            $('.myHos-list').addClass('hide');
            $('.myHos-list').removeClass('block');
            $('#all-btn').removeClass('clickBtn');
            $('#local-btn').addClass('clickBtn');
            $('#myHos-btn').removeClass('clickBtn');
            localHosSearch($('#select-local').val())
            break;
        case "myHos-btn":
            $('.localList').addClass('hide');
            $('.localList').removeClass('block');
            $('.myHos-list').addClass('block');
            $('.myHos-list').removeClass('hide');
            $('#all-btn').removeClass('clickBtn');
            $('#local-btn').removeClass('clickBtn');
            $('#myHos-btn').addClass('clickBtn');
            showMyHos();
            break;

    }
});

$('#select-local').on('change', function() {
    localHosSearch($('#select-local').val());
})


//병원명 or 주소 검색
function findHos(hosSearch) {
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/findHos',
        cmmReqDataObj = { // user_code를 userCode라는 변수에 담아서 router로 보냄.
            p_userCode: p_userCode,
            hosSearch: hosSearch
        },
        cmmAsync = false,

        cmmSucc = function(result) {
            myHos = result.myHos
            hosList = ''
            $('.hos-search-list').html('')
            if (result.findHos.rowLength != 0) {
                for (let i = 0; i < result.findHos.rowLength; i++) {
                    hosList += `<div>
                        <h4 style="border-bottom: 1px solid gray; width: 100%;"></h4>
                        <div class="row" style="align-items: center;">
                            <div class="col hos-list" id="${result.findHos.rows[i].h_user_code}" style="text-align: left; margin-top: 10px; font-weight: 600;" onclick="hosListClick(this)">
                                <p id="hos-name">${result.findHos.rows[i].h_name}</p>
                                <P id="hos-address">${result.findHos.rows[i].h_address1 + " " + result.findHos.rows[i].h_address2}</P>
                            </div>
                            `;

                    if (myHos.includes(result.findHos.rows[i].h_user_code)) {
                        hosList += `
                            <div class="col-2 favorite" id="${result.findHos.rows[i].h_user_code}" onclick="clickHeart(this)">
                                <i class="material-icons" style="color: red;">
                                    favorite
                                </i>
                            </div>`
                    } else {
                        hosList += `
                            <div class="col-2 favorite" id="${result.findHos.rows[i].h_user_code}" onclick="clickHeart(this)">
                                <i class="material-icons" style="color: gray;">
                                    favorite
                                </i>
                            </div>`
                    };
                    hosList += `</div></div>`
                }

                $('.hos-search-list').html(hosList)
                $('.hos-search-list').removeClass('hide')
                $('.hos-search-list').addClass('block')
                $('.hos-list-none').addClass('hide')
                $('.hos-list-none').removeClass('block')
            } else {
                errorSwal("검색 결과가 존재하지 않습니다. \n 병원명 또는 주소를 다시 입력해 주세요.")
                $('.hos-search-list').addClass('hide')
                $('.hos-search-list').removeClass('block')
                $('.hos-list-none').removeClass('hide')
                $('.hos-list-none').addClass('block')
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
};

// 내병원 추가
// 라우터 전송 시 myHos 데이터로 병원 즐겨찾기 추가, 삭제 판단
function clickHeart(target) {
    let heartId = target.id
    let heartIcon = $(target).find('i');
    let currentColor = heartIcon.css('color');

    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/checkmyHos',
        cmmReqDataObj = {
            p_userCode: p_userCode,
            h_userCode: heartId,
            myHosCheck: "uncheck"
        },
        cmmAsync = false,
        cmmSucc,
        cmmErr = null;

    if (currentColor == 'rgb(255, 0, 0)') { //if 즐겨찾기 된 병원이라면
        cmmReqDataObj['myHosCheck'] = 'uncheck'
        cmmSucc = function(result) {
            if (result.state)
                heartIcon.css('color', 'gray');
            else
                alert("에러")
        }
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    } else {
        cmmReqDataObj['myHosCheck'] = 'check'
        cmmSucc = function(result) {
            if (result.state)
                heartIcon.css('color', 'red');
            else
                alert("에러")
        }
        commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
    }
};
//지역별 병원 리스트 조회
function localHosSearch(local) {
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/localHosList',
        cmmReqDataObj = { // user_code를 userCode라는 변수에 담아서 router로 보냄.
            p_userCode: p_userCode,
            local: local
        },
        cmmAsync = false,

        cmmSucc = function(result) {
            myHos = result.myHos
            hosList = ''
            $('.hos-search-list').html('')
            if (result.localHosList.rowLength != 0) {
                for (let i = 0; i < result.localHosList.rowLength; i++) {
                    hosList += `<div>
                        <h4 style="border-bottom: 1px solid gray; width: 100%;"></h4>
                        <div class="row" style="align-items: center;">
                            <div class="col hos-list" id="${result.localHosList.rows[i].h_user_code}" style="text-align: left; margin-top: 10px; font-weight: 600;" onclick="hosListClick(this)">
                                <p id="hos-name">${result.localHosList.rows[i].h_name}</p>
                                <P id="hos-address">${result.localHosList.rows[i].h_address1 + " " + result.localHosList.rows[i].h_address2}</P>
                            </div>
                            `;

                    if (myHos.includes(result.localHosList.rows[i].h_user_code)) {
                        hosList += `
                            <div class="col-2 favorite" id="${result.localHosList.rows[i].h_user_code}" onclick="clickHeart(this)">
                                <i class="material-icons" style="color: red;">
                                    favorite
                                </i>
                            </div>`
                    } else {
                        hosList += `
                            <div class="col-2 favorite" id="${result.localHosList.rows[i].h_user_code}" onclick="clickHeart(this)">
                                <i class="material-icons" style="color: gray;">
                                    favorite
                                </i>
                            </div>`
                    };
                    hosList += `</div></div>`
                }

                $('.hos-search-list').html(hosList)
                $('.hos-search-list').removeClass('hide')
                $('.hos-search-list').addClass('block')
                $('.hos-list-none').addClass('hide')
                $('.hos-list-none').removeClass('block')
            } else {
                $('.hos-search-list').addClass('hide')
                $('.hos-search-list').removeClass('block')
                $('.hos-list-none').removeClass('hide')
                $('.hos-list-none').addClass('block')
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

//내병원 리스트 조회
function showMyHos() {
    let cmmContentType = 'application/json',
        cmmType = 'get',
        cmmUrl = '/api/a_hospital/myHosList',
        cmmReqDataObj = { // user_code를 userCode라는 변수에 담아서 router로 보냄.
            p_userCode: p_userCode
        },
        cmmAsync = false,

        cmmSucc = function(result) {
            hosList = ''
            $('.hos-search-list').html('')
            if (result.rowLength != 0) {
                for (let i = 0; i < result.rowLength; i++) {
                    hosList += `<div>
                        <h4 style="border-bottom: 1px solid gray; width: 100%;"></h4>
                        <div class="row" style="align-items: center;">
                            <div class="col hos-list" id="${result.rows[i].h_user_code}" style="text-align: left; margin-top: 10px; font-weight: 600;" onclick="hosListClick(this)">
                                <p id="hos-name">${result.rows[i].h_name}</p>
                                <P id="hos-address">${result.rows[i].h_address1 + " " + result.rows[i].h_address2}</P>
                            </div>
                            <div class="col-2 favorite" id="${result.rows[i].h_user_code}" onclick="clickHeart(this)">
                                <i class="material-icons" style="color: red;">
                                    favorite
                                </i>
                            </div></div></div>`
                }

                $('.hos-search-list').html(hosList)
                $('.hos-search-list').removeClass('hide')
                $('.hos-search-list').addClass('block')
                $('.hos-list-none').addClass('hide')
                $('.hos-list-none').removeClass('block')
            } else {
                errorSwal("검색 결과가 존재하지 않습니다. \n 병원명 또는 주소를 다시 입력해 주세요.")
                $('.hos-search-list').addClass('hide')
                $('.hos-search-list').removeClass('block')
                $('.hos-list-none').removeClass('hide')
                $('.hos-list-none').addClass('block')
            }

        },
        cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);

}

//병원 상세정보 조회
function hosListClick(target) {
    let h_userCode = target.id
    location.href = baseUrl + '/a_hospital/hosInfoPage?p_userCode=' + p_userCode + '&h_userCode=' + h_userCode;

    window.parent.postMessage({ // 앱 상단 타이틀 변경을 위한 postMessage 전송
        action: 'go-hosInfo'
    }, '*');
}