from openai import OpenAI
from app.core.config import settings


client = OpenAI(api_key=settings.openai_api_key)


def transcribe(audio_path: str) -> str:
    """
    Transcribes audio in any language and translate it to English
    using OpenAI Whisper (online).
    """
    with open(audio_path, "rb") as audio_file:
        result = client.audio.transcriptions.create(
            file=audio_file,
            model="gpt-4o-transcribe",
            response_format="text"
        )
    
    return result
