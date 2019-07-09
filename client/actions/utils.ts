import { FluxStandardAction } from "flux-standard-action";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Dispatch } from "react";

const FETCH_START = "FETCH_START";

const FETCH_FAIL = "FETCH_FAIL";

const FETCH_COMPLETE = "FETCH_COMPLETE";


export type ActionCreator = (...args: any[]) => ThunkAction<any, any, any, any>;

export type APIAction = ActionCreator & {
  actionTypes: {
    start: string,
    fail: string,
    complete: string,
  },
};

/**
 * Returns an action creator function
 *
 * @param {string} callName a string identifying the call
 * @param {function} executeAPICall the function to call on the API
 *
 * @return {APIAction} an action creator function
 */
export function createAPIAction(
  callName: string,
  executeAPICall: (...args: any[]) => any,
): APIAction {
  if (!callName) {
    throw new Error("`actionName` is required");
  }

  const actionTypes = Object.freeze({
    start: `${FETCH_START}/${callName}`,
    fail: `${FETCH_FAIL}/${callName}`,
    complete: `${FETCH_COMPLETE}/${callName}`,
  });

  const actionCreator: any = function(...args: any[]) {
    return async (dispatch: ThunkDispatch<any, any, any>, getState: () => {}) => {
      try {
        dispatch({
          type: actionTypes.start,
          payload: args,
          meta: {
            api: {
              callName,
              status: "started",
            },
          },
        });

        let result = await executeAPICall(
          ...args
        );

        if (typeof result === "function") {
          result = await result(dispatch, getState);
        }

        dispatch({
          type: actionTypes.complete,
          payload: result,
          meta: {
            api: {
              callName: callName,
              status: "complete",
            },
          },
        });

        return result;
      } catch (ex) {
        dispatch({
          type: actionTypes.fail,
          payload: args,
          meta: {
            api: {
              callName: callName,
              status: "complete",
            },
          },
          error: ex,
        });

        throw ex;
      }
    };
  };

  Object.defineProperty(
    actionCreator,
    "name",
    {
      value: callName,
    }
  );

  Object.defineProperty(
    actionCreator,
    "actionTypes",
    {
      value: actionTypes,
    }
  );

  return actionCreator;
}
