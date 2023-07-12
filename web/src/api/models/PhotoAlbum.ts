/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DropeventPhoto } from "./DropeventPhoto";
import type { PictimePhoto } from "./PictimePhoto";

export type PhotoAlbum = {
  community_album_link: string;
  community_upload_link?: string;
  community_photos: Array<DropeventPhoto>;
  photographer_album_link: string;
  photographer_photos: Array<PictimePhoto>;
};
