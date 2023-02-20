/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Answer } from "./Answer";
import type { api__rsvp__schemas___GuestGroupBase__Guest } from "./api__rsvp__schemas___GuestGroupBase__Guest";
import type { Event } from "./Event";

export type GuestGroup = {
  id: string;
  guests: Array<api__rsvp__schemas___GuestGroupBase__Guest>;
  answers: Array<Answer>;
  events: Array<Event>;
};
