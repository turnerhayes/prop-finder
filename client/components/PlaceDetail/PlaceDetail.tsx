import * as React from "react";
import { Map } from "immutable";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useMappedState, useDispatch } from "redux-react-hook";

import { getPlace, setRating } from "+app/actions";
import { PlaceMap } from "+app/components/PlaceMap";
import { PlaceAddress } from "+app/components/PlaceAddress";
import { PlaceRating, RatingComponentSizes } from "+app/components/PlaceRating";

const enum FetchState {
  UNFETCHED = "UNFETCHED",
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
}

export interface IPlaceDetailComponentProps {
  placeID: number;
}

export const PlaceDetail = ({ placeID }: IPlaceDetailComponentProps) => {
  const mapStateToProps = React.useCallback(
    (state) => ({
      place: state.places.getIn(["items", placeID]),
    }),
    []
  );

  const { place } = useMappedState(mapStateToProps);

  const [fetchState, setFetchState] = React.useState(FetchState.UNFETCHED);

  const [mapDialogAnchorEl, setMapDialogAnchorEl] = React.useState<HTMLElement|null>(null);

  const handleShowMapButtonClick = React.useCallback(
    (
      event
    ) => setMapDialogAnchorEl(event.target),
    [
      setMapDialogAnchorEl,
    ]
  );

  const handleMapDialogClose = React.useCallback(
    () => setMapDialogAnchorEl(null),
    []
  );

  const dispatch = useDispatch();

  if (fetchState === FetchState.UNFETCHED) {
    setFetchState(FetchState.FETCHING);

    Promise.resolve(dispatch(getPlace({ placeID }))).then(
      () => setFetchState(FetchState.FETCHED)
    );
  }

  const handleRatingChange = React.useCallback(
    (rating: number) => {
      dispatch(setRating({
        placeID: place.get("id"),
        rating,
      }));
    },
    [
      place,
      dispatch,
    ]
  );

  if (fetchState !== FetchState.FETCHED) {
    return null;
  }

  let mapButton: JSX.Element|undefined = undefined;
  
  if (process.env.APTS_GOOGLE_MAPS_API_KEY) {
    mapButton = (
      <Grid item>
        <Button
          onClick={handleShowMapButtonClick}
        >
          Show map
        </Button>
        <Dialog
          open={!!mapDialogAnchorEl}
          onClose={handleMapDialogClose}
          maxWidth={false}
          PaperProps={{
            style: {
              width: "80vw",
              height: "90vh",
            },
          }}
        >
          <DialogActions>
            <IconButton
              onClick={handleMapDialogClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogContent>
            <PlaceMap
              place={place}
              height="100%"
            />
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }

  return (
    <Grid container
      direction="column"
    >
      <Grid item container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography
          variant="h2"
        >
          <PlaceAddress
            place={place}
            multiline
          />
        </Typography>
        <PlaceRating
          place={place}
          size={RatingComponentSizes.Large}
          onRatingChange={handleRatingChange}
        />
      </Grid>
      { mapButton }
      <Grid item>
        {
          place.get("amenities") && !place.get("amenities").isEmpty() ?
            (
              <List
                subheader={
                  <ListSubheader>
                    Amenities
                  </ListSubheader>
                }
              >
                {
                  place.get("amenities").map(
                    (amenity: string) => (
                      <ListItem
                        key={amenity}
                      >
                        <ListItemText
                          primary={amenity}
                        />
                      </ListItem>
                    )
                  ).toArray()
                }
              </List>
            ) :
            null
        }
      </Grid>
    </Grid>
  );
};
