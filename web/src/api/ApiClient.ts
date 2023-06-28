/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "./core/BaseHttpRequest";
import type { OpenAPIConfig } from "./core/OpenAPI";
import { AxiosHttpRequest } from "./core/AxiosHttpRequest";

import { FaqService } from "./services/FaqService";
import { PhotoService } from "./services/PhotoService";
import { RegistryService } from "./services/RegistryService";
import { RsvpService } from "./services/RsvpService";
import { ScheduleService } from "./services/ScheduleService";

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ApiClient {
  public readonly faq: FaqService;
  public readonly photo: PhotoService;
  public readonly registry: RegistryService;
  public readonly rsvp: RsvpService;
  public readonly schedule: ScheduleService;

  public readonly request: BaseHttpRequest;

  constructor(
    config?: Partial<OpenAPIConfig>,
    HttpRequest: HttpRequestConstructor = AxiosHttpRequest
  ) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? "",
      VERSION: config?.VERSION ?? "0.1.0",
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? "include",
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.faq = new FaqService(this.request);
    this.photo = new PhotoService(this.request);
    this.registry = new RegistryService(this.request);
    this.rsvp = new RsvpService(this.request);
    this.schedule = new ScheduleService(this.request);
  }
}
