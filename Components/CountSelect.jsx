import { useState } from "react";
import Select from "react-select";

const CountSelect = ({ setCount, count }) => {
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      width: "100px",
      height: "100px",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      width: "100px",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#000",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",
      width: "100px",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#4267B3",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      width: "100px",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
  };
  const selectOption = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  return (
    <div className="flex flex-col items-start h-[42px] md:h-12 relative">
      <div
        className={`w-full  rounded-cs relative h-[42px] md:h-12 text-xs md:text-base border border-primary-500 pr-2 flex items-center justify-center`}
      >
        <Select
          className="w-full text-gray-400"
          options={selectOption}
          //   defaultValue={defaultValue}
          onChange={(e) => {
            setCount(e.value);
          }}
          defaultValue={{ value: 50, label: "50" }}
          menuPosition="fixed"
          id="countSelect"
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default CountSelect;
