from openai import OpenAI
from app.core.config import settings


client = OpenAI(api_key=settings.openai_api_key)


def parse_recipe_from_text(text: str) -> dict:
    """
    Use an LLM to extract a structured recipe from OCR text.
    """

    prompt = f"""
    You are a cooking assistant
    
    Extract a recipe from the text below and normalize it into structured data.

    Rules:
    - Return VALID JSON only (no markdown, no explanations).
    - Do not invent data.
    - Each ingredient must include:
      - raw: the original ingredient text exactly as written
      - name: ingredient name only, lowercase, no descriptors
      - amount: number, convert fractions to decimals, or null
      - unit: singular form (cup, tbsp, g, ml), or null
    - Remove preparation notes from `name` (e.g. "room temperature", "chopped").
    - Steps should be clear, concise strings.

    Return JSON with this exact schema:
    {{
        "title": string,
        "ingredients": [
            {{
                "raw": string,
                "name": string,
                "amount": number | null,
                "unit": string | null
            }}
        ],
        "steps": [string]
    }}

    Text:
    {text}
    """

    response = client.chat.completions.create(
        model="gpt-5.1",
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content

    import json
    return json.loads(content)
