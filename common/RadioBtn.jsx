import React from "react";

const RadioInput = ({
  radioOptions,
  formik,
  name,
  value,
  changeHandler,
  disabled,
}) => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 ">
      {radioOptions.map((item) => {
        return (
          <div
            key={item.id}
            className="flex flex-row items-center gap-2 md:gap-3"
          >
            <label
              htmlFor={item.value + item.id + name}
              className={`md:w-5 md:h-5 w-4 h-4 cursor-pointer  rounded-full border flex items-center justify-center ${
                disabled
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "bg-primary-100 border-primary-400 "
              } `}
            >
              {formik ? (
                <div
                  className={`${
                    formik.values[name] === item.id
                      ? "bg-primary-700 w-3 h-3 rounded-full "
                      : "hidden"
                  } ${disabled ? "bg-gray-300" : ""}`}
                ></div>
              ) : (
                <div
                  className={
                    value === String(item.id)
                      ? "bg-primary-700 w-3 h-3 rounded-full "
                      : "hidden"
                  }
                ></div>
              )}
            </label>
            <label
              htmlFor={item.value + item.id + name}
              className="min-w-fit text-gray-900 text-xs md:text-sm"
            >
              {item.label}
            </label>
            <input
              type="radio"
              id={item.value + item.id + name}
              name={name}
              onChange={formik ? formik.handleChange : changeHandler}
              checked={
                formik
                  ? formik.values[name] == item.id
                  : value === String(item.id)
              }
              value={item.id}
              className="hidden"
              disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RadioInput;
