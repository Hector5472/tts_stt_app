import speech from '@google-cloud/speech';

const credentials = JSON.parse(
  process.env.GOOGLE_CLOUD_CREDENTIALS
);

const client = new speech.SpeechClient({
  credentials
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { audioBase64, mimeType } = req.body;
  if (!audioBase64) return res.status(400).json({ error: 'audio required' });

  const languageCode = process.env.STT_LANGUAGE || 'es-ES';

  try {
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

    res.json({ transcript });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
