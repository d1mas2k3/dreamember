from __future__ import annotations
"""
voice_script.recorder
~~~~~~~~~~~~~~~~~~~~

Utility for capturing microphone input as raw PCM bytes.
The function `record_audio` is designed to be the single entry‑point
for recording speech that will later be fed to a speech‑to‑text engine.
"""

import sounddevice as sd


def record_audio(
    duration: int = 10,
    samplerate: int = 16_000,
    channels: int = 1,
    dtype: str = "int16",
) -> tuple[bytes, int]:
    """Record *blocking* audio from the system’s default microphone.

    Parameters
    ----------
    duration : int, optional
        Number of seconds to capture (default: ``10``).
    samplerate : int, optional
        Sampling rate in Hz (default: ``16_000`` — adequate for speech).
    channels : int, optional
        1 = mono, 2 = stereo. Google STT expects mono (default: ``1``).
    dtype : str, optional
        NumPy dtype for the PortAudio buffer. ``"int16"`` is widely
        supported and compatible with SpeechRecognition (default).

    Returns
    -------
    tuple[bytes, int]
        * **bytes** — raw little‑endian PCM data.
        * **int**  — samplerate actually used (same as input argument).
    """
    print(f"🎤 Recording… {duration}s  (sr={samplerate} Hz)")
    frames = sd.rec(
        int(duration * samplerate),
        samplerate=samplerate,
        channels=channels,
        dtype=dtype,
    )
    sd.wait()  # ⏳ blocks until recording completes
    print("✅ Finished recording")

    return frames.tobytes(), samplerate

import wave
from datetime import datetime
import pathlib

def save_wav(raw_bytes: bytes, samplerate: int, out_dir: str = "recordings") -> str:
    """Сохраняет звук в .wav‑файл и возвращает путь."""
    pathlib.Path(out_dir).mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{out_dir}/recording_{timestamp}.wav"

    with wave.open(filename, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)  # 16 бит → 2 байта
        f.setframerate(samplerate)
        f.writeframes(raw_bytes)

    print(f"💾 Saved recording: {filename}")
    return filename


if __name__ == "__main__":
    data, sr = record_audio()
    print(f"Captured {len(data)} bytes @ {sr} Hz")
    save_wav(data, sr)
