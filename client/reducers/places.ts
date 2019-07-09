import { List, Map } from "immutable";
import { FSAAuto, FSAWithPayloadAndMeta, FSA } from "flux-standard-action";
import { getPlaces, getPlace, setRating } from "+app/actions";

const initialState = Map({
  items: Map<string, any>(),
});

export const PlacesReducer = (state = initialState, action: FSA<string, any, any>) => {
  switch (action.type) {
    case getPlaces.actionTypes.complete: {
      const places: List<Map<string, any>> = action.payload;

      return state.mergeIn(
        ["items"],
        places.reduce(
          (map, place) => map.set(
            place.get("id"),
            place
          ),
          Map()
        )
      )
    }

    case getPlace.actionTypes.complete:
    case setRating.actionTypes.complete: {
      const place: Map<string, any> = action.payload;

      return state.setIn(
        [
          "items",
          place.get("id"),
        ],
        place
      );
    }
      
    default:
      return state;
  }
}
