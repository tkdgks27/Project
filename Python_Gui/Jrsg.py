import os
import sys
import subprocess
import time
import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
from PyQt5.QtWidgets import QApplication, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QFileDialog, QWidget, QTextEdit, QMessageBox, QSlider, QDial, QGroupBox, QSizePolicy
from PyQt5.QtMultimedia import QMediaPlayer, QAudioRecorder, QMediaContent, QAudioDeviceInfo, QAudio
from PyQt5.QtCore import QUrl, Qt, QTime, QTimer, QProcess
from PyQt5.QtGui import QPixmap, QImage
from spleeter.separator import Separator
from spleeter.audio.adapter import AudioAdapter



class AudioRecorderExample(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    #메인 인자
    def init_ui(self):    
        main_layout = QVBoxLayout(self)
        self.main_media_player = QMediaPlayer()
        self.sub_media_player = QMediaPlayer()
        self.media_player = QMediaPlayer()

        self.audio_recorder = QAudioRecorder()
        self.is_recording = False
        self.button_layout = QHBoxLayout()  
        self.active_box = None
        self.text_edit = QTextEdit(self)
        self.text_edit.setReadOnly(True)
        self.file_dialog = QFileDialog()
        self.selected_file_label = QLabel('Jprg')
        self.selected_file_label.setAlignment(Qt.AlignCenter)

        main_layout.addLayout(self.button_layout)
        main_layout.addWidget(self.text_edit)
        main_layout.addWidget(self.selected_file_label)

    # 텍스트 사이즈
        
        self.text_edit.setMinimumSize(600,410)
        self.text_edit.setMaximumSize(600,410)
        self.text_edit.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        
    # 5종 버튼 - 1 

        button_info = [
            {'text': '설명서', 'function': self.explanation_button},
            {'text': '음악 분할', 'function': self.start_music_split},
            {'text': '음성 녹음', 'function': self.record},
            {'text': '음성 불러오기', 'function': self.file_edit}
        ]
        
        self.select_path_button = QPushButton('Folder Path')
        self.select_path_button.clicked.connect(self.audio_file_load)

        for info in button_info:
            self.create_button(info['text'], info['function'])

        self.save_file_button = self.create_button('합성및 저장', self.save_file)
        
    # Record 와 Load 파일 속성 저장 변수
        self.record_file = None
        self.loaded_file = None
        self.noise_canceling_output_file = None

    # 각 Media Stop_position
        self.mr_stop_position = 0
        self.vocal_stop_position = 0
        self.playStop_position = 0

    # 각 Media time point
        
        # MR 파일의 현재 시간 및 총 시간 표시 업데이트
        self.main_media_player.durationChanged.connect(lambda duration: self.update_mr_time(self.main_media_player.position(), duration))
        self.main_media_player.positionChanged.connect(lambda position: self.update_mr_time(position, self.main_media_player.duration()))

        # Vocal 파일의 현재 시간 및 총 시간 표시 업데이트
        self.sub_media_player.durationChanged.connect(lambda duration: self.update_vocal_time(self.sub_media_player.position(), duration))
        self.sub_media_player.positionChanged.connect(lambda position: self.update_vocal_time(position, self.sub_media_player.duration()))
       
        # Voice 파일의 현재 시간 및 총 시간 표시 업데이트
        self.media_player.durationChanged.connect(lambda duration: self.update_record_time(self.media_player.position(), duration))
        self.media_player.positionChanged.connect(lambda position: self.update_record_time(position, self.media_player.duration()))
  
    # MR slider Box
        self.mr_slider_groupbox = QGroupBox("MR Slider")
        mr_slider_layout = QVBoxLayout()
        self.mr_slider_groupbox.setLayout(mr_slider_layout)
        self.mr_slider_groupbox.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.mr_slider_groupbox.setStyleSheet("QGroupBox { border: 2px solid gray; border-radius: 5px; margin-top: 1ex; } "
                                    + "QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top center; padding: 0 3px; }")

        # MR slider
        self.mr_slider = QSlider(Qt.Horizontal)
        self.mr_slider.sliderMoved.connect(self.mr_slider_moved)
        self.mr_slider.setSingleStep(1)
        self.mr_slider.setPageStep(1)
        self.mr_slider.setFixedSize(290, 20)
        mr_slider_layout.addWidget(self.mr_slider)

        # MR Time Label (최대시간)
        self.mr_time_label = QLabel("00:00 /00:00")
        mr_slider_layout.addWidget(self.mr_time_label)

        mr_horizontal_layout = QHBoxLayout()
        mr_horizontal_layout.setSpacing(5)

        # MR 볼륨바 
        self.mr_qdial = QDial(self)
        self.mr_qdial.setMinimum(0)
        self.mr_qdial.setMaximum(100)
        self.mr_qdial.setValue(30)
        self.mr_qdial.valueChanged.connect(self.main_change_volume)
        self.mr_qdial.setFixedSize(55, 55)
        self.mr_qdial.setNotchesVisible(True)
        mr_horizontal_layout.addWidget(self.mr_qdial)

        # MR Play 버튼
        self.mr_play_button = QPushButton("MR Play")
        self.mr_play_button.setEnabled(True)
        self.mr_play_button.clicked.connect(self.play_mr)
        self.mr_play_button.setFixedSize(80, 40)
        mr_horizontal_layout.addWidget(self.mr_play_button)

        mr_slider_layout.addLayout(mr_horizontal_layout)
        main_layout.addWidget(self.mr_slider_groupbox, stretch=2)

    # Vocal Slider BOX
        
        self.vocal_slider_groupbox = QGroupBox("Vocal Slider")
        vocal_slider_layout = QVBoxLayout()
        vocal_slider_layout.setSpacing(5)
        self.vocal_slider_groupbox.setLayout(vocal_slider_layout)
        self.vocal_slider_groupbox.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.vocal_slider_groupbox.setStyleSheet("QGroupBox { border: 2px solid gray; border-radius: 5px; margin-top: 1ex; } "
                                            + "QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top center; padding: 0 3px; }")
        
        # Vocal Slider
        self.vocal_slider = QSlider(Qt.Horizontal)
        self.vocal_slider.sliderMoved.connect(self.vocal_slider_moved)
        self.vocal_slider.setSingleStep(1)
        self.vocal_slider.setPageStep(1)
        self.vocal_slider.setFixedSize(290, 20)
        vocal_slider_layout.addWidget(self.vocal_slider)

        # Vocal Time Label 
        self.vocal_time_label = QLabel("00:00 / 00:00")
        vocal_slider_layout.addWidget(self.vocal_time_label)

        vocal_horizontal_layout = QHBoxLayout()
        vocal_horizontal_layout.setSpacing(5)

    
        # Vocal 볼륨 
        self.vocal_qdial = QDial(self)
        self.vocal_qdial.setMinimum(0)
        self.vocal_qdial.setMaximum(100)
        self.vocal_qdial.setValue(30)
        self.vocal_qdial.valueChanged.connect(self.sub_change_volume)
        self.vocal_qdial.setFixedSize(55, 55)
        self.vocal_qdial.setNotchesVisible(True)
        vocal_horizontal_layout.addWidget(self.vocal_qdial)

        # Vcoal Play 버튼
        self.vocal_play_button = QPushButton("Vocal Play")
        self.vocal_play_button.setEnabled(True)
        self.vocal_play_button.clicked.connect(self.play_vocal)
        self.vocal_play_button.setFixedSize(80, 40)
        vocal_horizontal_layout.addWidget(self.vocal_play_button)

        vocal_slider_layout.addLayout(vocal_horizontal_layout)

    # simultaneous Box
                
        self.simultaneous_groupbox = QGroupBox("ALL")

        simultaneous_layout = QVBoxLayout()
        simultaneous_layout.setSpacing(10)

        self.simultaneous_groupbox.setLayout(simultaneous_layout)
        self.simultaneous_groupbox.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.simultaneous_groupbox.setStyleSheet("QGroupBox { border: 2px solid gray; border-radius: 5px; margin-top: 1ex; } "
                                        + "QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top center; padding: 0 3px; }")

        # 버튼 추가
        self.simultaneous_play_button = QPushButton("Mr + Vocal Play")
        self.simultaneous_play_button.setEnabled(True)
        self.simultaneous_play_button.clicked.connect(self.play_simultaneous)
        self.simultaneous_play_button.setFixedSize(150, 60)
        simultaneous_layout.addWidget(self.simultaneous_play_button)

        self.simultaneous_play_voice_button = QPushButton("Mr + Voice Play")
        self.simultaneous_play_voice_button.setEnabled(False)
        self.simultaneous_play_voice_button.clicked.connect(self.play_voice_simultaneous)
        self.simultaneous_play_voice_button.setFixedSize(150, 60)
        simultaneous_layout.addWidget(self.simultaneous_play_voice_button)

        self.simultaneous_play_load_button = QPushButton("Mr + File Play")
        self.simultaneous_play_load_button.setEnabled(False)
        self.simultaneous_play_load_button.clicked.connect(self.play_file_simultaneous) 
        self.simultaneous_play_load_button.setFixedSize(150, 60)
        simultaneous_layout.addWidget(self.simultaneous_play_load_button)

        # 볼륨 다이얼 추가
        self.simultaneous_volum_Dial = QDial(self)
        self.simultaneous_volum_Dial.setMinimum(0)
        self.simultaneous_volum_Dial.setMaximum(100)
        self.simultaneous_volum_Dial.setValue(30)
        self.simultaneous_volum_Dial.valueChanged.connect(self.simultaneous_change_volum) 
        self.simultaneous_volum_Dial.setFixedSize(70, 70)
        self.simultaneous_volum_Dial.setNotchesVisible(True)

        # 볼륨 다이얼을 가운데에 놓기 위한 레이아웃 생성
        center_layout = QHBoxLayout()
        center_layout.setAlignment(Qt.AlignCenter)  # 중앙 정렬 설정
        center_layout.addWidget(self.simultaneous_volum_Dial)  # 볼륨 다이얼 추가

        # 볼륨 다이얼을 추가하기 전과 후에 빈 스페이서 추가
        simultaneous_layout.addStretch()
        simultaneous_layout.addLayout(center_layout)
        simultaneous_layout.addStretch()

        # Reset 버튼 추가
        self.simultaneous_reset_button = QPushButton("Reset")
        self.simultaneous_reset_button.setEnabled(False)
        self.simultaneous_reset_button.clicked.connect(self.reset_all)
        self.simultaneous_reset_button.setFixedSize(150, 60)
        simultaneous_layout.addWidget(self.simultaneous_reset_button)
            

       # ALL Tabel
        self.image_label = QLabel()

        # set_image 함수 참조

        self.img_layout = QHBoxLayout()
        self.img_layout.addWidget(self.simultaneous_groupbox)
        self.img_layout.addWidget(self.image_label)
        self.img_layout.setAlignment(self.simultaneous_groupbox, Qt.AlignLeft)
        self.img_layout.setAlignment(self.image_label, Qt.AlignRight)


        main_layout.addLayout(self.img_layout)

    # 녹음 테이블
        
        # 녹음 슬라이더 그룹박스
        self.record_slider_groupbox = QGroupBox("Record")
        record_slider_layout = QVBoxLayout()
        
        # 녹음 슬라이더
        self.voice_slider = QSlider(Qt.Horizontal)
        self.voice_slider.sliderMoved.connect(self.record_slider_moved)  
        self.voice_slider.setSingleStep(1)
        self.voice_slider.setPageStep(1)
        self.voice_slider.setFixedSize(290, 20)   # 크기 지정 (가로, 세로)
        record_slider_layout.addWidget(self.voice_slider)

        # 녹음 시간 표시 라벨
        self.record_time_label = QLabel("00:00 / 00:00")
        record_slider_layout.addWidget(self.record_time_label)

        record_horizontal_layout = QHBoxLayout()
        record_horizontal_layout.setSpacing(5)

        # 녹음 볼륨 다이얼
        self.record_qdial = QDial(self)
        self.record_qdial.setMinimum(0)
        self.record_qdial.setMaximum(100)
        self.record_qdial.setValue(30)
        self.record_qdial.valueChanged.connect(self.record_change_volume) 
        self.record_qdial.setFixedSize(55, 55)
        self.record_qdial.setNotchesVisible(True)
        record_horizontal_layout.addWidget(self.record_qdial)

        # Record 음성 재생 버튼
        self.voice_play_button = QPushButton("Voice Play")
        self.voice_play_button.setEnabled(False)
        self.voice_play_button.clicked.connect(self.play_record) 
        self.voice_play_button.setFixedSize(100, 40)
        record_horizontal_layout.addWidget(self.voice_play_button)

        # Record 음성 녹음 시작 버튼
        self.start_recording_button = QPushButton("Start Recording")
        self.start_recording_button.setEnabled(True)
        self.start_recording_button.clicked.connect(self.recording) 
        self.start_recording_button.setFixedSize(100, 40)
        record_horizontal_layout.addWidget(self.start_recording_button)
        
    # Load 테이블
         
        # Load 음성 파일 
        self.voice_load_play_button = QPushButton("Play")
        self.voice_load_play_button.setEnabled(False)
        self.voice_load_play_button.clicked.connect(self.play_load_voice)
        self.voice_load_play_button.setFixedSize(100, 40)
        record_horizontal_layout.addWidget(self.voice_load_play_button)

        # Load 음성 파일 불러오기 버튼
        self.voice_load_button = QPushButton("Voice load")
        self.voice_load_button.setEnabled(True)
        self.voice_load_button.clicked.connect(self.vocie_file_load)
        self.voice_load_button.setFixedSize(100, 40)
        record_horizontal_layout.addWidget(self.voice_load_button)
        self.voice_load_button.hide()


        record_slider_layout.addLayout(record_horizontal_layout)
        self.record_slider_groupbox.setLayout(record_slider_layout)

        self.record_slider_groupbox.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        self.record_slider_groupbox.setStyleSheet("QGroupBox { border: 2px solid gray; border-radius: 5px; margin-top: 1ex; } "
                                                + "QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top center; padding: 0 3px; }")

        new_group_box_layout = QHBoxLayout()
        new_group_box_layout.addWidget(self.mr_slider_groupbox, stretch=1)
        new_group_box_layout.addWidget(self.vocal_slider_groupbox, stretch=1)
        new_group_box_layout.addWidget(self.record_slider_groupbox, stretch=1)

    # MR Vocal 박스  
        
        # MR, Vocal 그룹박스 - 크기 조절
        horizontal_group_layout = QVBoxLayout()
        horizontal_group_layout.addLayout(new_group_box_layout, stretch=2)
        main_layout.addLayout(horizontal_group_layout)

    # 각종 서브 버튼
        
        # 확인 버튼
        self.confirm_button = QPushButton('확인')
        self.confirm_button.setEnabled(True)
        self.confirm_button.clicked.connect(self.confirm_button_clicked)  

        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.confirm_button, alignment=Qt.AlignRight)
        main_layout.addLayout(bottom_layout)

        # MP3/WAV 로드 버튼
        self.mp3_wav_load_button = QPushButton("파일")
        self.mp3_wav_load_button.setEnabled(True)
        self.mp3_wav_load_button.clicked.connect(self.audio_file_load)  

        # Spleeter 기능 버튼
        self.py_start_button = QPushButton("분할 시작")
        self.py_start_button.setEnabled(True)
        self.py_start_button.clicked.connect(self.spleeter_start) 
        self.py_start_button.setFixedSize(200, 40)
        
        #분할 기능 버튼
        self.split_check_button = QPushButton("분할 확인")
        self.split_check_button.setEnabled(True)
        self.split_check_button.clicked.connect(self.toggle_play)  
        self.split_check_button.setFixedSize(200, 40)

        #Bottom 레이블
        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.split_check_button, alignment=Qt.AlignLeft)
        bottom_layout.addWidget(self.py_start_button, alignment=Qt.AlignLeft)
        bottom_layout.addWidget(self.mp3_wav_load_button, alignment=Qt.AlignRight)
        main_layout.addLayout(bottom_layout)

    # 애플리케이션 종료 시 정지 함수 연결
        app.aboutToQuit.connect(self.main_media_player.stop)
        app.aboutToQuit.connect(self.sub_media_player.stop)
        app.aboutToQuit.connect(self.media_player.stop)

    # 각 media StatusChanged 시그널 연결
        self.main_media_player.mediaStatusChanged.connect(self.mr_status_changed)
        self.mr_slider.valueChanged.connect(self.mr_status_changed)

        self.sub_media_player.mediaStatusChanged.connect(self.vocal_status_changed)
        self.vocal_slider.valueChanged.connect(self.vocal_status_changed)

        self.media_player.mediaStatusChanged.connect(self.media_status_changed)
        self.voice_slider.valueChanged.connect(self.media_status_changed)

    # 초기에 필요없는 요소 숨김
        self.text_edit.hide()
        self.confirm_button.hide()
        self.mp3_wav_load_button.hide()
        
        self.simultaneous_play_button.hide()
        self.simultaneous_play_voice_button.hide()
        self.simultaneous_play_load_button.hide()

        # 음성 분리 관련 요소 숨김
        self.py_start_button.hide()
        self.split_check_button.hide()

        # MR/Vocal 슬라이더 관련 요소 숨김
        self.simultaneous_play_button.hide()
        self.simultaneous_reset_button.hide()
        self.image_label.hide()

        self.mr_slider_groupbox.setVisible(False)
        self.vocal_slider_groupbox.setVisible(False)
        self.record_slider_groupbox.setVisible(False)
        self.simultaneous_groupbox.setVisible(False)

        # 음성 녹음 관련 요소 숨김
        self.record_slider_groupbox.hide()

        # 메인 창 크기 고정
        self.setFixedSize(650, 500)
        self.setLayout(main_layout)

        
        # 초기에 일부 버튼 비활성화
        self.set_buttons_enabled(['음악 분할', '음성 녹음' ,'음성 불러오기','합성및 저장'], False)

#심심해서 넣는 기능
        self.timer = QTimer()
        self.timer.setInterval(500)
        self.timer.timeout.connect(self.update_label)

# 함수 라인
        
#t심심해서 넣는 함수 (Recoding ... 글씨 움직임)
    def update_label(self):
        text = self.selected_file_label.text()
        if text.count('.') < 3 :
            text += '.'
        else:
            text = 'Recording'
        self.selected_file_label.setText(text)

# Base 버튼
        
    # 5종 버튼 세팅 (1)
    def create_button(self, text, function):
        button = QPushButton(text)
        button.clicked.connect(function)
        button.setFixedSize(120, 30)
        self.button_layout.addWidget(button)
        return button  # 버튼 인스턴스 반환
    # 5종 버튼 세팅(2)
    def set_buttons_enabled(self, button_texts, enabled):

        for i in range(self.button_layout.count()):
            button = self.button_layout.itemAt(i).widget()
            if button.text().lower() in button_texts:
                button.setEnabled(enabled)

# 전체 볼륨
    def simultaneous_change_volum(self, value):
        self.main_media_player.setVolume(value)
        self.sub_media_player.setVolume(value)
        self.media_player.setVolume(value)

    # 볼륨 이펙트
        # Main Volume Dial
        self.mr_qdial.blockSignals(True)
        self.mr_qdial.setValue(value)
        self.mr_qdial.blockSignals(False)

        # Sub Volume Dial
        self.vocal_qdial.blockSignals(True)
        self.vocal_qdial.setValue(value)
        self.vocal_qdial.blockSignals(False)

        # Media Volume Dial
        self.record_qdial.blockSignals(True)
        self.record_qdial.setValue(value)
        self.record_qdial.blockSignals(False)

# 설명서
                
    #설명
    def explanation_button(self):
        test_text = (
        "<b><font size='+2'>음원 MR, Vocal 분할 및 합성</font></b><br><br>"
        "<b><font size='+1'>음악 분할</font></b><br><br>"
        "음악 분할 버튼을 누르면 파일 선택 기능이 나옵니다.<br>"
        "파일 선택 후 분할 시작 버튼을 눌러주시면 되는데,<br>"
        "사용자의 컴퓨터 사향에 따라 10 ~ 30초 정도 시간이 소요 될 수 있습니다.<br>"
        "분할이 완료되면 분할 완료 버튼을 눌러 분할된 음성을 확인해보세요.<br>"
        "분리된 음성 파일의 MR은 음성 녹음 , 음성 불러오기 탭에서도 확인해 보실 수 있습니다.<br><br><br>"
        
        "<b><font size='+1'>음성 녹음</font></b><br><br>"
        "음성 녹음 기능은 분리된 MR을 들으며 직접 분리된 음악에 직접 녹음할 수 있는 기능입니다.<br><br><br>"
        
        "<b><font size='+1'>음성 불러오기</font></b><br><br>"
        "음성 불러오기 기능은 분리된 MR 위에 기존에 녹음된 음성을 직접 합성할 수 있는 기능입니다.<br><br><br>"
        
        "<b><font size='+1'>합성및 저장</font></b><br><br>"
        "합성및 저장 기능은 음성 녹음 , 음성 불러오기 작업이 완료된 상태에서만 합성이 가능하며<br>"
        "각 저장 완료시 합성된 음성을 저장하여 사용자 PC에서 직접 확인 하실 수 있습니다."
    )
        self.text_edit.setHtml(test_text)
        self.selected_file_label.setText(" ")
        self.text_edit.show()
        self.confirm_button.show()
        self.image_label.hide()

        self.audio_recorder.stop()
        self.media_player.stop()
        self.sub_media_player.stop()
        self.main_media_player.stop()
        
        self.simultaneous_groupbox.setVisible(False)
        self.mr_slider_groupbox.setVisible(False)
        self.vocal_slider_groupbox.setVisible(False)
        self.record_slider_groupbox.setVisible(False)

        self.mp3_wav_load_button.hide()
        self.split_check_button.hide()

    # 설명창에서 넘어가는 확인 버튼
    def confirm_button_clicked(self):
        self.text_edit.hide()
        self.confirm_button.hide()
        self.set_buttons_enabled(['음악 분할',], True)
        self.mp3_wav_load_button.show()
        self.selected_file_label.setText('파일을 선택해주세요 \n\n현재 사용중인 기능은 음원 MR과 Vocal 분리 기능 입니다.\n\n파일 크기에 따라 10 ~ 30초 정도 소요됩니다. ')

# 음악 분할
               
    # 상단 음악 분할 버튼 클릭
    def start_music_split(self):
        self.confirm_button.hide()
        self.text_edit.hide()
        self.start_recording_button.hide()
        self.mp3_wav_load_button.show()
        self.py_start_button.hide()

        self.record_slider_groupbox.setVisible(False)
        self.vocal_slider_groupbox.setVisible(False)
        self.mr_slider_groupbox.setVisible(False)
        self.simultaneous_groupbox.setVisible(False)

        self.audio_recorder.stop()
        self.media_player.stop()
        self.sub_media_player.stop()
        self.main_media_player.stop()
        self.set_buttons_enabled(['음악 분할'], False)
        self.selected_file_label.setText('      파일을 선택해주세요 \n\n현재 사용중인 기능은 음원 MR과 Vocal 분리 기능 입니다.\n\n10 ~ 30초 정도 소요됩니다. ')
        self.save_file_button.setText('녹음합성 및 저장')
        
    # 분할 확인 버튼
    def toggle_play(self):
        self.split_check_button.hide()

        self.mr_slider_groupbox.setVisible(True)
        self.vocal_slider_groupbox.setVisible(True)
        self.record_slider_groupbox.setVisible(False)
        self.simultaneous_groupbox.setVisible(True)
        
        

        self.simultaneous_play_button.show()
        self.simultaneous_reset_button.show()
        self.simultaneous_play_voice_button.hide()
        self.simultaneous_play_load_button.hide()
        self.image_label.show()
        self.selected_file_label.setAlignment(Qt.AlignRight)
        self.selected_file_label.setText('')
  # 음원 분할 기능
        
    # spleeter API
    def spleeter_start(self):
        self.button_out(False)
        self.selected_file_label.setText('분할 시작.\n\n10 ~ 30초 정도 소요됩니다. \n\n잠시만 기다려주세요.')
        time.sleep(4)
        self.set_buttons_enabled(['음악 분할'], False)
        self.py_start_button.hide()
        self.set_buttons_enabled(['음성 녹음', '음성 불러오기'], True)
        out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
        out_file = os.path.join(out_path, "SplitMusicFile.wav")
        if not os.path.exists(out_path):
            os.makedirs(out_path)
        in_file = self.selected_file_path
        if self.extract_audio_stream(in_file, out_file):
            try:
                print("내가 넣는 파일 위치",out_file)
                print("저장되는 폴더 위치값",out_path)
                command = f"python MusicSpliterHead.py {out_file} {out_path}"
                result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                print("Split Success !! ")

                # 수정: 이미지 파일 경로를 직접 얻어오기
                image_path = os.path.join(out_path, "Splitwavefrom.png")
                if os.path.exists(image_path):
                    self.set_image(image_path)  # 이미지 파일 경로로 이미지 설정

                self.selected_file_label.setText('MR, Vocal 분리완료 \n\n분할 확인 버튼을 눌러 확인해주세요.')
                self.button_out(True)
                
                self.split_check_button.show()
            except subprocess.CalledProcessError as e:
                QMessageBox.warning(self, "오류", "MusicSpliterHead.py 실행 중 오류 발생: " + str(e), QMessageBox.Ok)
                print(e)
                self.py_start_button.show()
                self.button_out(True)
        else:
            QMessageBox.warning(self, "경고", "오디오 스트림 추출 실패.", QMessageBox.Ok)
            self.py_start_button.show()

    # 오디오 스트림 추출
    def extract_audio_stream(self, in_file, out_file):
        self.selected_file_label.setText('오디오 스트림 추출중..')
        time.sleep(2)
        try:
            subprocess.run(["ffmpeg", "-y", "-i", in_file, "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", out_file], check=True)
            return True
        except subprocess.CalledProcessError as e:
            self.selected_file_label.setText('오디오 스트림 추출 실패 다시 시도해주세요..')
            QMessageBox.warning(self, "오류", f"오디오 스트림 추출 실패: {e}", QMessageBox.Ok)
            print(e)
            return False
    
    # Spleeter Wavefrom Img 추출
    def set_image(self, image_path):
        pixmap = QPixmap(image_path)
        scaled_pixmap = pixmap.scaled(400, 270, Qt.KeepAspectRatio)
        self.image_label.setPixmap(scaled_pixmap) 

  # 분할 MR
        
    # 메인 MR
    def play_mr(self):
        try:
            self.simultaneous_reset_button.setEnabled(True)
            if self.mr_play_button.text() == "MR Play": # 재생중
                out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
                mr_file_path = os.path.join(out_path, "SplitMusicFile", "accompaniment.wav")

                # 수정된 부분: 기존 멈춘 위치에서 재생 시작
                self.play_audio(mr_file_path, self.main_media_player)

                self.mr_play_button.setText("MR Stop")
                self.simultaneous_play_button.setText("Mr + Vocal Stop")
            else:                                       # 중지중
                self.main_media_player.pause()
                self.mr_play_button.setText("MR Play")
                self.simultaneous_play_button.setText("Mr + Vocal Play")
                if  self.vocal_play_button.text() != "Vocal Play": # 보컬이 실행 중 일시
                    self.simultaneous_play_button.setText("Mr + Vocal Stop")
                else:
                    return        
        except Exception as e:
            print(f"play_mr 함수에서 예외 발생: {e}")

    # 메인 MR 볼륨
    def main_change_volume(self, value):
        self.main_media_player.setVolume(value)

    # 메인 MR 시간 update
    def update_mr_time(self, position, duration):

        current_time = QTime(0, 0).addMSecs(position)
        total_time = QTime(0, 0).addMSecs(duration)

        time_format = "mm:ss"
        self.mr_time_label.setText(f"{current_time.toString(time_format)} / {total_time.toString(time_format)}")

        #슬라이더 범위 지정
        self.mr_slider.setRange(0, duration) 

        #재생바 위치
        self.mr_slider.setValue(position)

    # 메인 MR slide Position
    def mr_slider_moved(self, slider_value):
        self.mr_stop_position = slider_value
        self.main_media_player.setPosition(slider_value)

    # 메인 MR Position , Value 
    def mr_status_changed(self):
        main_duration = self.main_media_player.duration()
        self.mr_slider.setRange(0, main_duration)

        if self.mr_slider.value() == self.mr_slider.maximum():
            self.mr_play_button.setText("MR Play")
            self.mr_slider.setValue(0)
            self.main_media_player.setPosition(0)

  # 분할 Vocal 

    # 서브 Vocal
    def play_vocal(self):
        try:
            if self.vocal_play_button.text() == "Vocal Play": #재생중일시
                out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
                vocal_file_path = os.path.join(out_path ,"SplitMusicFile", "vocals.wav")
                    # 저장된 위치에서 재생 시작
                self.play_audio(vocal_file_path, self.sub_media_player)
            
                self.vocal_play_button.setText("Vocal Stop")
                self.simultaneous_play_button.setText("Mr + Vocal Stop")
            else:                                               #중지중
                self.sub_media_player.pause()
                self.vocal_play_button.setText("Vocal Play")
                self.simultaneous_play_button.setText("Mr + Vocal Play")
                if  self.mr_play_button.text() != "MR Play": # MR이 실행 중 일시
                    self.simultaneous_play_button.setText("Mr + Vocal Stop")
                else:
                    return
        except Exception as e:
            print(f"play_vocal 함수에서 예외 발생: {e}")

    # 서브 Vocal 볼륨
    def sub_change_volume(self, value):
        self.sub_media_player.setVolume(value)

    # Vocal 시간 update
    def update_vocal_time(self, position, duration):

        current_time = QTime(0, 0).addMSecs(position)
        total_time = QTime(0, 0).addMSecs(duration)

        time_format = "mm:ss"
        self.vocal_time_label.setText(f"{current_time.toString(time_format)} / {total_time.toString(time_format)}")

         #슬라이더 범위 지정
        self.vocal_slider.setRange(0, duration)
        #재생바 위치
        self.vocal_slider.setValue(position)

    # Vocal slider 위치 불러오기
    def vocal_slider_moved(self, slider_value):
        self.vocal_stop_position = slider_value
        self.sub_media_player.setPosition(slider_value)
    
    # Vocal Position , Value 
    def vocal_status_changed(self):
        sub_duration = self.sub_media_player.duration()
        self.vocal_slider.setRange(0, sub_duration)

        if self.vocal_slider.value() == self.vocal_slider.maximum():
            self.vocal_play_button.setText("Vocal Play")
            self.vocal_slider.setValue(0)
            self.sub_media_player.setPosition(0)

  # 분할 MR + Vocal
        
    # MR + Vocal  동시 작동
    def play_simultaneous(self):
        if self.simultaneous_play_button.text() == "Mr + Vocal Play":
            if  self.main_media_player.state != QMediaPlayer.PlayingState or self.sub_media_player.state != QMediaPlayer.PlayingState:
                self.play_vocal()
                self.play_mr()
                self.simultaneous_play_button.setText("Mr + Vocal Stop")
                self.vocal_play_button.setText("Vocal Stop")
                self.mr_play_button.setText("MR Stop")
            else:
                self.main_media_player.pause() 
                self.sub_media_player.pause()
                self.simultaneous_play_button.setText("Mr + Vocal Play")
                self.vocal_play_button.setText("Vocal Play")
                self.mr_play_button.setText("MR Play")
        else:
                self.main_media_player.pause() 
                self.sub_media_player.pause()
                self.simultaneous_play_button.setText("Mr + Vocal Play")
                self.vocal_play_button.setText("Vocal Play")
                self.mr_play_button.setText("MR Play")

# 음성 녹음 기능
        
    # 상단 음성 녹음 버튼 
    def record(self):
        self.selected_file_label.setText('\n Start Recoding 버튼을 눌러 녹음을 시작해 주세요.\n\n현재 사용중인 기능은 음성 녹음 기능 입니다.\n\n자유롭게 사용해주세요. ')
        self.text_edit.hide()
        self.confirm_button.hide()
        self.mp3_wav_load_button.hide()
        self.voice_load_button.hide()
        self.voice_play_button.hide()
        self.voice_load_play_button.hide()

        self.audio_recorder.stop()       
        self.main_media_player.stop()
        self.sub_media_player.stop()
        self.media_player.stop()

        self.voice_play_button.setEnabled(False)
        self.mr_slider_groupbox.setVisible(True)
        self.vocal_slider_groupbox.setVisible(False)
        self.record_slider_groupbox.setVisible(True)
        self.simultaneous_groupbox.setVisible(True)

        self.simultaneous_play_button.hide()
        self.simultaneous_reset_button.show()
        self.simultaneous_play_voice_button.show()
        self.simultaneous_play_load_button.hide()
        self.image_label.hide()
        
        self.set_buttons_enabled(['음성 녹음'],False)
        self.set_buttons_enabled(['음성 분할','음성 불러오기','합성및 저장'],True)
        self.save_file_button.setText('녹음합성 및 저장')

        self.voice_play_button.show()
        self.start_recording_button.show()

        # 음성 분리 관련 요소 숨김
        self.py_start_button.hide()
        self.split_check_button.hide()

        # MR/Vocal 슬라이더 관련 요소 숨김
        self.simultaneous_play_button.hide()
        self.image_label.hide()

        # 음성 녹음 관련 요소 표시
        self.record_slider_groupbox.setTitle("Record")
        self.mr_play_button.setText("MR Play")



    def recording(self):
        out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
        output_file = os.path.join(out_path, "recording.wav")
        self.noise_canceling_output_file = os.path.join(out_path, "noise_canceling_voice.wav")

        if self.audio_recorder.state() == QAudioRecorder.StoppedState:
            if os.path.exists(output_file):
                result = QMessageBox.question(self, '경고', '새로운 녹음을 시작하면 기존 파일이 삭제됩니다.\n계속 진행하시겠습니까?', 
                                                QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
                if result == QMessageBox.No:
                    return
                else:
                    self.media_player.stop()
                    self.media_player.setMedia(QMediaContent())
                    print(f"output_file 2번 조건: {output_file}")
                    os.remove(output_file)
                    self.start_recording(output_file)
                    self.button_out(False)
                    self.mr_play_button.setEnabled(True)
                    self.record_file = self.noise_canceling_output_file

            else:
                print(f"output_file 1번 조건 : {output_file}")
                self.start_recording(output_file)
        else:
            self.stop_record()
            self.record_file = output_file
            self.button_out(True)


    def run_ffmpeg(self, input_file, output_file):
        process = QProcess(self)
        process.finished.connect(lambda exitCode, exitStatus: self.onProcessFinished(exitCode, exitStatus, output_file))
        command = ['ffmpeg', '-i', input_file, '-af', 'highpass=f=60,anlmdn=s=0.00003:p=0.003:r=0.1:o=o:m=11', '-y', output_file]
        print(f"Running command: {' '.join(command)}")
        process.start(command[0], command[1:])


    def readProcessOutput(self, process):
        output = process.readAllStandardOutput()
        print(output.data().decode())

    def onProcessFinished(self, exitCode, exitStatus, noise_canceling_output_file):
        if exitStatus == QProcess.NormalExit and exitCode == 0:
            print("노이즈 제거가 완료되었습니다.")
        else:
            print("노이즈 제거중 오류가 발생했습니다.")
        
 
    def start_recording(self, output_file):
        self.is_recording = True
        self.media_player.setMedia(QMediaContent())
        self.audio_recorder.setOutputLocation(QUrl.fromLocalFile(output_file))
        self.audio_recorder.record()
        
        QTimer.singleShot(0, self.delayed_start_recording)  # Call after the event loop starts

    def delayed_start_recording(self):
        self.start_recording_button.setText("Stop Recording")
        self.selected_file_label.setText('Recording')
        self.timer.start()
        self.button_out(False)
        self.mr_play_button.setEnabled(True)

    def stop_record(self):
        self.timer.stop()
        
        if self.audio_recorder.state() == QAudioRecorder.RecordingState:
            self.audio_recorder.stop()
            self.is_recording = False
            
            output_file = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject', 'noise_canceling_voice.wav')
            input_file = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject', 'recording.wav')
            self.run_ffmpeg(input_file, output_file)
            self.start_recording_button.setText("Start Recording")
            time.sleep(2)
            self.selected_file_label.setText('Record Successly')
            
            self.button_out(True)
            self.media_player.setMedia(QMediaContent())


    def handle_record_success(self):
        self.start_recording_button.setText("Start Recording")
        self.selected_file_label.setText('Record Successfully')
        
        self.button_out(True)
        self.media_player.setMedia(QMediaContent())

    # Record 재생
    def play_record(self):
        try:
            # 녹음 중이라면 재생하지 않고 return
            if self.is_recording == False:
                print(self.is_recording)
            self.start_recording_button.setEnabled(False)
            out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
            record_file_path = os.path.join(out_path, "noise_canceling_voice.wav")   
            

            if self.media_player.state() != QMediaPlayer.PlayingState:
                self.play_audio(record_file_path, self.media_player)
            
                self.voice_play_button.setText("Voice Stop")

            elif self.media_player.state() != QMediaPlayer.PausedState:
                self.media_player.pause()
                self.start_recording_button.setEnabled(True)
                self.voice_play_button.setText("Voice Play")

            else:
                self.media_player.stop()
                self.media_player.setMedia(QMediaContent())

        except Exception as e:
            self.media_player.stop()
            self.selected_file_label.setText(f'상태: 예외 발생{e}')
            print(f'상태: 예외 발생{e}')

    # MR + Voice  동시 작동
    def play_voice_simultaneous(self):
        if self.simultaneous_play_voice_button.text() == "Mr + Voice Play":
            if  self.main_media_player.state != QMediaPlayer.PlayingState or self.media_player.state != QMediaPlayer.PlayingState:
                self.play_record()
                self.play_mr()
                self.simultaneous_play_voice_button.setText("Mr + Voice Stop")
                self.voice_play_button.setText("Voice Stop")
                self.mr_play_button.setText("MR Stop")
            else:
                self.start_recording_button.setEnabled(True)
                self.main_media_player.pause() 
                self.media_player.pause()
                self.simultaneous_play_voice_button.setText("Mr + Voice Play")
                self.voice_play_button.setText("Voice Play")
                self.mr_play_button.setText("MR Play")
        else:
                self.start_recording_button.setEnabled(True)
                self.main_media_player.pause() 
                self.media_player.pause()
                self.simultaneous_play_voice_button.setText("Mr + Voice Play")
                self.voice_play_button.setText("Voice Play")
                self.mr_play_button.setText("MR Play")

    # Record 볼륨 
    def record_change_volume(self, value):
        self.media_player.setVolume(value)

    # Record slider 위치 불러오기
    def record_slider_moved(self, slider_value):
        self.playStop_position = slider_value
        self.media_player.setPosition(slider_value)

    # Record Position, Value
    def media_status_changed(self):
        vocie_duration = self.media_player.duration()
        self.voice_slider.setRange(0, vocie_duration)

        if self.voice_slider.value() == self.voice_slider.maximum():
            self.voice_play_button.setText("Voice Play")
            self.voice_slider.setValue(0)
            self.media_player.setPosition(0)
            self.start_recording_button.setEnabled(True)

# 음성 선택 기능
            
    # 상단 음성 불러오기 버튼
    def file_edit(self):
        self.text_edit.hide()
        self.confirm_button.hide()
        self.start_recording_button.hide()
        self.voice_play_button.hide()
        self.mp3_wav_load_button.hide()

        self.audio_recorder.stop()
        self.media_player.stop()
        self.sub_media_player.stop()
        self.main_media_player.stop()

        self.vocal_play_button.setEnabled(False)
        self.mr_slider_groupbox.setVisible(True)
        self.record_slider_groupbox.setVisible(True)
        self.voice_load_play_button.setEnabled(False)
        self.simultaneous_groupbox.setVisible(True)

        self.simultaneous_play_button.hide()
        self.simultaneous_reset_button.show()
        self.simultaneous_play_voice_button.hide()
        self.simultaneous_play_load_button.show()
        self.image_label.hide()
        

        self.voice_load_play_button.show()
        self.voice_load_button.show()
        self.set_buttons_enabled(['음성 불러오기'],False)
        self.set_buttons_enabled(['음성 분할','음성 녹음','합성및 저장'],True)
        self.save_file_button.setText('파일합성 및 저장')
        self.selected_file_label.setText('\n파일을 선택해주세요 \n\n현재 사용중인 기능은 본인 목소리 파일을 불러오는 기능입니다.\n\n오디오 스트림 추출을 위해 3 ~ 5초 정도 소요됩니다. ')
        self.record_time_label.setText("00:00 /00:00")
        self.record_slider_groupbox.setTitle("Load file")
        self.mr_play_button.setText("MR Play")
    
    #모든 버튼 On Off
    def button_out(self, tf):
        self.simultaneous_reset_button.setEnabled(tf)
        self.simultaneous_play_button.setEnabled(tf)
        self.simultaneous_play_load_button.setEnabled(tf)
        self.simultaneous_play_voice_button.setEnabled(tf)
        self.simultaneous_volum_Dial.setEnabled(tf)
        self.simultaneous_reset_button.setEnabled(tf)

        self.voice_load_play_button.setEnabled(tf)
        self.voice_play_button.setEnabled(tf)
        self.mr_play_button.setEnabled(tf)
        self.vocal_play_button.setEnabled(tf)
        
        self.voice_load_button.setEnabled(tf)

        self.set_buttons_enabled(['음악 분할', '음성 녹음', '음성 불러오기', '합성및 저장'], tf)

    # 음성 파일 선택기능( 확장자 제거 )
    def vocie_file_load(self):
        self.media_player.stop()
        self.media_player.setMedia(QMediaContent())
        options = QFileDialog.Options()
        options |= QFileDialog.DontUseNativeDialog
        file_dialog = QFileDialog()
        file_dialog.setFileMode(QFileDialog.ExistingFile)
        self.voice_load_play_button.setText("Play")
        self.record_time_label.setText("00:00 /00:00")

        desktop_path = os.path.expanduser("~/Desktop")
        out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
        in_path, _ = file_dialog.getOpenFileName(None, "Select File", desktop_path, "Audio File ( *.mp3 *.mp4 *.wav)")     
        out_file = out_file = os.path.join(out_path, "load_voice_file.wav")
        self.selected_file_path = in_path
        self.simultaneous_play_load_button.setEnabled(True)
        # 파일이 이미 존재한다면 제거
        if os.path.exists(out_file):
            os.remove(out_file)
            self.button_out(False)

        if in_path.lower().endswith(('.mp3','.mp4', '.wav')):
            if self.extract_audio_stream(in_path, out_file):
                self.media_player.stop()
                self.voice_load_play_button.setEnabled(True)
                self.selected_file_label.setText(f'Selected File: {in_path}\n\n"Play" 버튼을 눌러 확인해주세요.\n\n재 선택시 오디오 스트림 추출을 위해 3 ~ 5초 정도 소요됩니다.')
                self.loaded_file = out_file
                self.button_out(True)

            else:
                QMessageBox.warning(self, "Warning", "MP3 , MP4 , WAV 파일만 사용하실 수 있습니다.", QMessageBox.Ok)
        else:
            QMessageBox.warning(self, "Warning", "파일 선택을 취소하셨습니다.", QMessageBox.Ok)
            self.button_out(True)

    # 음성 녹음 파일 실행
    def play_load_voice(self):
        out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
        load_file_path = os.path.join(out_path, "load_voice_file.wav")

        if self.media_player.state() != QMediaPlayer.PlayingState:
            self.play_audio(load_file_path, self.media_player)
            self.voice_load_play_button.setText("Stop")
        
        elif self.media_player.state() != QMediaPlayer.PausedState:
            self.media_player.pause()
            self.voice_load_play_button.setText("Play")
        else:
            self.media_player.stop()
            self.media_player.setMedia(QMediaContent())

    # MR + file  동시 작동
    def play_file_simultaneous(self):
        if self.simultaneous_play_load_button.text() == "Mr + File Play":
            if  self.main_media_player.state != QMediaPlayer.PlayingState or self.media_player.state != QMediaPlayer.PlayingState:
                self.play_load_voice()
                self.play_mr()
                self.simultaneous_play_load_button.setText("Mr + File Stop")
                self.voice_load_play_button.setText("Stop")
                self.mr_play_button.setText("MR Stop")
            else:
                self.main_media_player.pause() 
                self.media_player.pause()
                self.simultaneous_play_load_button.setText("Mr + File Play")
                self.voice_load_play_button.setText("Play")
                self.mr_play_button.setText("MR Play")
        else:
                self.main_media_player.pause() 
                self.media_player.pause()
                self.simultaneous_play_load_button.setText("Mr + File Play")
                self.voice_load_play_button.setText("Play")
                self.mr_play_button.setText("MR Play")

 # 음성 파일 선택기능( 분할용 확장자 걸러내기 )
    def audio_file_load(self):
        self.set_buttons_enabled(['음악 분할'], False)
        options = QFileDialog.Options()
        options |= QFileDialog.DontUseNativeDialog
        desktop_path = os.path.expanduser("~/Desktop")
        file_dialog = QFileDialog()
        file_dialog.setFileMode(QFileDialog.ExistingFile)

        in_path, _ = file_dialog.getOpenFileName(None, "Select File", desktop_path, "Audio File (*.mp4 *.mp3 *.wav)")
        if in_path:
            if in_path.lower().endswith(('mp4','.mp3', '.wav')):
                self.selected_file_path = in_path
                self.selected_file_label.setText(f'Selected File: {in_path}\n\n"분할 시작" 버튼을 눌러주세요.\n파일 크기에 따라 10 ~ 30초 정도 소요됩니다.')
                self.py_start_button.show()
            else:
                QMessageBox.warning(self, "Warning", "MP4 , MP3 , WAV 파일만 사용하실 수 있습니다.", QMessageBox.Ok)
        else:
            QMessageBox.warning(self, "Warning", "파일 선택을 취소하셨습니다.", QMessageBox.Ok)
            self.py_start_button.hide()  # 추가: 파일 선택을 취소하면 '분할 시작' 버튼을 숨김

# 상위 합성및 저장 버튼
    
  # 저장  
    def save_file(self):
        print("save_file pressed")
        out_path = os.path.join(os.getenv('USERPROFILE'), 'Desktop', 'MusicProject')
        mr_path = os.path.join(out_path, "SplitMusicFile","accompaniment.wav")
        print(mr_path)

        # 녹음된 파일이나 불러온 파일이 없다면, 저장을 취소합니다.
        if self.record_file is None and self.loaded_file is None:
            QMessageBox.warning(self, "알림", "선택된 파일이 없습니다.", QMessageBox.Ok)
            return
        else:
            # 사용자가 저장할 파일의 경로와 형식을 선택하도록 합니다.
            file_dialog = QFileDialog()
            file_dialog.setAcceptMode(QFileDialog.AcceptSave) # 파일 저장 모드로 설정
            file_dialog.setFileMode(QFileDialog.AnyFile) # 모든 파일 타입 허용
            file_dialog.setNameFilter("WAV Audio (*.wav);;MP3 Audio (*.mp3)") # 파일 필터 설정
            file_dialog.setDefaultSuffix("wav") # 기본 확장자 설정
            file_dialog.selectFile("MixAudio.wav")

            if file_dialog.exec_() == QFileDialog.Accepted:
                file_path = file_dialog.selectedFiles()[0]
                selected_filter = file_dialog.selectedNameFilter()

                # 사용자가 선택한 파일 형식을 파악합니다.
                if selected_filter == "WAV Audio (*.wav)":
                    output_format = "wav"
                elif selected_filter == "MP3 Audio (*.mp3)":
                    output_format = "mp3"
                else:
                    print("Unsupported file format. Exiting.")
                    return

                # 사용자가 선택한 파일 경로를 사용하여 녹음 및 파일 합성을 진행합니다.
                if self.save_file_button.text() == '녹음합성 및 저장':
                    if self.record_file is not None:
                        subprocess.run(["python", "mixsave.py", self.record_file,  mr_path, file_path, output_format], check=True)
                        output_folder = os.path.dirname(file_path)
                        os.startfile(output_folder)
                    else:
                        QMessageBox.warning(self, "알림", "녹음을 먼저 진행해주세요.", QMessageBox.Ok)
                        return
                else:
                    if self.save_file_button.text() == '파일합성 및 저장':
                        if self.loaded_file is not None:
                            subprocess.run(["python", "mixsave.py", self.loaded_file, mr_path, file_path, output_format], check=True)
                            output_folder = os.path.dirname(file_path)
                            os.startfile(output_folder)
                        else:
                            QMessageBox.warning(self, "알림", "파일을 먼저 선택해주세요.", QMessageBox.Ok)
                            return
            else:
                print("No file path selected. Exiting.")

# Time Tabel
    def update_record_time(self, position, duration):

        current_time = QTime(0, 0).addMSecs(position)
        total_time = QTime(0, 0).addMSecs(duration)

        time_format = "mm:ss"
        self.record_time_label.setText(f"{current_time.toString(time_format)} / {total_time.toString(time_format)}")

        # 슬라이더 범위 지정
        self.voice_slider.setRange(0, duration)

        # 재생바 위치
        self.voice_slider.setValue(position)

# ALL Media Player 초기화
    def reset_all(self):
        self.sub_media_player.stop()
        self.main_media_player.stop()
        self.media_player.stop()
        self.simultaneous_play_button.setText("Mr + Vocal Play")
        self.simultaneous_play_voice_button.setText("Mr + Voice Play")
        self.simultaneous_play_load_button.setText("Mr + File Play")

# QMediaPlayer로 오디오 파일 재생
    def play_audio(self, file_path, media_player):
        if media_player.state() == QMediaPlayer.PlayingState:
            media_player.pause()
        if media_player.state() == QMediaPlayer.PausedState:
            media_player.play()
        else:
            print(f"Setting media for file: {file_path}")
            media_content = QMediaContent(QUrl.fromLocalFile(file_path))
            media_player.setMedia(media_content)
            print("Media set. Now playing...")
            media_player.play()

if __name__ == '__main__':

    app = QApplication([])
    window = AudioRecorderExample()
    window.setWindowTitle('Audio Recorder Example')
    window.show()
    sys.exit(app.exec_())
