/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_search_for_guest_group } from "../models/Body_search_for_guest_group";
import type { GuestGroup } from "../models/GuestGroup";
import type { GuestGroupSearchResult } from "../models/GuestGroupSearchResult";
import type { GuestGroupUpdate } from "../models/GuestGroupUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class RsvpService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Search For Guest Group
   * @returns GuestGroupSearchResult Successful Response
   * @throws ApiError
   */
  public searchForGuestGroup({
    requestBody,
  }: {
    requestBody: Body_search_for_guest_group;
  }): CancelablePromise<Array<GuestGroupSearchResult>> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/rsvp/groups/search",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Guest Group
   * @returns GuestGroup Successful Response
   * @throws ApiError
   */
  public getGuestGroup({
    groupUuid,
  }: {
    groupUuid: string;
  }): CancelablePromise<GuestGroup> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/rsvp/group/{group_uuid}",
      path: {
        group_uuid: groupUuid,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Guest Group
   * @returns any Successful Response
   * @throws ApiError
   */
  public updateGuestGroup({
    requestBody,
  }: {
    requestBody: GuestGroupUpdate;
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: "PUT",
      url: "/api/rsvp/group",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
