/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Event } from "../models/Event";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class ScheduleService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Schedule
   * @returns Event Successful Response
   * @throws ApiError
   */
  public getSchedule(): CancelablePromise<Array<Event>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/schedule/",
    });
  }
}
