import sys
# from winsound import SND_NODEFAULT 
import tensorflow as tf
import pandas as pd
import pymysql
import numpy as np 
import traceback
import math
# from sklearn.externals.joblib import load
from sklearn.preprocessing import RobustScaler
import joblib
import sys
sys.modules['sklearn.externals.joblib'] = joblib
from joblib import dump, load
import gzip
import pyhrv
import requests
import json
from datetime import datetime

def SDNN_ALL(hrv) :
    SDNN = np.std(hrv)
    SDNN=round(SDNN,3)
    if SDNN <= 0.001 :
        SDNN = 0.001
    SDNN_LIST = []
    for i in range(len(hrv)) :
        SDNN_LIST.append(SDNN)
    return SDNN_LIST

def RMSSD_ALL(hrv) :
    RMSSD = 0
    RMSSD_LIST = []
    for i in range(len(hrv)-1) :
        RMSSD_LIST.append(int(hrv[i]) - int(hrv[i+1]))
    for i in range(len(RMSSD_LIST)) :
        RMSSD_LIST[i] = int(RMSSD_LIST[i]) * int(RMSSD_LIST[i])
    RMSSD_AVG = sum(RMSSD_LIST) / len(RMSSD_LIST)
    RMSSD = math.sqrt(RMSSD_AVG)
    RMSSD=round(RMSSD,3)
    if RMSSD <= 0.001 :
        RMSSD = 0.001
    RMSSD_LIST = []
    for i in range(len(hrv)) :
        RMSSD_LIST.append(RMSSD)
    return RMSSD_LIST

def PNN50_ALL(hrv) :
    pnn50_count = 0
    for i in range(len(hrv)-1) :
        if abs(hrv[i] - hrv[i+1]) >= 50 :
            pnn50_count += 1
    PNN50 = abs(pnn50_count / (len(hrv) - 1))
    PNN50 = round(PNN50,4)
    if PNN50<=0.0001 :
        PNN50 = 0.0001
    PNN50_LIST = []
    for i in range(len(hrv)) :
        PNN50_LIST.append(PNN50)
    return PNN50_LIST

def Frequency_Derivatives1(hrv) :
    Derivatives = pyhrv.frequency_domain.welch_psd(hrv, show=False)['fft_abs']
    VLF = round(Derivatives[0],6)
    LF = round(Derivatives[1],6)
    HF = round(Derivatives[2],6)
    VLF_LIST = []
    LF_LIST = []
    HF_LIST = []
    for i in range(len(hrv)) :
        VLF_LIST.append(VLF)
        LF_LIST.append(LF)
        HF_LIST.append(HF)

    return [VLF_LIST, LF_LIST, HF_LIST]

def Frequency_Derivatives2(hrv) :
    FREQUENCYRATIO = pyhrv.frequency_domain.welch_psd(hrv, show=False)['fft_ratio']
    TOTALPOWER = pyhrv.frequency_domain.welch_psd(hrv, show=False)['fft_total']
    FREQUENCYRATIO = round(FREQUENCYRATIO,6)
    TOTALPOWER = round(TOTALPOWER,6)
    FREQUENCYRATIO_LIST = []
    TOTALPOWER_LIST = []
    for i in range(len(hrv)) :
        FREQUENCYRATIO_LIST.append(FREQUENCYRATIO)
        TOTALPOWER_LIST.append(TOTALPOWER)
    return [FREQUENCYRATIO_LIST, TOTALPOWER_LIST]

def FREQUENCYRATIO_ALL(hrv) :
    FREQUENCYRATIO = pyhrv.frequency_domain.welch_psd(hrv, show=False)['fft_ratio']
    FREQUENCYRATIO = round(FREQUENCYRATIO,6)
    FREQUENCYRATIO_LIST = []
    for i in range(len(hrv)) :
        FREQUENCYRATIO_LIST.append(FREQUENCYRATIO)
    return FREQUENCYRATIO_LIST

def AGE_ALL(age, hrv) :
    AGE_LIST = []
    for i in range(len(hrv)) :
        AGE_LIST.append(age)
    return AGE_LIST

def GENDER_ALL(gender, hrv) :
    GENDER_LIST = []
    for i in range(len(hrv)) :
        GENDER_LIST.append(gender)
    return GENDER_LIST

def insert_measurement_result(pet_id, age, gender, hr_list, hrv_list, sdnn, rmssd, pnn50, hr_avg, hrv_avg, predict_glucose, predict_high_pressure, predict_low_pressure, userCode):
    try:
        params = {
            'pet_id': pet_id,
            'age' : age,
            'gender' : gender,
            'hr_avg': hr_avg,
            'hrv_avg': hrv_avg,
            'hr': hr_list,
            'hrv': hrv_list,
            'sdnn':sdnn,
            'rmssd':rmssd,
            'pnn50':pnn50,
            'predict_glucose': predict_glucose,
            'predict_high_pressure': predict_high_pressure,
            'predict_low_pressure': predict_low_pressure, 
            'userCode':userCode
            }
        url = "https://192.168.3.160/api/predict/insert_measurement_result"
        response = requests.post(url=url, data=params)
        result= response.json()
        return result

    except Exception as e:
        print(e)
    
class predict:
    def __init__(self):

        # 혈당 #
        self.glucosmodel = tf.keras.models.load_model('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230821_ppgbloodsugar_JSG_ver2_1.h5')
        self.glucossc=load('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230821_ppgbloodsugar_JSG_ver2_1.bin')

        # self.raw_data = pd.read_csv('/home/server/model_server/PPG_chosun351487_LFHFset.csv')
        self.raw_data = pd.read_csv('C:/Users/SCI/Desktop/PPG_Pet/server/api/predict/predictPy/PPG_chosun351487_LFHFset.csv')
        self.raw_data_1 = self.raw_data[['HR','HRV','SDNN','RMSSD','PNN50','VLF','LF','HF','HF_LF','gender','age']]
        self.glucossc= self.glucossc.fit(self.raw_data_1)


        # 최고 혈압 #
        self.highpressuremodel = tf.keras.models.load_model('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230825_ppgbphigh_JSG_ver1_1.h5')  
        self.highpressuresc=load('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230825_ppgbphigh_JSG_ver1_1.bin')

        # 최저 혈압 #
        self.lowpressuremodel = tf.keras.models.load_model('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230801_bplow_JSG_ver2_1.h5')  
        self.lowpressuresc=load('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230801_bplow_JSG_ver2_1.bin')

    def set_inputdata(self,hr_list, hrv_list, sdnn_list, rmssd_list, pnn50_list, VLF_list, LF_list, HF_list, FrequencyRatio_list, TotalPower_list, gender_list, age_list):
        try:
            self.input_glucos_data = pd.DataFrame({ 'HR': hr_list, 'HRV': hrv_list,
                                        'SDNN': sdnn_list,'RMSSD': rmssd_list, 'PNN50': pnn50_list,
                                        'VLF' : VLF_list, 'LF' : LF_list, 'HF' : HF_list, "HF_LF" : FrequencyRatio_list, 
                                        "GENDER" : gender_list, 'AGE' : age_list})
            
            self.input_highPressure_data = pd.DataFrame({'HR': hr_list, 'HRV': hrv_list,
                                        'SDNN': sdnn_list,'RMSSD': rmssd_list, 'PNN50': pnn50_list,
                                        'VLF' : VLF_list, 'LF' : LF_list, 'HF' : HF_list,
                                        'GENDER' : gender_list, 'AGE' : age_list})
            
            self.input_lowPressure_data = pd.DataFrame({ 'HR': hr_list, 'HRV': hrv_list,
                                        'SDNN': sdnn_list,'RMSSD': rmssd_list, 'PNN50': pnn50_list,
                                        'VLF' : VLF_list, 'LF' : LF_list, 'HF' : HF_list,
                                        'GENDER' : gender_list, 'AGE' : age_list})
        except Exception as e:
            print(str(e))

    def predictGlucose(self):
        pred_avg=0
        try:
            X=self.input_glucos_data.values
            X_sc=self.glucossc.transform(X)
            pred=self.glucosmodel.predict(X_sc)
            pred_avg=int(sum(pred)/len(pred))
        except Exception as e:
            print(traceback.print_exc())
            print("glucose",str(e))
        return pred_avg
    
    def predictHighPressure(self):
        pred_avg=0
        try:
            X=self.input_highPressure_data.values
            X_sc=self.highpressuresc.transform(X)
            pred=self.highpressuremodel.predict(X_sc)
            pred_avg=int(sum(pred)/len(pred))
        except Exception as e:
            print("highpressure",str(e))
        return pred_avg
    
    def predictLowPressure(self):
        pred_avg=0
        try:
            X=self.input_lowPressure_data.values
            X_sc=self.lowpressuresc.transform(X)
            pred=self.lowpressuremodel.predict(X_sc)
            pred_avg=int(sum(pred)/len(pred))
        except Exception as e:
            print("lowpressure",str(e))
        return pred_avg


def input():
    global input_cnt
    input_cnt += 1
    return sys.argv[input_cnt]

def health_predict(pet_id, hr, hrv, age, gender, userCode):
    try:
        print(datetime.now())
        hr =hr.replace('[', '')
        hrv =hrv.replace('[', '')
        hr =hr.replace(']', '')
        hrv =hrv.replace(']', '')
        hr = hr.split(',')
        hrv = hrv.split(',')

        HR_LIST = []
        HRV_LIST = []
        AGE_LIST = []
        GENDER_LIST = []

        for i in range(len(hr)) :
            HR_LIST.append(int(hr[i]))
            HRV_LIST.append(int(hrv[i]))
            AGE_LIST.append(int(age))
            GENDER_LIST.append(int(gender))

        SDNN_LIST = SDNN_ALL(HRV_LIST)
        RMSSD_LIST = RMSSD_ALL(HRV_LIST)
        PNN50_LIST = PNN50_ALL(HRV_LIST)
        Frequency = Frequency_Derivatives1(HRV_LIST)
        Frequency2 = Frequency_Derivatives2(HRV_LIST)
        VLF = Frequency[0]
        LF = Frequency[1]
        HF = Frequency[2]
        FREQUENCY_RATIO = Frequency2[0]
        TOTAL_POWER = Frequency2[1]
        AGE = AGE_ALL(age, HRV_LIST)
        GENDER = GENDER_ALL(gender,HRV_LIST)

        print(datetime.now())

        pred=predict()
        pred.set_inputdata(HR_LIST, HRV_LIST, SDNN_LIST, RMSSD_LIST, PNN50_LIST, VLF, LF, HF, FREQUENCY_RATIO, TOTAL_POWER, GENDER_LIST, AGE_LIST)
        predict_glucose = pred.predictGlucose()
        predict_high_pressure = pred.predictHighPressure()
        predict_low_pressure = pred.predictLowPressure()

        print(datetime.now())

        hr_avg = int(np.mean(HR_LIST))
        hrv_avg = int(np.mean(HRV_LIST))

        print(datetime.now())

        print("Glucos : " + str(predict_glucose))
        print("High Pressure : " + str(predict_high_pressure))
        print("Low Pressure : " + str(predict_low_pressure))

        insert_measurement_result(pet_id, age, gender, HR_LIST, HRV_LIST, SDNN_LIST[0], RMSSD_LIST[0], PNN50_LIST[0], hr_avg, hrv_avg, predict_glucose, predict_high_pressure, predict_low_pressure, userCode) 
    except Exception as e:
        print(str(e))

print(sys.argv[0])

input_cnt = 0
pet_id=input()
hr=input()
hrv=input()
age=input()
gender=input()
userCode=input()
print(pet_id, hr, hrv, age, gender)
health_predict(pet_id, hr, hrv, age, gender, userCode)