import React from "react";

const GoustBtn = ({ text, children, onClick, ...rest }) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="flex flex-row items-center justify-center xl:py-5 py-[11px] w-full h-full hover:shadow-btn min-w-fit  text-primary-900 font-bold text-xs xl:text-base  duration-200 disabled:bg-gray-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
    >
      <>
        {text}
        <span className={`text-2xl  `}>{children}</span>
      </>
    </button>
  );
};

export default GoustBtn;
