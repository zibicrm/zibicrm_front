import React, { memo } from "react";

const Tabs = ({ options, tab, setTab }) => {
  return (
    <div className="flex flex-row items-center justify-center bg-primary-50 rounded-cs w-fit min-w-fit p-1 ">
      {options.map((item) => (
        <div
          key={item.id}
          className={`rounded-cs min-w-fit w-36 px-3 py-2 text-gray-900 lg:text-base text-sm md:text-base h-9 flex items-center justify-center cursor-pointer ${
            tab === item.id ? "bg-white " : " "
          } `}
          onClick={() => setTab(item.id)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
