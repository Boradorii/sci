$(function(){
    let cmmContentType = 'application/json',
    cmmType = 'get',
    cmmUrl = '/api/mypage/data',
    cmmReqDataObj = {
    },
    cmmAsync = false,
    cmmSucc = function (result) {
        for (let i = 0; i < result.announcement.rowLength; i++) {
            const temp = document.createElement("div")
            temp.innerHTML = `
            <li class="info">
            <a class="title">${result.announcement.rows[i].Title}</a>
            <span class="date">${result.announcement.rows[i].Date.substr(0,10)}</span>
            <div class="hide" id="contents">${result.announcement.rows[i].Contents.replace(/\r\n/gi, "<br>")}</div>
            </li>
            <hr class="hr-normal"></hr>`;
            document.querySelector("#insertContents").append(temp);
        }
    },
    cmmErr = null;
    commAjax(cmmContentType, cmmType, cmmUrl, cmmReqDataObj, cmmAsync, cmmSucc, cmmErr);
});



// html dom 이 다 로딩된 후 실행된다.
$(document).ready(function(){

    $(".info").click(function(){
        var submenu = $(this).children(".hide");

        // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
        if( submenu.is(":visible") ){
            submenu.slideUp();
        }else{
            submenu.slideDown();
        }
    });
});














