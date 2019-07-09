import { createStore, applyMiddleware, compose, StoreEnhancer, Middleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router/immutable";

import { reducer } from "+app/reducers";
import { history } from "+app/history";
import { FluxStandardAction } from "flux-standard-action";

const composeEnhancers: (...enhancers: Array<StoreEnhancer>) => any =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares: Middleware[] = [
  thunk,
  routerMiddleware(history),
];

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "development") {
  const errorMiddleware = () => (
    next: (action: FluxStandardAction) => FluxStandardAction
  ) => (
    action: FluxStandardAction
  ) => {
    if (action.error) {
      // eslint-disable-next-line no-console
      console.error(action.error);
    }

    next(action);
  };

  middlewares.push(errorMiddleware);
}

const storeEnhancer = composeEnhancers(
  applyMiddleware(...middlewares)
);

export const store = createStore(
  reducer,
  storeEnhancer
);
