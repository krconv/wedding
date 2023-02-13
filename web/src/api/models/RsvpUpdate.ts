/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FoodChoice } from "./FoodChoice";

export type RsvpUpdate = {
  is_attending?: boolean;
  food_choice?: FoodChoice;
  song_suggestions?: string;
  notes?: string;
};
