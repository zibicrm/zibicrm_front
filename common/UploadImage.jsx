import React from "react";
import { IoCloudUploadSharp } from "react-icons/io5";

const UploadImage = ({ name, formik, label, onChange, disabled = false }) => {
  const imageHandler = (event) => {
    if (event.target.files && event.target.files) {
      let img = event.target.files[0];
      formik.setFieldValue(name, img);
    }
  };
  return (
    <div className="relative z-0 w-full h-[42px] md:h-12  ">
      <label htmlFor={name} className="cursor-pointer">
        <div
          className={`pt-3 pb-2 flex items-center justify-end w-full px-6 mt-0 border rounded-cs h-full   appearance-none focus:outline-none focus:ring-0 focus:bg-primary-100  ${
            formik.errors[name] && formik.touched[name]
              ? "shadow-err border-red-300 hover:shadow-err"
              : "hover:shadow-btn border-primary-400 hover:border-primary-300 focus:border-primary-300"
          } ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed hover:shadow-none"
              : ""
          }`}
        >
          <label
            className={`text-gray-400 text-xs md:text-2xl flex flex-row items-center gap-2 cursor-pointer ${
              disabled
                ? "bg-gray-100 border-gray-200 cursor-not-allowed hover:shadow-none"
                : ""
            }`}
            htmlFor={name}
          >
            {/* بارگزاری کنید */}
            <IoCloudUploadSharp />
          </label>
        </div>
        <input
          id={name}
          type={"file"}
          placeholder=" "
          className="hidden"
          onChange={imageHandler}
          // {...formik.getFieldProps({ name })}
          accept="image/*"
          disabled={disabled}
        />
        <span
          // htmlFor={name}
          className={`absolute text-xs md:text-sm top-4 right-5 -z-1 text-gray-500 ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed hover:shadow-none"
              : ""
          }`}
        >
          {formik.values.businessLicense
            ? formik.values.businessLicense.name
            : label}
        </span>
        {formik.errors[name] && formik.touched[name] && (
          <div className="text-xs text-red-300 mt-1.5">
            {formik.errors[name]}
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadImage;
