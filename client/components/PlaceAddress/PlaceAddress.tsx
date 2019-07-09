import * as React from "react";
import { Map } from "immutable";
import { makeStyles } from "@material-ui/core/styles";

export interface IPlaceAddressComponentProps {
  place: Map<string, any>;
  multiline?: boolean;
}

interface IAddressParts {
  zip: string;
  zipplus: string;
  street: string;
  num: string;
  city: string;
  street2: string;
  state: string;
  country: string;
  address1: string;
}

const useStyles = makeStyles({
  root: {
    whiteSpace: "pre",
    fontStyle: "normal",
  },
});

export const PlaceAddress = (
  {
    place,
    multiline = false,
  }: IPlaceAddressComponentProps
) => {
  const {
    address1,
    street2,
    city,
    state,
    country,
    zip,
    zipplus,
  } = place.get("address").toJS();

  const line1 = `${address1}${
    street2 ?
      " " + street2 :
      ""
  }`;

  const zipText = zip ?
    ` ${zip}${
      zipplus ?
        "-" + zipplus :
        ""
    }` :
    "";

  const line2 = `${city}, ${state}${zipText}`;

  const classes = useStyles();

  return (
    <address
      className={classes.root}
    >
      {
        [
          line1,
          line2
        ].join(
          multiline ?
            "\n" :
            " "
        )
      }
    </address>
  )
};
