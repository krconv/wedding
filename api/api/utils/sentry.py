import logging
import os

import sentry_sdk


def init():
    if os.environ.get("IS_DEPLOYED", "false") == "true":
        logging.info("Initializing Sentry...")
        sentry_sdk.init(
            "https://25e54bfbb12348c39102a72199f10de4@o4504710244139008.ingest.sentry.io/4504710247874560",
            traces_sample_rate=1.0,
            _experiments={
                "profiles_sample_rate": 1.0,
            },
        )
    else:
        logging.warn("Disabling Sentry because app is not deployed")
