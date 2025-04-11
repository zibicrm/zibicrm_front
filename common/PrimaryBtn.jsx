import React from "react";
import LoadingBtn from "../utils/LoadingBtn";

const PrimaryBtn = ({ text, children, onClick, status, ...rest }) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="flex flex-row items-center justify-center rounded-cs bg-primary-900 w-full h-full min-w-fit  text-white text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed"
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

export default PrimaryBtn;
