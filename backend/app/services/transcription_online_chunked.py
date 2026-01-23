from typing import List
from openai import OpenAI
from app.core.config import settings


client = OpenAI(api_key=settings.openai_api_key)


def transcribe(chunk_paths: List[str]) -> str:
    """
    Transcribes audio in any language and translate it to English
    using OpenAI Whisper (online).
    """
    transcripts = []

    for idx, path in enumerate(chunk_paths):
        with open(path, "rb") as audio_file:
            result = client.audio.transcriptions.create(
                file=audio_file,
                model="gpt-4o-transcribe",
                response_format="text"
            )
            transcripts.append(result)

    return "\n".join(transcripts)
