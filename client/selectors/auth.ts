import { createSelector } from "reselect";
import Immutable from "immutable";

export const currentUser = (
  state: {
    users: Immutable.Map<string, any>
  }
) => {
  const currentUserID = state.users
    .get("current");

  if (currentUserID === undefined) {
    return null;
  }

  return state.users.getIn(
    [
      "items",
      currentUserID,
    ],
    null
  );
};

export const isLoggedIn = createSelector(
  [
    currentUser,
  ],
  (currentUser) => currentUser !== null
);
