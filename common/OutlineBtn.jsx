import React from "react";
import LoadingBtn from "../utils/LoadingBtn";

const OutlineBtn = ({ text, children, onClick, status, ...rest }) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="rounded-cs cursor-pointer w-full h-full px-2 flex items-center justify-center border border-primary-900  text-xs xl:text-base text-primary-900 disabled:border-gray-100 disabled:text-gray-100 hover:shadow-btn"
    >
      {status && status === 1 ? (
        <LoadingBtn />
      ) : (
        <>
          {text}
          <span className="text-2xl">{children}</span>
        </>
      )}
    </button>
  );
};

export default OutlineBtn;
