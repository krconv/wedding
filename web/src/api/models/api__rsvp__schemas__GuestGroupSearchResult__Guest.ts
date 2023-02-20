/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Role } from "./Role";

export type api__rsvp__schemas__GuestGroupSearchResult__Guest = {
  first_name?: string;
  last_name?: string;
  role: Role;
  uuid: string;
  searched_for: boolean;
};
