from io import BytesIO
import os
from urllib.parse import urlparse
from PIL import Image
from azure.storage.blob import BlobClient, BlobServiceClient
from fastapi import UploadFile, requests
import pytesseract

from app.core.config import settings


async def extract_text_from_image(image: UploadFile) -> str:
    """
    Convert an uploaded image into raw text using OCR.

    This function:
    1. Read the image bytes
    2. Loads them into PIL
    3. Runs Tesseract OCR
    """

    image_bytes = await image.read()
    pil_image = Image.open(BytesIO(image_bytes))
    text = pytesseract.image_to_string(pil_image)

    return text


def parse_blob_url(blob_url: str) -> tuple[str, str]:
    """
    Returns (container_name, blob_name) from an Azure Blob URL.
    """
    parsed = urlparse(blob_url)

    # Remove leading slash and split path
    path = parsed.path.lstrip("/")   # imports/audio/imp_123.mp3
    parts = path.split("/", 1)

    if len(parts) != 2:
        raise ValueError(f"Invalid blob URL: {blob_url}")

    container, blob_name = parts
    return container, blob_name


def download_blob_to_bytes(blob_url: str) -> bytes:
    container, blob_name = parse_blob_url(blob_url)

    service = BlobServiceClient.from_connection_string(
        settings.azure_storage_connection_string
    )

    blob = service.get_blob_client(
        container=container,
        blob=blob_name
    )

    return blob.download_blob().readall()


def extract_text_from_blob(url: str) -> str:
    image_bytes = download_blob_to_bytes(url)
    pil_image = Image.open(BytesIO(image_bytes))
    text = pytesseract.image_to_string(pil_image)

    return text
