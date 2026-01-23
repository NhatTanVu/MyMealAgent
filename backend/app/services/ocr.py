from io import BytesIO
from PIL import Image
from fastapi import UploadFile
import pytesseract


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