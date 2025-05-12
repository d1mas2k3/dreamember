from __future__ import annotations
"""
voice_script.main
~~~~~~~~~~~~~~~~~

Точка входа для модуля voice_script.
Записывает аудио, распознаёт речь и выводит результат.
"""

import os
from dotenv import load_dotenv
from rich import print
from voice_script.recorder import record_audio
from voice_script.stt import transcribe

# Загружаем настройки из .env (STT_LANG, MAX_RECORD_S и т.д.)
load_dotenv()

def main() -> None:
    """
    Запускает полный цикл:
    1) Запись аудио
    2) Распознавание речи
    3) Вывод результата в консоль
    """
    # Шаг 1. Записываем звук
    raw_bytes, sample_rate = record_audio()

    # Шаг 2. Распознаём речь
    text = transcribe(raw_bytes, sample_rate)

    # Шаг 3. Выводим результат
    if text:
        print("\n📝 [bold green]Распознанный сон:[/]\n" + text)
    else:
        print("😞 [red]Речь не распознана.[/]")


if __name__ == "__main__":
    main()