import Select from "react-select";

const FilterSelect = ({
  selectOption,
  name,
  label,
  labelOption = "name",
  valueOption = "id",
  changeHandler,
  value,
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
      //   width: "120px",
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
      //   width: "120px",
      color: "#fff",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#000",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",
      //   width: "120px",
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
      //   width: "120px",
      height: "48px",
      color: "#fff",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      svg: {
        fill: "#fff",
      },
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#ffffff",
      };
    },
  };
  return (
    <div className="flex flex-col items-start h-[42px] md:h-12 relative">
      <div
        className={`w-full  rounded-cs relative h-[42px] md:h-12 text-xs md:text-base  flex items-center justify-center `}
      >
        <Select
          className="w-full text-gray-500 text-sm "
          options={selectOption}
          getOptionLabel={(option) => option[labelOption]}
          getOptionValue={(option) => option[valueOption]}
          defaultValue={defaultValue}
          onChange={(e) => {
            changeHandler(e);
          }}
          id={name}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default FilterSelect;
