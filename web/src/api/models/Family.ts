/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Lodging } from "./Lodging";
import type { Person } from "./Person";
import type { Rsvp } from "./Rsvp";

export type Family = {
  id: string;
  name: string;
  total_guests: number;
  members: Array<Person>;
  plus_ones: Array<Rsvp>;
  lodging?: Lodging;
};
