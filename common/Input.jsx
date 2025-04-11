import React, { useState } from "react";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import { CurrencyNum } from "../hooks/CurrencyNum";

const Input = ({
  label,
  name,
  formik,
  type = "text",
  show,
  maxLength,
  disable,
  currency,
  ...rest
}) => {
  const [passwordShow, setPasswordShow] = useState(false);

  function toFinalNumberFormat(controlToCheck) {
    let enteredNumber = "" + controlToCheck;
    enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ""); // remove any non-numeric, non-period character
    controlToCheck = Number(enteredNumber).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }); // Number(enteredNumber).toLocaleString('en'); // enteredNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  return (
    <div className="relative z-0 w-full md:max-h-[64px] max-h-[64px] input-controll">
      <input
        maxLength={maxLength}
        id={name}
        type={passwordShow ? "text" : type}
        placeholder=" "
        disabled={disable === true ? true : false}
        {...formik.getFieldProps({ name })}
        {...rest}
        className={`pt-3 pb-2 block w-full px-6 mt-0 text-sm text-gray-400 border rounded-cs md:max-h-[48px] h-12 max-h-[48px] bg-white autofill:bg-white  appearance-none focus:outline-none focus:ring-0 focus:bg-white  disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:hover:shadow-none autofill:text-gray-400 ${
          formik.errors[name] && formik.touched[name]
            ? "shadow-err border-red-300 hover:shadow-err"
            : "hover:shadow-btn border-primary-500 hover:border-primary-500 focus:border-primary-500"
        }`}
      />
      <label
        htmlFor={name}
        className="absolute cursor-text rounded-[90%] text-xs md:text-sm duration-300 top-4 right-5 -z-1 origin-0 label-bg text-gray-500 "
      >
        {label}
      </label>
      {show ? (
        <button
          className="text-gray-400 absolute md:text-2xl text-lg top-3 left-4"
          onClick={() => setPasswordShow(!passwordShow)}
          type={"button"}
        >
          {show ? <IoEyeSharp /> : <IoEyeOff />}
        </button>
      ) : null}

      {formik.errors[name] && formik.touched[name] && (
        <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default Input;
