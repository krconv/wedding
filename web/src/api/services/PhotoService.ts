/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoAlbum } from "../models/PhotoAlbum";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class PhotoService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Photos
   * @returns PhotoAlbum Successful Response
   * @throws ApiError
   */
  public getPhotos(): CancelablePromise<PhotoAlbum> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/photos/",
    });
  }
}
