import React from "react";
import { Grid } from "@material-ui/core";

import { PlaceSummaryList } from "+app/components/PlaceSummaryList";

/**
 * Home component
 *
 * @return {React.ReactElement}
 */
export function Home() {
  return (
    <Grid container
      direction="column"
    >
      <Grid item>
        <PlaceSummaryList
        />
      </Grid>
    </Grid>
  );
}
