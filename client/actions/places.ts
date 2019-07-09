import { createAPIAction } from "./utils";
import * as api from "../api";

export const getPlaces = createAPIAction(
  "getPlaces",
  () => api.getPlaces()
);

export const getPlace = createAPIAction(
  "getPlace",
  ({ placeID }) => api.getPlace({ placeID })
);

export const setRating = createAPIAction(
  "setRating",
  ({ placeID, rating }) => api.setRating({ placeID, rating })
);
