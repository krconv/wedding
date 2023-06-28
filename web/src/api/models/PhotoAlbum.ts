/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Photo } from "./Photo";

export type PhotoAlbum = {
  album_link?: string;
  upload_link?: string;
  photos: Array<Photo>;
};
