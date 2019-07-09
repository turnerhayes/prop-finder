import { Map } from "immutable";
import { FluxStandardAction } from "flux-standard-action";

export const APIReducer = (state = Map(), action: FluxStandardAction) => {
  if (action.meta && "api" in (action.meta as any)) {
    if ((action.meta as any).api.status === "complete") {
      return state.deleteIn(
        [
          "calls",
          (action.meta as any).api.callName,
        ]
      );
    } else {
      return state.setIn(
        [
          "calls",
          (action.meta as any).api.callName,
        ],
        true
      );
    }
  }

  return state;
};
