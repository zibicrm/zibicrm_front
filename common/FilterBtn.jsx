import { useEffect, useState } from "react";
import Select from "react-select";

const FilterBtn = ({
  selectOption,
  name,
  label,
  labelOption = "name",
  valueOption = "id",
  onChange,
}) => {
  let defaultValue = {
    value: 0,
    [labelOption]: label,
  };
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#fff",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#fff",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#111827",
      boxShadow: "none",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#4267B3",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#4267B3",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#fff",
      width: "140px",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#fff", // Custom colour
    }),
  };
  const [value, setValue] = useState({
    value: 0,
    [labelOption]: label,
  });

  return (
    <div className="flex flex-col items-start h-10 md:h-10 relative">
      <div
        className={`w-full bg-[#4267B3] rounded-cs relative h-10 md:h-10 text-xs md:text-base border border-primary-500 pr-2 flex items-center justify-center`}
      >
        <Select
          className="w-full text-gray-500 text-sm"
          options={selectOption}
          getOptionLabel={(option) => option[labelOption]}
          getOptionValue={(option) => option[valueOption]}
          defaultValue={defaultValue}
          onChange={(e) => {
            setValue(e);
            onChange(e);
          }}
          value={value}
          id={"select-filter"}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default FilterBtn;
