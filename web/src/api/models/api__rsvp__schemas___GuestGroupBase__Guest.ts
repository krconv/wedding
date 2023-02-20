/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Invitation } from "./Invitation";
import type { Role } from "./Role";
import type { RsvpResponse } from "./RsvpResponse";

export type api__rsvp__schemas___GuestGroupBase__Guest = {
  first_name?: string;
  last_name?: string;
  role: Role;
  id: string;
  rsvp: RsvpResponse;
  invitations: Array<Invitation>;
};
