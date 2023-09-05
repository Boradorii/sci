import socket
import multiprocessing
from re import A
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
        self.highpressuremodel = tf.keras.models.load_model('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230801_bphigh_JSG_ver2_2.h5')  
        self.highpressuresc=load('C:/Users/SCI/Desktop/PPG_Pet/server/model/20230801_bphigh_JSG_ver2_2.bin')

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
    
def main():
    host = '127.0.0.1'
    port = 3867

    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((host, port))

        server_socket.listen(100)
        pred=predict()

        print('Model Predict Server On [' + str(datetime.now()) + ']')

        while  True :
            client_socket, addr= server_socket.accept()
            print('Client Connect [' + str(datetime.now()) + '] : ', addr)

            data = client_socket.recv(2048).decode()
            print(data)
            received_data = json.loads(data)
            DataType = received_data["DT"]
            # [DataType] HCC : 인체용 / D4 : 반려견

            if DataType == "HCC":
                HR = json.loads(received_data["HR"])
                HRV = json.loads(received_data["HRV"])
                VOLTAGE = json.loads(received_data["VOLTAGE"])
                age = received_data["AGE"]
                gender = received_data["GENDER"]

                HR_LIST = []
                HRV_LIST = []
                VOLTAGE_LIST = []
                AGE_LIST = []
                GENDER_LIST = []

                # YGG Start
                af_brachial = 0
                af_tachycardia = 0
                # YGG End

                for i in range(len(HR)) :
                    HR_LIST.append(int(HR[i]))
                    HRV_LIST.append(int(HRV[i]))
                    VOLTAGE_LIST.append(float(VOLTAGE[i]))
                    AGE_LIST.append(int(age))
                    GENDER_LIST.append(int(gender))

                            # YGG Start
                    if int(HR[i]) > 100 :
                        af_tachycardia += 1
                    elif int(HR[i]) < 60 :
                        af_brachial += 1
                af_normal = 60 - af_tachycardia - af_brachial
                # YGG End

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

                pred.set_inputdata(HR_LIST, HRV_LIST, SDNN_LIST, RMSSD_LIST, PNN50_LIST, VLF, LF, HF, FREQUENCY_RATIO, TOTAL_POWER, GENDER_LIST, AGE_LIST)
                predict_glucose = pred.predictGlucose()
                predict_high_pressure = pred.predictHighPressure()
                predict_low_pressure = pred.predictLowPressure()

                hr_avg = int(np.mean(HR_LIST))
                hrv_avg = int(np.mean(HRV_LIST))
                stress = int(SDNN_LIST[0])

                healthIndex = 0

                if predict_glucose < 100 :
                    healthIndex += 30
                elif predict_glucose < 105 :
                    healthIndex += 25
                elif predict_glucose < 110 :
                    healthIndex += 20
                elif predict_glucose < 115 :
                    healthIndex += 15
                elif predict_glucose < 120 :
                    healthIndex += 10
                else :
                    healthIndex += 5

                if predict_high_pressure < 120 :
                    healthIndex += 30
                elif predict_high_pressure < 125 :
                    healthIndex += 25
                elif predict_high_pressure < 130 :
                    healthIndex += 20
                elif predict_high_pressure < 135 :
                    healthIndex += 15
                elif predict_high_pressure < 140 :
                    healthIndex += 10
                else :
                    healthIndex += 5

                if predict_low_pressure < 80 :
                    healthIndex += 30
                elif predict_low_pressure < 85 :
                    healthIndex += 25
                elif predict_low_pressure < 90 :
                    healthIndex += 20
                elif predict_low_pressure < 95 :
                    healthIndex += 15
                elif predict_low_pressure < 100 :
                    healthIndex += 10
                else :
                    healthIndex += 5
                
                if stress < 20 :
                    healthIndex += 10
                elif stress < 40 :
                    healthIndex += 8
                elif stress < 60 :
                    healthIndex += 6
                elif stress < 80 :
                    healthIndex += 4
                else :
                    healthIndex += 2

                result = {
                    'AVG_HR' : hr_avg,
                    'AVG_HRV' : hrv_avg,
                    'HR' : HR_LIST,
                    'HRV' : HRV_LIST,
                    # YGG Start
                    'VLF' : VLF[0],
                    'LF' : LF[0],
                    'HF' : HF[0],
                    'af_normal' : af_normal,
                    'af_brachial' : af_brachial,
                    'af_tachycardia' : af_tachycardia,
                    # YGG End
                    'VOLTAGE' : VOLTAGE_LIST,
                    'Stress' : stress,
                    'Glucose' : predict_glucose,
                    'HighPressure' : predict_high_pressure,
                    'LowPressure' : predict_low_pressure,
                    'HealthIndex' : healthIndex
                }

                resultData = json.dumps(result)

                client_socket.sendall(resultData.encode())

            elif DataType == "D4" :
                HR = json.loads(received_data["HR"])
                HRV = json.loads(received_data["HRV"])
                VOLTAGE = json.loads(received_data["VOLTAGE"])
                age = received_data["AGE"]
                gender = received_data["GENDER"]

                HR_LIST = []
                HRV_LIST = []
                VOLTAGE_LIST = []
                AGE_LIST = []
                GENDER_LIST = []

                # # YGG Start
                # af_brachial = 0
                # af_tachycardia = 0
                # # YGG End

                for i in range(len(HR)) :
                    HR_LIST.append(int(HR[i]))
                    HRV_LIST.append(int(HRV[i]))
                    VOLTAGE_LIST.append(float(VOLTAGE[i]))
                    AGE_LIST.append(int(age))
                    GENDER_LIST.append(int(gender))

                #     # YGG Start
                #     if int(HR[i]) > 100 :
                #         af_tachycardia += 1
                #     elif int(HR[i]) < 60 :
                #         af_brachial += 1
                # af_normal = 60 - af_tachycardia - af_brachial
                # # YGG End

                SDNN_LIST = SDNN_ALL(HRV_LIST)
                RMSSD_LIST = RMSSD_ALL(HRV_LIST)
                PNN50_LIST = PNN50_ALL(HRV_LIST)
                Frequency = Frequency_Derivatives1(HRV_LIST)
                Frequency2 = Frequency_Derivatives2(HRV_LIST)
                VLF = Frequency[0]
                LF = Frequency[1]
                HF = Frequency[2]
                # LF_HF=FREQUENCYRATIO_ALL(HRV_LIST)
                
                FREQUENCY_RATIO = Frequency2[0]
                TOTAL_POWER = Frequency2[1]

                pred.set_inputdata(HR_LIST, HRV_LIST, SDNN_LIST, RMSSD_LIST, PNN50_LIST, VLF, LF, HF, FREQUENCY_RATIO, TOTAL_POWER, GENDER_LIST, AGE_LIST)
                predict_glucose = pred.predictGlucose()
                predict_high_pressure = pred.predictHighPressure()
                predict_low_pressure = pred.predictLowPressure()

                hr_avg = int(np.mean(HR_LIST))
                hrv_avg = int(np.mean(HRV_LIST))

                result = {
                    'AVG_HR' : hr_avg,
                    'AVG_HRV' : hrv_avg,
                    'HR' : HR_LIST,
                    'HRV' : HRV_LIST,
                    'VOLTAGE' : VOLTAGE_LIST,
                    'SDNN':SDNN_LIST[0],
                    'RMSSD':RMSSD_LIST[0],
                    'PNN50':PNN50_LIST[0],
                    'Glucose' : predict_glucose,
                    'HighPressure' : predict_high_pressure,
                    'LowPressure' : predict_low_pressure
                }

                resultData = json.dumps(result)

                client_socket.sendall(resultData.encode())

            print('Client DisConnect [' + str(datetime.now()) + '] : ', addr)
            client_socket.close()
    except Exception as e:
            print(traceback.format_exc())
        

if __name__ == '__main__':
    main()