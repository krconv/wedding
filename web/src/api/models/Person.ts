/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Rsvp } from "./Rsvp";

export type Person = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  rsvp?: Rsvp;
  family_id?: string;
};
