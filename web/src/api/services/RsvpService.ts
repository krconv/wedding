/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Family } from "../models/Family";
import type { Person } from "../models/Person";
import type { PersonSearchResult } from "../models/PersonSearchResult";
import type { Rsvp } from "../models/Rsvp";
import type { RsvpCreate } from "../models/RsvpCreate";
import type { RsvpUpdate } from "../models/RsvpUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class RsvpService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Search For Person
   * @returns PersonSearchResult Successful Response
   * @throws ApiError
   */
  public searchForPerson({
    q,
  }: {
    q: string;
  }): CancelablePromise<Array<PersonSearchResult>> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/rsvp/people/search",
      query: {
        q: q,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Person
   * @returns Person Successful Response
   * @throws ApiError
   */
  public getPerson({
    personId,
  }: {
    personId: string;
  }): CancelablePromise<Person> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/rsvp/people/{person_id}",
      path: {
        person_id: personId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Family
   * @returns Family Successful Response
   * @throws ApiError
   */
  public getFamily({
    familyId,
  }: {
    familyId: string;
  }): CancelablePromise<Family> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/rsvp/families/{family_id}",
      path: {
        family_id: familyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Rsvp
   * @returns Rsvp Successful Response
   * @throws ApiError
   */
  public createRsvp({
    requestBody,
  }: {
    requestBody: RsvpCreate;
  }): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/rsvp/rsvps",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Rsvp
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteRsvp({ rsvpId }: { rsvpId: string }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: "DELETE",
      url: "/api/rsvp/rsvps/{rsvp_id}",
      path: {
        rsvp_id: rsvpId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Rsvp
   * @returns Rsvp Successful Response
   * @throws ApiError
   */
  public updateRsvp({
    rsvpId,
    requestBody,
  }: {
    rsvpId: string;
    requestBody: RsvpUpdate;
  }): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "PATCH",
      url: "/api/rsvp/rsvps/{rsvp_id}",
      path: {
        rsvp_id: rsvpId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
