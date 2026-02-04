import { useRef, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('Hola desde Google Cloud TTS');
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function synthesize() {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();

    const bytes = Uint8Array.from(
      atob(json.audioContent),
      c => c.charCodeAt(0)
    );

    const blob = new Blob([bytes], { type: json.contentType });
    setAudioUrl(URL.createObjectURL(blob));
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    chunksRef.current = [];
    recorder.ondataavailable = e => chunksRef.current.push(e.data);
    recorder.onstop = sendAudio;

    recorderRef.current = recorder;
    recorder.start();
  }

  async function stopRecording() {
    recorderRef.current?.stop();
  }

  async function sendAudio() {
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(buffer))
    );

    const res = await fetch('/api/stt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64: base64,
        mimeType: 'audio/webm'
      })
    });

    const json = await res.json();
    setTranscript(json.transcript || '');
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Text to Speech</h2>
      <textarea
        rows={4}
        cols={60}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button onClick={synthesize}>Generar audio</button>
      {audioUrl && <audio src={audioUrl} controls />}

      <hr />

      <h2>Speech to Text</h2>
      <button onClick={startRecording}>Grabar</button>
      <button onClick={stopRecording}>Parar</button>

      <pre>{transcript}</pre>
    </div>
  );
}
