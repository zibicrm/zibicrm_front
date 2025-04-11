import React from "react";
import { IoCheckmark } from "react-icons/io5";

const CheckBox = ({
  value,
  label,
  setValue,
  name,
  id,
  number = false,
  disabled = false,

}) => {



  const changeHandler = (e) => {

  
    let exist = value.includes(
      number ? Number(e.target.value) : String(e.target.value)
    );
    if (exist) {
      let filter = value.filter(
        (item) => Number(item) !== Number(e.target.value)
      );
      setValue(filter);
    } else {
      setValue([
        ...value,
        number ? Number(e.target.value) : String(e.target.value),
      ]);
    }
  };
  return (
    <div>
      <input
        type="checkbox"
        id={"checkbox" + name + label}
        name={name}
        disabled={disabled}
        onChange={changeHandler}
        checked={value.includes(number ? Number(id) : String(id))}
        value={number ? Number(id) : String(id)}
        className="hidden"
      />
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label
            htmlFor={"checkbox" + name + label}
            className={` w-5 h-5 min-w-[20px] min-h-[20px] ${
              value.includes(number ? Number(id) : String(id))
                ? "checked flex cursor-pointer items-center justify-center text-lg"
                : "bg-primary-50 text-field rounded-cs border border-primary-400 cursor-pointer"
            } ${disabled === true ? "cursor-not-allowed" : ""}`}
          >
            {value.includes(number ? Number(id) : String(id))  && (
              <IoCheckmark />
            )}
          </label>
          <label
            htmlFor={"checkbox" + name + label}
            className={`text-sm text-gray-900 ${
              disabled === true ? "cursor-not-allowed" : ""
            }`}
          >
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};

export { CheckBox };
