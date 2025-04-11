import React from "react";
import LoadingBtn from "../utils/LoadingBtn";

const IconBtn = ({ icon, children, onClick, ...rest }) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      type="button"
      className=" cursor-pointer text-gray-900 w-8 h-8 z-0 px-2 text-3xl flex items-center justify-center rounded-cs font-bold bg-white"
    >
      <span className="text-2xl"> {icon}</span>
      <span className="text-2xl">{children}</span>
    </button>
  );
};

export default IconBtn;
