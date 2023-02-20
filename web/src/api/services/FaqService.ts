/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Faq } from "../models/Faq";
import type { UpdateMessage } from "../models/UpdateMessage";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class FaqService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Faqs
   * @returns Faq Successful Response
   * @throws ApiError
   */
  public getFaqs(): CancelablePromise<Array<Faq>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/faqs",
    });
  }

  /**
   * Get Update Message
   * @returns UpdateMessage Successful Response
   * @throws ApiError
   */
  public getUpdateMessage(): CancelablePromise<UpdateMessage> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/update-message",
    });
  }
}
