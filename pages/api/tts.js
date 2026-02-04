import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });

  const voiceName = process.env.TTS_VOICE || 'es-ES-Standard-A';
  const languageCode = voiceName.split('-').slice(0, 2).join('-');

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    });

    res.status(200).json({
      audioContent: response.audioContent.toString('base64'),
      contentType: 'audio/mpeg'
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
