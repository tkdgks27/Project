import sys
from pydub import AudioSegment

def overlap_audio_files(in_paths, out_path, format):
    if not in_paths:
        print("No files selected. Exiting.")
        return

    # 오디오 파일들을 불러옵니다.
    audio_segments = [AudioSegment.from_file(file) for file in in_paths]

    # 모든 오디오 세그먼트가 제일 긴 오디오 파일의 길이에 맞도록 조정합니다.
    max_duration = max(len(segment) for segment in audio_segments)
    audio_segments = [segment + AudioSegment.silent(duration=max_duration - len(segment)) for segment in audio_segments]

    # 겹치는 부분을 적용하여 오디오 세그먼트를 결합합니다.
    overlap = min(max_duration, 5000)  # 겹치는 기간 (기본값은 5000ms 또는 5초)
    combined_audio = audio_segments[0]
    for audio_segment in audio_segments[1:]:
        combined_audio = combined_audio.fade_out(overlap).overlay(audio_segment.fade_in(overlap))

    # 파일을 저장합니다.
    combined_audio.export(output_name, format=output_directory)
    print(f"Combined audio saved to: {output_name}")

if __name__ == "__main__":
    # 파일 선택 및 저장 경로 지정
    input_paths = sys.argv[1:-2]  # 첫 번째 인자부터 뒤에서 세 번째 인자까지 파일 경로로 설정
    output_name = sys.argv[-2]  # 뒤에서 두 번째 인자를 저장할 파일 이름으로 설정
    output_directory = sys.argv[-1]  # 마지막 인자를 저장할 디렉토리로 설정

    # 합성된 오디오 파일 생성
    overlap_audio_files(input_paths, output_name, output_directory)