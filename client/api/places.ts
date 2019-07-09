import { fromJS } from "immutable";

export const getPlaces = async () => {
  const response = await fetch("/api/places");

  if (!response.ok) {
    throw new Error("Error getting places");
  }

  if (response.status < 300) {
    const places = await response.json();

    return fromJS(places);
  }

  throw new Error(
    `GET request to /api/places returned with status ${response.status}`
  );
};

export const getPlace = async (
  { placeID }: {
    placeID: number;
  }
) => {
  const response = await fetch(`/api/places/${placeID}`);

  if (!response.ok) {
    throw new Error("Error getting place");
  }

  if (response.status < 300) {
    const place = await response.json();

    return fromJS(place);
  }

  throw new Error(
    `GET request to /api/places/${placeID} returned with status ${response.status}`
  );
};

const updatePlace = async (
  {
    placeID,
    ...updates
  }: {
    placeID: number,
    [key:string]: any,
  }
) => {
  const response = await fetch(
    `/api/places/${placeID}`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error("Error updating place");
  }

  if (response.status < 300) {
    const place = await response.json();

    return fromJS(place);
  }

  throw new Error(
    `PATCH request to /api/places/${placeID} returned with status ${response.status}`
  );
};

export const setRating = (
  {
    placeID,
    rating,
  }: {
    placeID: number,
    rating: number,
  }
) => {
  return updatePlace({
    placeID,
    rating,
  })
};
