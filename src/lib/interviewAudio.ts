export function pcm16ToWav(chunks: Uint8Array[]): Blob {
  const byteLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const label = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  label(0, 'RIFF');
  view.setUint32(4, 36 + byteLength, true);
  label(8, 'WAVE');
  label(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true);
  view.setUint32(28, 48000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, 'data');
  view.setUint32(40, byteLength, true);
  const data = new ArrayBuffer(byteLength);
  const bytes = new Uint8Array(data);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Blob([header, data], { type: 'audio/wav' });
}
