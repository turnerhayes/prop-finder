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
  root: {
    display: "flex",
    flexDirection: "row-reverse",
  },

  large: {
    fontSize: "2em",
  },

  star: {
    "&::before": {
      content: '"☆"',
    },

    "$interactive&:hover::before": {
      content: '"★"',
      color: "gold",
      textShadow: "0 0 8px gold",
    },

    "$interactive&:hover ~ $star::before": {
      textShadow: "0 0 8px gold",
    },
  },

  filledStar: {
    "&::before": {
      content: '"★"',
      color: "gold",
    },
  },

  interactive: {
    cursor: "pointer",
  },
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
      className={classnames(
        classes.root,
        {
          [classes.large]: size === RatingComponentSizes.Large,
        }
      )}
    >
      {
        Range(0, 5).map(
          (index) => {
            const isFilled = index < place.get("rating");

            return (
              <span
                key={index}
                data-index={index}
                className={classnames(
                  classes.star,
                  {
                    [classes.filledStar]: isFilled,
                    [classes.interactive]: isInteractive,
                  }
                )}
                onClick={handleStarClick}
                role={
                  isInteractive ?
                    "button" :
                    undefined
                }
              ></span>
            );
          }
        // This little hack lets us highlight a star on hover *and all stars
        // before it* using only CSS; there's no "previous siblings" CSS
        // selector, only "following siblings". So we render the stars in
        // reverse order, so that, for example, the 1-star is after the 2-star
        // in DOM order, and therefore using the following siblings selector
        // will apply to the 1-star. We then reverse the display order (using
        // flexbox's "row-reverse" flex-direction) so it displays the reversed
        // stars in reverse order (i.e. in the correct order)
        ).reverse().toArray()
      }
    </div>
  );
};
