from azure.storage.blob import BlobServiceClient

from app.core.config import settings

AZURE_CONN_STR = settings.azure_storage_connection_string
CONTAINER_NAME = settings.azure_storage_container

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONN_STR)
container_client = blob_service_client.get_container_client(CONTAINER_NAME)


def ensure_container():
    try:
        container_client.create_container()
    except Exception:
        pass  # already exists
