import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Grid, withStyles } from "@material-ui/core";
// import { MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Home } from "+app/components/Home";
import { TopNav } from "+app/components/TopNav";
import { NotFoundPage } from "+app/components/NotFoundPage";
import { PlaceDetail } from "+app/components/PlaceDetail";

export interface IAppComponentProps {
  classes: Record<"root" | "mainContent", string>;
}

const styles = {
  root: {
    width: "100%",
    height: "100%",
  },

  mainContent: {
    flex: 1,
    overflow: "hidden",
  },
};

// Do not use PureComponent; messes with react-router
/**
 * Main App component.
 */
class App extends React.PureComponent<IAppComponentProps> {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      mainContent: PropTypes.string.isRequired,
    }).isRequired,
  }

  /**
   * Renders the component.
   *
   * @return {React.ReactElement}
   */
  render() {
    return (
      <Grid container
        direction="column"
        wrap="nowrap"
        className={this.props.classes.root}
      >
        {/* <MuiPickersUtilsProvider
          utils={DateFnsUtils}
        > */}
          <CssBaseline />
          <Grid item>
            <TopNav />
          </Grid>
          <Grid item container
            direction="column"
            wrap="nowrap"
            className={this.props.classes.mainContent}
          >
            <Switch>
              <Route
                exact path="/"
                component={Home}
              />
              <Route
                exact path="/places/:placeID"
                render={({ match }) => (
                  <PlaceDetail
                    placeID={Number(match.params["placeID"])}
                  />
                )}
              />
              <Route
                component={NotFoundPage}
              />
            </Switch>
          </Grid>
        {/* </MuiPickersUtilsProvider> */}
      </Grid>
    );
  }
}

const StyledApp = withStyles(styles)(App);

export { StyledApp as App };
