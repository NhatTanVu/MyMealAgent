import time
from jwt import PyJWKClient
import jwt


def verify_app_identity_token(identity_token: str, expected_aud: str) -> dict:
    jwks_url = "https://appleid.apple.com/auth/keys"
    jwk_client = PyJWKClient(jwks_url)
    signing_key = jwk_client.get_signing_key_from_jwt(identity_token)

    payload = jwt.decode(
        identity_token,
        signing_key.key,
        algorithms=["RS256"],
        audience=expected_aud,
        issuer="https://appleid.apple.com"
    )

    if payload.get("exp") and payload["exp"] < int(time.time()):
        raise jwt.ExpiredSignatureError("Apple identity token expired")

    return payload
