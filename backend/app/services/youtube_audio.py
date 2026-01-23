import tempfile
from yt_dlp import YoutubeDL


def download_youtube_audio(url: str) -> str:
    """
    Downloads YouTube audio and returns the local .mp3 file path.
    """

    tmp_dir = tempfile.mkdtemp()
    output_template = f"{tmp_dir}/audio.%(ext)s"

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_template,
        "quiet": True,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192"
            }
        ],
        "user_agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)

    return filename.rsplit(".", 1)[0] + ".mp3"
