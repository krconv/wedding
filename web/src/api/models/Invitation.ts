/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RsvpResponse } from "./RsvpResponse";

export type Invitation = {
  id: string;
  event_id: string;
  meal_choice_id?: string;
  rsvp: RsvpResponse;
};
