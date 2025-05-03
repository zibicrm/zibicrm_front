import { useEffect, useState } from "react";
import Select from "react-select";

const SelectInput = ({
  selectOption,
  formik,
  name,
  label,
  labelOption = "name",
  valueOption = "id",
  defaultV,
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
      color: "#6B7280",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#6B7280",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#6B7280",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#6B7280",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#6B7280",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
  };
  const [value, setValue] = useState({
    value: 0,
    [labelOption]: label,
  });
  useEffect(() => {
    if (value[valueOption]) {
      formik.setFieldValue(name, String(value[valueOption]));
    }
  }, [value]);


  return (
    <div className="flex flex-col items-start h-[42px] md:h-12 w-full relative">
      <div
        className={`w-full  rounded-cs relative h-[42px] md:h-12 text-xs md:text-base border border-primary-500 pr-2 flex items-center justify-center ${
          formik.errors[name] && formik.touched[name]
            ? "shadow-err border-red-300 hover:shadow-err"
            : "hover:shadow-btn border-primary-400 hover:border-primary-300 focus:border-primary-300"
        }`}
      >
        <Select
          className="w-full text-gray-500 text-sm"
          options={selectOption}
          getOptionLabel={(option) => option[labelOption]}
          getOptionValue={(option) => option[valueOption]}
          defaultValue={defaultValue}
          onChange={(e) => {
            setValue(e), formik.setTouched({ ...formik.touched, [name]: true });
          }}
          value={value}
          id={name}
          onFocus={() => formik.setTouched({ ...formik.touched, [name]: true })}
          onBlur={() => formik.onBlur}
          styles={customStyles}
        />
      </div>
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-xs absolute -bottom-5 text-red-300 mt-1.5">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
