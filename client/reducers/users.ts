import { Map, fromJS } from "immutable";
import { fetchUsers } from "+app/actions";
import { FluxStandardAction } from "flux-standard-action";

let items = Map();

let currentUserID;

const bodyContext = JSON.parse(
  document.body.dataset.context || "{}"
);

if (bodyContext.user) {
  const user = fromJS(bodyContext.user);

  items = items.set(
    user.get("id"),
    user
  );

  currentUserID = user.get("id");
}

const initialState = Map({
  items,
  current: currentUserID,
});

export const UsersReducer = (state = initialState, action: FluxStandardAction) => {
  switch (action.type) {
    case fetchUsers.actionTypes.complete: {
      return state.mergeIn(
        [
          "items",
        ],
        (action.payload as any).users
      );
    }

    default: {
      return state;
    }
  }
};
