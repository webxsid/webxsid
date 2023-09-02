import React, { FC, useState } from "react";
import { useSprings, animated } from "react-spring";
import { useSwipeable } from "react-swipeable";
import FeaturedCard from "./FeaturedCard";
import { IProjectData } from "@interfaces/pages.data.interface";

interface IProps {
  cards: IProjectData[];
}
const CardStack: FC<IProps> = ({ cards }) => {
  const [index, setIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => swipeLeft(),
    onSwipedRight: () => swipeRight(),
    trackMouse: true,
  });

  const swipeLeft = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
    }
  };

  const swipeRight = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const cardSprings = useSprings(
    cards.length,
    cards.map((_, i) => ({
      opacity: i === index ? 1 : 0.4,
      transform: `translateX(${(i - index) * 10}px)
        rotate(${(i - index) * 1}deg)
      `,
      zIndex: i === index ? 1 : 0,
      position: "absolute",
    }))
  );
  return (
    <div
      {...handlers}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {cardSprings.map((props, i) => (
        <animated.div
          key={i}
          style={
            {
              ...props,
              width: "18.75rem",
              height: "31rem",
            } as any
          }
        >
          <FeaturedCard data={cards[i]} />
        </animated.div>
      ))}
    </div>
  );
};

export default CardStack;
