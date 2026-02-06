from io import BytesIO
import io
import os
from urllib.parse import urlparse
from PIL import Image
from azure.storage.blob import BlobServiceClient
from fastapi import UploadFile
import pytesseract
import cv2
from app.core.config import settings
import numpy as np


def preprocess_image_bytes_for_ocr(
    image_bytes: bytes,
    max_width: int = 1600,
) -> bytes:
    """
    Preprocess image bytes for Tesseract OCR.
    Input: raw image bytes
    Output: optimized PNG bytes
    """

    # Load bytes into Pillow
    img = Image.open(io.BytesIO(image_bytes))

    # Convert to grayscale
    img = img.convert("L")

    # Resize (keep aspect ratio)
    if img.width > max_width:
        scale = max_width / img.width
        new_size = (max_width, int(img.height * scale))
        img = img.resize(new_size, Image.LANCZOS)

    # Convert Pillow → OpenCV
    img_np = np.array(img)

    # Light denoising (safe for text)
    img_np = cv2.fastNlMeansDenoising(img_np, h=10)

    # Adaptive threshold (best for uneven lighting)
    img_np = cv2.adaptiveThreshold(
        img_np,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=2,
    )

    # Encode back to PNG bytes
    success, encoded = cv2.imencode(".png", img_np)
    if not success:
        raise RuntimeError("Failed to encode image")

    return encoded.tobytes()


async def extract_text_from_image(image: UploadFile) -> str:
    """
    Convert an uploaded image into raw text using OCR.

    This function:
    1. Read the image bytes
    2. Loads them into PIL
    3. Runs Tesseract OCR
    """

    image_bytes = await image.read()
    processed_bytes = preprocess_image_bytes_for_ocr(image_bytes)
    text = pytesseract.image_to_string(
        Image.open(io.BytesIO(processed_bytes)),
        config="--psm 6")

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
