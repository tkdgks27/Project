import os
import sys
from pydub import AudioSegment

def overlap_audio_files(in_paths, out_path, output_format="mp3"):
    if not in_paths:
        print("No files selected. Exiting.")
        return

    # 오디오 파일들을 불러오기
    audio_segments = [AudioSegment.from_file(file) for file in in_paths]

    # 모든 오디오 세그먼트가 제일 긴 오디오 파일의 길이에 맞도록 조정
    max_duration = max(len(segment) for segment in audio_segments)
    audio_segments = [segment + AudioSegment.silent(duration=max_duration - len(segment)) for segment in audio_segments]

    # 겹치는 부분을 적용하여 오디오 세그먼트를 결합
    overlap = min(max_duration, 5000)  # 겹치는 기간 (기본값은 5000ms 또는 5초)
    combined_audio = audio_segments[0]
    for audio_segment in audio_segments[1:]:
        combined_audio = combined_audio.fade_out(overlap).overlay(audio_segment.fade_in(overlap))

    # 사용자가 선택한 형식으로 저장
    combined_audio.export(out_path, format=output_format)
    print(f"Audio saved Successed : {out_path}")

if __name__ == "__main__":
    # 커맨드 라인 인자를 받아오기
    input_paths = sys.argv[1:3]  # 스크립트 호출 시 전달된 파일 입력 경로
    output_path = sys.argv[3]  # 스크립트 호출 시 전달된 출력 경로
    output_format = sys.argv[4] if len(sys.argv) > 4 else "mp3"  # 스크립트 호출 시 전달된 출력 형식

    # 오디오 파일 결합
    overlap_audio_files(input_paths, output_path, output_format)