import React from "react";
import SNAvatar from "./SNAvatar";

const SNWidgetBoxItem = ({ srcAvatar, name, description, leftIcon }) => {
  return (
    <div className="flex gap-[10px] items-center">
      <SNAvatar src={srcAvatar} size={50} />
      <div className=" flex-grow">
        <p className=" text-color-text text-[0.875rem] break-words font-medium leading-[1.4285714286em]">
          {name}
        </p>
        <p className="text-color-text text-[0.75rem] break-words font-medium leading-[1.4285714286em]">
          {description}
        </p>
      </div>
      {leftIcon}
    </div>
  );
};

export default SNWidgetBoxItem;
