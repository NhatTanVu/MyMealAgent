import whisper

model = whisper.load_model("small")

def transcribe_and_translate(audio_path: str) -> str:
    """
    Transcribes audio from any language and translates to English.
    Runs fully offline.
    """

    result = model.transcribe(
        audio_path,
        task="translate",
        fp16=False)

    return result["text"]