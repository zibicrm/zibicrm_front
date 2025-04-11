import React from "react";

const Modal = ({ children, setModal }) => {
  return (
    <div
      className="w-full h-full overflow-hidden bg-[#00000080] z-50 fixed right-0 top-0 flex justify-center items-center"
      onClick={setModal}
    >
      <div
        className="z-50 flex justify-center items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
