
function arrhythmiaCal(hr, glucose, high_pressure){
    if(high_pressure < 90){
        high_pressure = 10;
    }else if(high_pressure < 120){
        high_pressure = 25;
    }else if(high_pressure < 130){
        high_pressure = 15;
    }else if(high_pressure < 140){
        high_pressure = 10;
    }else{
        high_pressure = 5;
    }

    if(glucose > 50 && glucose < 100){
        glucose = 50;
    }else if(glucose < 105){
        glucose = 45;
    }else if(glucose < 110){
        glucose = 40;
    }else if(glucose < 120){
        glucose = 30;
    }else if(glucose < 300){
        glucose = 20;
    }else{
        glucose = 10;
    }

    hr = hr*25;
    
    return hr + glucose + high_pressure;
}

function rateCal(hr){
    let af_brachial = 0; // 서맥
    let af_tachycardia = 0; // 빈맥
    let af_normal = 0;
    let cnt = 0;
    let af = {}; // 서맥, 빈맥, 정상
    hr.forEach(function(hrValue, index){
        if(hrValue <= 60){
            af_brachial++;
        }else if(hrValue >= 100){
            af_tachycardia++;
        }
        cnt++;
    });
    af_brachial = (af_brachial / cnt).toFixed(1);
    af_tachycardia = (af_tachycardia / cnt).toFixed(1);
    af_normal = (1-af_brachial-af_tachycardia).toFixed(1);
    af = {af_brachial, af_tachycardia, af_normal};
    return af;
}

console.log("af_brachial" +rateCal(reuslt).af_brachial);
console.log("af_tachycardia " +rateCal(reuslt).af_tachycardia );
console.log("af_normal " +rateCal(reuslt).af_normal );