import textToSpeech from '@google-cloud/text-to-speech';

const credentials = JSON.parse(
  process.env.GOOGLE_CLOUD_CREDENTIALS
);

const client = new textToSpeech.TextToSpeechClient({
  credentials
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  const voice = process.env.TTS_VOICE || 'es-ES-Standard-A';
  const languageCode = voice.split('-').slice(0, 2).join('-');

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: 'MP3' }
    });

    res.json({
      audioContent: response.audioContent.toString('base64'),
      contentType: 'audio/mpeg'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
