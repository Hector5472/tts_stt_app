export const runtime = "nodejs";

import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);

const client = new textToSpeech.TextToSpeechClient({
  credentials
});

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    }

    const voice = process.env.TTS_VOICE || 'es-ES-Standard-A';
    const languageCode = voice.split('-').slice(0, 2).join('-');

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: 'MP3' }
    });

    return NextResponse.json({
      audioContent: response.audioContent.toString('base64'),
      contentType: 'audio/mpeg'
    });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
