import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { withRouter, RouteComponentProps } from "react-router";
import { useMappedState } from "redux-react-hook";
import classnames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import { Link } from "react-router-dom";

import { AccountDropDown } from "+app/components/AccountDropDown";
import { isLoggedIn as isLoggedInSelector } from "+app/selectors/auth";

interface IAccountDropDownTriggerComponentProps {
  className?: string;
}

const AccountDropDownTrigger = (
  { className }: IAccountDropDownTriggerComponentProps
) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const handleClick = useCallback(
    ({ currentTarget }) => {
      setAnchorEl(currentTarget);
      setIsPopperOpen(true);
    },
    []
  );

  const handleClickAway = useCallback(
    () => setIsPopperOpen(false),
    []
  );

  return (
    <IconButton
      color="inherit"
      onClick={handleClick}
      className={className}
    >
      <PersonIcon />
      <Popper
        anchorEl={anchorEl}
        open={isPopperOpen}
      >
        <ClickAwayListener
          onClickAway={handleClickAway}
        >
          <AccountDropDown />
        </ClickAwayListener>
      </Popper>
    </IconButton>
  );
};

AccountDropDownTrigger.propTypes = {
  className: PropTypes.string,
};

const styles = (theme: Theme) => ({
  rightAligned: {
    marginLeft: "auto",
  },

  autoWidth: {
    width: "auto",
  },

  pageLinks: {
    marginLeft: theme.spacing(2),
  },
});

// export interface ITopNavComponentProps extends RouteComponentProps<any, StaticContext, any> {
export interface ITopNavComponentProps extends RouteComponentProps<any> {
  classes: {
    rightAligned?: string;
    autoWidth?: string;
    pageLinks?: string;
  },
}

/**
 * Top application bar component
 *
 * @param {ITopNavComponentProps} props
 * @param {object} props.classes class names for the component
 *
 * @return {React.ReactElement}
 */
function TopNav({ classes, location }: ITopNavComponentProps) {
  const pageLinks: Array<
    {
      path: string,
      text: string,
    }
  > = [];

  const mapState = useCallback(
    (state) => ({
      isLoggedIn: isLoggedInSelector(state),
    }),
    []
  );

  const {
    isLoggedIn,
  } = useMappedState(mapState);

  return (
    <AppBar
      position="static"
    >
      <Toolbar>
        <IconButton
          component={Link}
          to="/"
          color="inherit"
        >
          <HomeIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
        >
          Apts
        </Typography>
        <Grid container
          wrap="nowrap"
          className={classes.pageLinks}
        >
          {
            pageLinks.map(
              ({ path, text }) => (
                <Grid item
                  key={path}
                >
                  <Button
                    component={Link}
                    color="inherit"
                    to={path}
                    disabled={
                      location.pathname === path
                    }
                  >
                    {text}
                  </Button>
                </Grid>
              )
            )
          }
        </Grid>
        <Grid container
          wrap="nowrap"
          className={classnames(
            classes.rightAligned,
            classes.autoWidth
          )}
        >
          <Grid item>
            {
              isLoggedIn && (
                <AccountDropDownTrigger
                />
              )
            }
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

TopNav.propTypes = {
  classes: PropTypes.shape({
    pageLinks: PropTypes.string.isRequired,
  }).isRequired,
};

const WithRouterTopNav = withRouter<ITopNavComponentProps, React.FunctionComponent<ITopNavComponentProps>>(TopNav);

const StyledTopNav = withStyles(styles)(WithRouterTopNav);

export { StyledTopNav as TopNav };
