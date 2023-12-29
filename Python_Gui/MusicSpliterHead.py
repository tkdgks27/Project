import os
import sys
import time
import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
from PyQt5.QtWidgets import QFileDialog, QApplication
from spleeter.separator import Separator
from spleeter.audio.adapter import AudioAdapter

# 메인 기능 
def spleeter_process(in_path, out_path):
  try:
    separator = Separator("spleeter:2stems")
    separator.separate_to_file(in_path, out_path)

    # 분리된 오디오 파일의 경로
    vocal_path = os.path.join(out_path, 'SplitMusicFile\\vocals.wav')
    accompaniment_path = os.path.join(out_path, 'SplitMusicFile\\accompaniment.wav')

    # 각 오디오 파일의 waveform을 로드
    vocal_waveform, sample_rate = librosa.load(vocal_path, sr=None)
    accompaniment_waveform, _ = librosa.load(accompaniment_path, sr=None)

    # vocals Mel spectrogram 계산
    vocal_S = librosa.feature.melspectrogram(y=vocal_waveform, sr=sample_rate, n_mels=128)
    vocal_log_S = librosa.power_to_db(vocal_S, ref=np.max)

    # accompaniment Mel spectrogram 계산
    accompaniment_S = librosa.feature.melspectrogram(y=accompaniment_waveform, sr=sample_rate, n_mels=128)
    accompaniment_log_S = librosa.power_to_db(accompaniment_S, ref=np.max)

  # WaveForm  출력 부분
    # 첫 번째 subplot: vocals
    plt.subplot(2, 1, 1)
    plt.title('Vocals spectrogram')
    librosa.display.specshow(vocal_log_S, sr=sample_rate, x_axis='time', y_axis='mel')
    plt.colorbar(format='%+02.0f dB')

    # 두 번째 subplot: accompaniment
    plt.subplot(2, 1, 2)
    plt.title('Accompaniment spectrogram')
    librosa.display.specshow(accompaniment_log_S, sr=sample_rate, x_axis='time', y_axis='mel')
    plt.colorbar(format='%+02.0f dB')

    # 이미지 출력
    plt.tight_layout()
    plt.savefig(os.path.join(out_path, 'Splitwavefrom.png'))  # 이미지를 파일로 저장

    print("Spleeter Processing Complete!")
    sys.stdout.flush()
  except Exception as e:
        print(f"오류가 발생했습니다: {e}")
        sys.stdout.flush()

# 저장~
if __name__ == '__main__':
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    spleeter_process(in_path, out_path)
