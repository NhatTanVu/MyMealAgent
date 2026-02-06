import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "mymealagent",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.update(
    task_track_started=True,
    result_expires=3600,
    broker_transport_options={
        "global_keyprefix": "{celery}",
    },
    redis_backend_transport_options={
        "global_keyprefix": "{celery}",
    },
)

# 👇 FORCE task discovery
# celery_app.autodiscover_tasks(["app.tasks"])
import app.tasks.import_media