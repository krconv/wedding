import base64
import concurrent.futures
import json
import logging
import time

import fastapi
import google.auth
import google.auth.transport.requests


def load_secrets(
    *,
    project_name: str,
    env: str,
    secrets_by_setting_name: dict[str, str],
    ignored_settings: set[str],
) -> dict[str, str]:
    credentials, _ = google.auth.default()
    try:
        session = google.auth.transport.requests.AuthorizedSession(
            credentials, default_host="secretmanager.googleapis.com"
        )
    except Exception as e:
        logging.warn(
            "Couldn't load secrets from Google Cloud due to an error: ", str(e)
        )

    env_suffix = f"-{env}"

    def _load_secret(setting: str, secret_name: str) -> tuple[str, str | None]:
        if setting in ignored_settings:
            # already set locally, skip loading from secret manager
            return (setting, None)

        try:
            response_for_env = session.request(
                "GET",
                "https://secretmanager.googleapis.com"
                + f"/v1/projects/{project_name}"
                + f"/secrets/{secret_name}{env_suffix}"
                + "/versions/latest:access",
            )
            response_for_global = session.request(
                "GET",
                "https://secretmanager.googleapis.com"
                + f"/v1/projects/{project_name}"
                + f"/secrets/{secret_name}"
                + "/versions/latest:access",
            )
        except Exception:
            raise Exception("Couldn't load secrets from Google Cloud, are you offline?")

        if response_for_env.status_code == fastapi.status.HTTP_200_OK:
            response = response_for_env
        elif response_for_global.status_code == fastapi.status.HTTP_200_OK:
            response = response_for_global
        else:
            return (setting, None)

        payload = response.json()["payload"]
        encoded_value = base64.b64decode(payload["data"])
        value = encoded_value.decode("utf-8")

        try:
            value = json.loads(value)
        except json.decoder.JSONDecodeError:
            pass

        return (setting, value)

    overrides = {}
    started_at = time.time()
    logging.info("Loading secrets from Google Cloud...")
    with concurrent.futures.ThreadPoolExecutor(
        thread_name_prefix="settings-", max_workers=10
    ) as executor:
        futures = [
            executor.submit(_load_secret, setting, secret_name)
            for setting, secret_name in secrets_by_setting_name.items()
        ]
        for future in concurrent.futures.as_completed(futures):
            setting, value = future.result()
            if value:
                overrides[setting] = value

    ended_at = time.time()
    logging.info(
        f"Loaded {len(overrides)} secrets from Google Cloud in {ended_at - started_at:.2f} seconds"
    )
    return overrides
