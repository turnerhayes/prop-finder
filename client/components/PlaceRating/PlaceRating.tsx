import * as React from "react";
import { Map, Range } from "immutable";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";

export const enum RatingComponentSizes {
  Small = "small",
  Large = "large",
}

export interface IPlaceRatingComponentProps {
  place: Map<string, any>;
  size?: RatingComponentSizes;
  onRatingChange?: (rating: number) => void;
}

const useStyles = makeStyles({
  large: {
    fontSize: "2em",
  },

  filledStar: {
    color: "gold",
  },

  interactive: {
    cursor: "pointer",
  }
});

export const PlaceRating = (
  {
    place,
    size,
    onRatingChange,
  }: IPlaceRatingComponentProps
) => {
  const isInteractive = Boolean(onRatingChange);

  if (!isInteractive && !place.get("rating")) {
    return null;
  }

  const classes = useStyles();

  const handleStarClick = React.useCallback(
    (event) => {
      if (onRatingChange) {
        const index = Number(event.target.dataset.index) + 1;

        onRatingChange(index);
      }
    },
    []
  );

  return (
    <div
      className={classnames({
        [classes.large]: size === RatingComponentSizes.Large,
      })}
    >
      {
        Range(0, 5).map(
          (index) => {
            const isFilled = index < place.get("rating");

            return (
              <span
                key={index}
                data-index={index}
                className={classnames({
                  [classes.filledStar]: isFilled,
                  [classes.interactive]: isInteractive,
                })}
                onClick={handleStarClick}
                role={
                  isInteractive ?
                    "button" :
                    undefined
                }
              >
                {
                  isFilled ?
                    "★" :
                    "☆"
                }
              </span>
            );
          }
        )
      }
    </div>
  );
};
