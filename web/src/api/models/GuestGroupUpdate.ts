/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Answer } from "./Answer";
import type { api__rsvp__schemas___GuestGroupBase__Guest } from "./api__rsvp__schemas___GuestGroupBase__Guest";

export type GuestGroupUpdate = {
  id: string;
  guests: Array<api__rsvp__schemas___GuestGroupBase__Guest>;
  answers: Array<Answer>;
};
