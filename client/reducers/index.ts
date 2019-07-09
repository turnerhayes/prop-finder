import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router/immutable";

import { history } from "+app/history";

import { UIReducer } from "./ui";
import { APIReducer } from "./api";
import { UsersReducer } from "./users";
import { PlacesReducer } from "./places";

export const reducer = combineReducers({
  ui: UIReducer,
  api: APIReducer,
  users: UsersReducer,
  places: PlacesReducer,
  router: connectRouter(history),
});
