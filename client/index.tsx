import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router/immutable";
import { StoreContext } from "redux-react-hook";

import { history } from "+app/history";
import { store } from "+app/store/configure-store";
import { App } from "+app/components/App";

import "./site.css";

const run = () => {
  render(
    (
      <StoreContext.Provider
        value={store}
      >
        <Provider
          store={store}
        >
          <ConnectedRouter
            history={history}
          >
            <App />
          </ConnectedRouter>
        </Provider>
      </StoreContext.Provider>
    ),
    document.getElementById("app")
  );
};

// eslint-disable-next-line no-undef
if (!global.Intl) {
  // eslint-disable-next-line no-undef
(require as any).ensure([
    "intl",
    "intl/locale-data/jsonp/en.js",
  ], (require: any) => {
    require("intl");
    require("intl/locale-data/jsonp/en.js");
    run();
  });
} else {
  run();
}
