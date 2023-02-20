/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MealOption } from "./MealOption";
import type { Question } from "./Question";

export type Event = {
  id: string;
  name: string;
  note?: string;
  attire?: string;
  starts_at: string;
  ends_at?: string;
  collect_rsvps: boolean;
  meal_options: Array<MealOption>;
  questions: Array<Question>;
};
