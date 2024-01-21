import * as fs from 'fs';
import axios from 'axios';
import * as base64 from 'base-64';
import { FfmpegCommand } from 'fluent-ffmpeg';
import * as prism from 'prism-media';

// Mp4 -> Mp3 -> Mono -> Raw -> Base64

async function convertAndClipMp4ToMp3(inputFile: string, outputFile: string, clipStartTime = 0, clipEndTime = 5) {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = new FfmpegCommand();

    ffmpeg
      .input(inputFile)
      .audioCodec('libmp3lame')
      .seekInput(clipStartTime)
      .duration(clipEndTime - clipStartTime);

    ffmpeg.on('end', () => {
      resolve();
    });

    ffmpeg.on('error', err => {
      reject(err);
    });

    ffmpeg.save(outputFile);
  });
}

async function convertToMono(inputFile: string, outputFile: string) {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = new FfmpegCommand();

    ffmpeg.input(inputFile).audioChannels(1);

    ffmpeg.on('end', () => {
      resolve();
    });

    ffmpeg.on('error', err => {
      reject(err);
    });

    ffmpeg.save(outputFile);
  });
}

async function convertToRaw(inputFile: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const transcoder = new prism.FFmpeg({
      args: ['-i', inputFile, '-f', 's16le', '-acodec', 'pcm_s16le', '-ar', '48000'],
    });

    const chunks: Buffer[] = [];

    transcoder.on('data', chunk => {
      chunks.push(chunk as Buffer);
    });

    transcoder.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    transcoder.on('error', err => {
      reject(err);
    });
  });
}

function rawAudioToBase64(rawAudioData: Buffer): string {
  // Encode raw audio data to Base64
  return base64.encode(rawAudioData);
}

async function extractAudioFromVideo() {
  const url = 'https://shazam.p.rapidapi.com/songs/v2/detect';
  const querystring = { timezone: 'America/Chicago', locale: 'en-US' };

  await convertAndClipMp4ToMp3('test.mp4', 'test.mp3');
  await convertToMono('test.mp3', 'mono.mp3');
  const raw = await convertToRaw('mono.mp3');

  const payload = rawAudioToBase64(raw);

  console.log(payload);

  const headers = {
    'content-type': 'text/plain',
    'X-RapidAPI-Key': '5c1905271fmshb9ec2369d3ca3f0p18cfc9jsn4803f1c2cc6f',
    'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
  };

  try {
    const response = await axios.post(url, payload, { headers, params: querystring });

    console.log(response.status);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

export default extractAudioFromVideo;
