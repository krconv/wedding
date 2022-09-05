/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Registry } from "../models/Registry";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class RegistryService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Registry
   * @returns Registry Successful Response
   * @throws ApiError
   */
  public getRegistry(): CancelablePromise<Registry> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/registry/",
    });
  }
}
