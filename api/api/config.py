import enum
import logging
import typing

import pydantic

from . import utils


class EnvType(str, enum.Enum):
    prod = "prod"
    dev = "dev"


class _Config(pydantic.BaseSettings):
    ENV: EnvType = EnvType.dev
    IS_DEPLOYED: bool = False

    GOOGLE_CLOUD_PROJECT: str

    class Config:
        case_sensitive = True

        @classmethod
        def customise_sources(
            cls,
            init_settings: pydantic.env_settings.SettingsSourceCallable,
            env_settings: pydantic.env_settings.SettingsSourceCallable,
            file_secret_settings: pydantic.env_settings.SettingsSourceCallable,
        ):
            return env_settings, _google_cloud_secrets_source, init_settings


class _GoogleCloudSettings(pydantic.BaseSettings):
    ENV: EnvType
    GOOGLE_CLOUD_PROJECT: str | None = None

    SECRETS: dict[str, str] = {}


def _google_cloud_secrets_source(
    _settings: pydantic.BaseSettings,
) -> dict[str, typing.Any]:
    google_cloud_settings = _GoogleCloudSettings()
    if google_cloud_settings.GOOGLE_CLOUD_PROJECT is None:
        logging.warning(
            "Can't load Google Cloud secrets because 'GOOGLE_CLOUD_PROJECT' is not set"
        )
        return {}

    env_settings = pydantic.env_settings.EnvSettingsSource(
        env_file=None, env_file_encoding=None, env_nested_delimiter=None
    )(_settings)
    ignored_settings = set([setting for setting in env_settings.keys()])

    overrides = utils.google_secrets.load_secrets(
        project_name=google_cloud_settings.GOOGLE_CLOUD_PROJECT,
        env=google_cloud_settings.ENV,
        secrets_by_setting_name=google_cloud_settings.SECRETS,
        ignored_settings=ignored_settings,
    )

    return overrides


class _ConfigProxy:
    _config: _Config | None = None

    def init(self):
        if self._config is None:
            self._config = _Config()

    def __getattr__(self, name):
        assert self._config is not None, "Config not initialized"
        return getattr(self._config, name)


config: _Config = _ConfigProxy()  # type: ignore


def init():
    config.init()  # type: ignore
