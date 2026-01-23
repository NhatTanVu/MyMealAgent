
import os
import subprocess
import tempfile
from typing import List


def chunk_audio(
    audio_path: str,
    chunk_duration: int = 180,
) -> List[str]:
    """
    Split an audio file into smaller chunks using FFmpeg.

    Returns a list of chunk file paths.
    """

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    output_dir = tempfile.mkdtemp()
    output_pattern = os.path.join(output_dir, "chunk_%03d.mp3")

    command = [
        "ffmpeg",
        "-i", audio_path,
        "-f", "segment",
        "-segment_time", str(chunk_duration),
        "-c", "copy",
        output_pattern,
        "-y",
    ]

    subprocess.run(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=True,
    )

    chunks = [
        os.path.join(output_dir, f)
        for f in os.listdir(output_dir)
        if f.endswith(".mp3")
    ]

    if not chunks:
        raise RuntimeError("Audio chunking failed: no chunks created")

    return chunks