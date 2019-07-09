import * as React from "react";
import { useMappedState, useDispatch } from "redux-react-hook";
import { Link } from "react-router-dom";
import { Map, List as ImmutableList, Range } from "immutable";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";

import { getPlaces } from "+app/actions";
import { PlaceAddress } from "../PlaceAddress";
import { PlaceRating } from "../PlaceRating";


const enum FetchStatus {
  UNFETCHED = "UNFETCHED",
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
};

const getListItemComponent = (place: Map<string, any>) => React.forwardRef(
  function PlaceListItem(props, ref: React.Ref<any>) {
    console.log({
      props,
    });
    
    return (
      <Link
        ref={ref}
        {...props}
        to={`/places/${place.get("id")}`}
      />
    );
  }
);

export const PlaceSummaryList = () => {
  const [fetchStatus, setFetchStatus] = React.useState(FetchStatus.UNFETCHED);

  const dispatch = useDispatch();

  const mapStateToProps = React.useCallback(
    (state) => ({
      places: state.places.get("items").toList(),
    }),
    []
  );

  const { places } = useMappedState(mapStateToProps);

  if (fetchStatus === FetchStatus.UNFETCHED) {
    Promise.resolve(dispatch(getPlaces())).then(
      () => setFetchStatus(FetchStatus.FETCHED)
    );

    setFetchStatus(FetchStatus.FETCHING);

    return null;
  }

  return (
    <List>
      {
        places.map(
          (place: Map<string, any>) => {
            const amenities = place.get("amenities") || ImmutableList();

            return (
              <ListItem
                key={place.get("id")}
                button
                component={getListItemComponent(place) as any}
              >
                <ListItemText
                  primary={
                    <PlaceAddress
                      place={place}
                    />
                  }
                  secondary={
                    amenities.isEmpty() ?
                      null :
                      amenities.join(", ")
                  }
                />
                <ListItemSecondaryAction>
                  <PlaceRating
                    place={place}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          }
        ).toArray()
      }
    </List>
  );
};
