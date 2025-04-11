import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const CloseBtn = ({ onClick }) => {
  return (
    <button
      className="absolute top-4 left-4 text-xl p-1 z-[401] border border-gray-400 text-gray-400 hover:border-primary-700 hover:text-primary-700 rounded-full "
      onClick={onClick}
      type={"button"}
    >
      <IoCloseOutline />
    </button>
  );
};

export { CloseBtn };
