import * as React from "react";
import { Map } from "immutable";
import {
  GoogleMap,
  withGoogleMap,
  Marker,
  withScriptjs,
  InfoWindow,
} from "react-google-maps";
import { PlaceAddress } from "../PlaceAddress";

interface IPlaceMapInnerComponentProps {
  place: Map<string, any>;
}

const PlaceMapInner = withScriptjs(withGoogleMap(
  ({ place }: IPlaceMapInnerComponentProps) => {
    const placeLocation = {
      lat: place.getIn(["location", 0]),
      lng: place.getIn(["location", 1]),
    };

    const [isInfoWindowOpen, setIsInfoWindowOpen] = React.useState(false);

    const handleMarkerClick = React.useCallback(
      () => setIsInfoWindowOpen(true),
      [
        setIsInfoWindowOpen,
      ]
    );

    const handleMapClick = React.useCallback(
      () => setIsInfoWindowOpen(false),
      [
        setIsInfoWindowOpen,
      ]
    );

    return (
      <GoogleMap
        defaultCenter={placeLocation}
        defaultZoom={14}
        onClick={handleMapClick}
      >
        <Marker
          position={placeLocation}
          onClick={handleMarkerClick}
        >
          {
            isInfoWindowOpen ? (
            <InfoWindow>
              <PlaceAddress
                place={place}
                multiline
              />
            </InfoWindow>
            ) :
            null
          }
        </Marker>
      </GoogleMap>
    );
  }
));

export interface IPlaceMapComponentProps extends IPlaceMapInnerComponentProps {
  width?: string|number;
  height?: string|number;
}

export const PlaceMap = ({
  place,
  width,
  height = "40em",
}: IPlaceMapComponentProps) => {
  return (
    <PlaceMapInner
      place={place}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAJSBrcOMa0mZzh6eZd1ccew3A6RRRwhng`}
      loadingElement={<div style={{ height: "100%", width: "100%" }} />}
      containerElement={<div style={{ height, width }} />}
      mapElement={<div style={{ height: "100%", width: "100%" }} />}
    />
  );
};
