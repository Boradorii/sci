$("#language-change").on('click', function() {
    Swal.fire({
        title: LanguageChange,
        html:
        '<br>'+
        '<strong>' + LanguageSelection + '</strong>'+
        '&nbsp&nbsp&nbsp&nbsp&nbsp'+
        '<select id="language" name="language">'+
        '<option value="ko">한국어</option>'+
        '<option value="en">English</option>'+
        '<option value="zh">简体中文</option>'+
        '<option value="ja">日本語</option>'+
        '</select>'+
        '<br><br>',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText:Change,
        cancelButtonText:Cancellation,
        confirmButtonColor: '#66cccc',
    }).then((result) => {
        if (result.isConfirmed){
            // 한국어
            if($('#language').val() == 'ko'){
                window.parent.postMessage({
                    action: 'language_ko'
                }, '*');
            }
            // 영어
            else if($('#language').val() == 'en'){
                window.parent.postMessage({
                    action: 'language_en'
                }, '*');
            }
            // 중국어
            else if($('#language').val() == 'zh'){
                window.parent.postMessage({
                    action: 'language_zh'
                }, '*');                
            }
            // 일본어
            else if($('#language').val() == 'ja'){
                window.parent.postMessage({
                    action: 'language_ja'
                }, '*');                
            }
        }
    });
});