import React from "react";

const LoadingBtn = ({ white = false }) => {
  return (
    <div className="w-8 h-8 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
      <div
        className={`w-[90%] h-[90%]  rounded-full ${
          white ? "bg-white" : "bg-gray-100"
        }`}
      ></div>
    </div>
  );
};

export default LoadingBtn;
