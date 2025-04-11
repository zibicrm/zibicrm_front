import React from "react";
import { IoCheckmark } from "react-icons/io5";

const FormikCheckBox = ({ formik, name, label, children, disable }) => {
  return (
    <div className="flex flex-col items-start h-10 md:h-12 mt-4">
      <input
        type="checkbox"
        id={"formikCheckbox" + name}
        name={name}
        {...formik.getFieldProps({ name })}
        className="hidden"
        disabled={disable}
      />
      <div className="flex flex-row items-center gap-2">
        <label
          htmlFor={"formikCheckbox" + name}
          className={`flex items-center justify-center cursor-pointer rounded-cs w-6 h-6  ${
            formik.values[name] && !disable && "checked  text-lg  "
          } ${
            !formik.values[name] &&
            !disable &&
            "bg-primary-100 text-field   border border-primary-400 "
          } ${disable && "bg-gray-100 text-gray-400"}`}
        >
          <IoCheckmark />
        </label>
        <label htmlFor={"formikCheckbox" + name} className="text-xs">
          {children}
          {label}
        </label>
      </div>
      {formik.errors[name] && formik.touched[name] && (
        <div className="text-xs text-red-300 text-right mt-0">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default FormikCheckBox;
