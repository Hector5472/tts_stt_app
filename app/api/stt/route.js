export const runtime = "nodejs";

import speech from '@google-cloud/speech';
import { NextResponse } from 'next/server';

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);

const client = new speech.SpeechClient({
  credentials
});

export async function POST(req) {
  try {
    const { audioBase64, mimeType } = await req.json();
    if (!audioBase64) {
      return NextResponse.json({ error: 'audio required' }, { status: 400 });
    }

    const languageCode = process.env.STT_LANGUAGE || 'es-ES';

    const [response] = await client.recognize({
      audio: { content: audioBase64 },
      config: {
        encoding: mimeType?.includes('webm') ? 'WEBM_OPUS' : 'ENCODING_UNSPECIFIED',
        sampleRateHertz: 48000,
        languageCode,
        enableAutomaticPunctuation: true
      }
    });

    const transcript = response.results
      .map(r => r.alternatives[0].transcript)
      .join('\n');

    return NextResponse.json({ transcript });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
