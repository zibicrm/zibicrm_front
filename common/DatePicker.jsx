import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import InputIcon from "react-multi-date-picker/components/input_icon";
import moment from "jalali-moment";

export default function DatePickerComponent({ formik, name, label, disabled }) {
  const [value, setValue] = useState({ format: "DD/MM/YYYY" });
  const [isShow, setShow] = useState(false);
  useEffect(() => {
    if (formik.touched[name] && value.date) {
      formik.setFieldValue(name, moment(value.date).format("YYYY/MM/DD"));
    }
  }, [value]);
  const convert = (date, format = value.format) => {
    let object = { date, format };
    if (date) {
      setValue({
        date: date.toDate(),
      });
    } else {
      setValue({ date: "" });
    }
    formik.setTouched({ ...formik.touched, [name]: true });
  };

  return (
    <>
      <div
        style={{ direction: "rtl" }}
        className={`hidden md:block h-[42px]   md:h-12 input-controll relative ${
          disabled
            ? "cursor-not-allowed bg-gray-100 border-gray-200 hover:shadow-none"
            : ""
        } ${formik.errors[name] && formik.touched[name] ? "error-input" : ""} `}
      >
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          disabled={disabled}
          calendarPosition="bottom-right"
          // maxDate="1399/11/14"
          // animations={[opacity(), transition({ from: 35, duration: 800 })]}
          render={<InputIcon />}
          className={`text-primary-700`}
          inputClass={`custom-input`}
          onChange={convert}
          id={name}
          onOpen={() => {
            formik.setTouched({ ...formik.touched, [name]: true }),
              setShow(true);
          }}
          onClose={() => {
            formik.onBlur;
            setShow(false);
          }}
          value={formik[name]}
        />

        {!isShow && !value.date && (
          <label
            htmlFor={name}
            className={`absolute text-xs md:text-sm right-5 top-4 text-gray-900  ${
              disabled &&
              "cursor-not-allowed bg-gray-100 border-gray-200 hover:shadow-none"
            }`}
          >
            {label}{" "}
          </label>
        )}
        {formik.errors[name] && formik.touched[name] && (
          <div className="text-xs text-red-300 mt-1.5">
            {formik.errors[name]}
          </div>
        )}
      </div>

      <div
        style={{ direction: "rtl" }}
        className="md:hidden w-full h-[42px]  md:h-12 input-controll relative"
      >
        <DatePicker
          className="rmdp-mobile text-primary-700"
          calendar={persian}
          locale={persian_fa}
          calendarPosition="center"
          // animations={[opacity(), transition({ from: 35, duration: 800 })]}
          render={<InputIcon />}
          inputClass={
            formik.errors[name] && formik.touched[name]
              ? "custom-input custom-input-err"
              : "custom-input"
          }
          onChange={convert}
          id={name}
          onOpen={() => {
            formik.setTouched({ ...formik.touched, [name]: true }),
              setShow(true);
          }}
          onClose={() => {
            formik.onBlur, setShow(false);
          }}
          value={formik[name]}
        />
        {!isShow && !value.date && (
          <label
            htmlFor={name}
            className="absolute text-xs md:text-base right-5 top-3 text-gray-400"
          >
            تاریخ تولد
          </label>
        )}
        {formik.errors[name] && formik.touched[name] && (
          <div className="text-xs text-red-300 mt-1.5">
            {formik.errors[name]}
          </div>
        )}
      </div>
    </>
  );
}
