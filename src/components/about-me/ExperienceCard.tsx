import React, { FC } from "react";

interface Props {
  isCompleted: boolean;
  type: string;
  title: string;
  idx: number;
}
const ExperienceCard: FC<Props> = () => {
  return <div>ExperienceCard</div>;
};

export default ExperienceCard;
