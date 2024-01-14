import os
import requests
import base64
from pydub import AudioSegment
from moviepy.editor import VideoFileClip


# Mp4 -> Mp3 -> Mono -> Raw -> Base64

def convert_and_clip_mp4_to_mp3(input_file, output_file, clip_start_time=0, clip_end_time=5):
    video_clip = VideoFileClip(input_file)

    audio_clip = video_clip.audio

    clipped_audio = audio_clip.subclip(clip_start_time, clip_end_time)

    clipped_audio.write_audiofile(output_file, codec='mp3')

    audio_clip.close()
    clipped_audio.close()


def convert_to_mono(input_file, output_file):
    # Load the MP3 file
    sound = AudioSegment.from_mp3(input_file)

    # Convert to mono
    sound_mono = sound.set_channels(1)

    # Export the result to a new file
    sound_mono.export(output_file, format="mp3")


def convert_to_raw(input_file):
    # Load the mono MP3 file
    sound_mono = AudioSegment.from_mp3(input_file)

    # Get raw PCM audio data
    raw_audio_data = sound_mono.raw_data

    return raw_audio_data


def raw_audio_to_base64(raw_audio_data):
    # Encode raw audio data to Base64
    base64_audio = base64.b64encode(raw_audio_data).decode('utf-8')
    return base64_audio


def extract_audio_from_video():
    url = "https://shazam.p.rapidapi.com/songs/v2/detect"

    querystring = {"timezone": "America/Chicago", "locale": "en-US"}

    convert_and_clip_mp4_to_mp3("src/FeedsClustering/test.mp4", "test.mp3")
    convert_to_mono("src/FeedsClustering/test.mp3", "mono.mp3")
    raw = convert_to_raw("src/FeedsClustering/mono.mp3")

    payload = raw_audio_to_base64(raw)

    headers = {
        "content-type": "text/plain",
        "X-RapidAPI-Key": "5c1905271fmshb9ec2369d3ca3f0p18cfc9jsn4803f1c2cc6f",
        "X-RapidAPI-Host": "shazam.p.rapidapi.com"
    }

    response = requests.post(url, data=payload, headers=headers, params=querystring)

    print(response.status_code)
    print(response.json())

    return response.json()


if __name__ == "__main__":
    extract_audio_from_video()
