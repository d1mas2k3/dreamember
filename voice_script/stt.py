from __future__ import annotations
"""
voice_script.stt
~~~~~~~~~~~~~~~~

Speech-to-text module.
Uses `speech_recognition` with Google Speech API by default.
"""

import os
import speech_recognition as sr

STT_LANG = os.getenv("STT_LANG", "ru-RU")
recognizer = sr.Recognizer()


def transcribe(raw_bytes: bytes, sample_rate: int, lang: str = STT_LANG) -> str | None:
    """Преобразует raw PCM‑звук в текст с помощью Google STT API.

    Parameters
    ----------
    raw_bytes : bytes
        Массив звуковых данных (16‑битный PCM, little‑endian).
    sample_rate : int
        Частота дискретизации (должна совпадать с записью, напр. 16000).
    lang : str
        Язык для распознавания (по умолчанию ru‑RU).

    Returns
    -------
    str | None
        Текст, если удалось распознать. Иначе None.
    """
    audio = sr.AudioData(raw_bytes, sample_rate, sample_width=2)  # 16‑bit = 2 bytes
    try:
        return recognizer.recognize_google(audio, language=lang)
    except sr.UnknownValueError:
        print("Не удалось распознать речь.")
    except sr.RequestError as e:
        print(f" Ошибка при подключении к Google STT: {e}")
    return None


if __name__ == "__main__":
    # Тест: заглушка для прямого запуска (можно позже использовать с сохранённым .wav)
    print("Этот модуль не предназначен для отдельного запуска.")
