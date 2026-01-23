from openai import OpenAI
from app.core.config import settings


client = OpenAI(api_key=settings.openai_api_key)


def parse_recipe_from_text(text: str) -> dict:
    """
    Use an LLM to extract a structured recipe from OCR text.
    """

    prompt = f"""
    You are a cooking assistant
    
    Extract a recipe from the text below.

    Return in JSON format with keys:
    - title (string)
    - ingredients (list of strings)
    - steps (list of strings)

    Text:
    {text}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content

    import json
    return json.loads(content)
