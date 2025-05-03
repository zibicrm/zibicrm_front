import React, { useState, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "jalali-moment";
import PrimaryBtn from "../common/PrimaryBtn";
import TimePicker from "../common/TimePicker";
import LoadingBtn from "../utils/LoadingBtn";

const HourInput = ({ day, dayFormik, setState, status }) => {
  const [time, setTime] = useState("12:34pm");
  const [showTime, setShowTime] = useState("");
  const validationSchema = yup.object({
    start: yup.string().required("پر کردن فیلد اول اجباری است"),
    end: yup
      .string()
      .required("پر کردن فیلد دوم اجباری است")
      .test("bigger-than", "بازه زمانی صحیح نمی باشد", (value) => {
        if (value > formik.values.start) return true;
        return false;
      }),
  });
  const initialValuesTime = {
    start: "",
    end: "",
  };
  const formik = useFormik({
    initialValues: initialValuesTime,
    onSubmit: (values) => {},
    validationSchema,
    enableReinitialize: true,
  });
  const TimeHandler = (e) => {
    formik.setFieldValue(
      showTime,
      e === "12:00 am" ? "23:59" : moment(e, "hh:mm:ss A").format("HH:mm")
    );
  };

  const submitHandler = () => {


    if (
      !formik.errors.start &&
      !formik.errors.end &&
      formik.values.end &&
      formik.values.start
    ) {
      let value = {
        start: formik.values.start,
        end: formik.values.end,
      };
      let filter = dayFormik.values[day].filter(
        (item) => item.start === value.start && item.end === value.end
      );
      let filter2 = dayFormik.values[day].filter(
        (item) =>
          moment(`02/13/2020 ${item.end}`).unix() >
          moment(`02/13/2020 ${value.start}`).unix()
      );
      let filter3 = dayFormik.values[day].filter(
        (item) =>
          moment(`02/13/2020 ${item.start}`).unix() ===
          moment(`02/13/2020 ${value.end}`).unix()
      );


      if (filter.length) {
        formik.setFieldError("end", "بازه زمانی تکراری است");
      } else if (filter2.length || filter3.length) {
        formik.setFieldError("end", "تداخل زمانی وجود دارد");
      } else {
        !setState
          ? dayFormik.setFieldValue(day, [
              ...dayFormik.values[day],
              {
                id: Date.now(),
                start: formik.values.start,
                end: formik.values.end,
              },
            ])
          : setState({
              id: Date.now(),
              start: formik.values.start,
              end: formik.values.end,
            });
        formik.resetForm();
      }
    }
  };
  return (
    <div className="">
      <div className="flex flex-row items-center justify-between max-h-14 py-2 w-full ">
        <div className="md:w-64 h-14 text-right">
          <div className="flex w-full flex-row items-center gap-2 ">
            <div className="flex flex-row items-center gap-6">
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs">از</span>

                <input
                  className={`border-none h-7 max-w-[68px] cursor-pointer outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest`}
                  onClick={() => {
                    setShowTime("start");
                  }}
                  type={"button"}
                  {...formik.getFieldProps("start")}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs">تا</span>
                <input
                  className={`border-none h-7 max-w-[68px] cursor-pointer outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2 rounded-cs tracking-widest `}
                  type={"button"}
                  onClick={() => {
                    setShowTime("end");
                  }}
                  {...formik.getFieldProps("end")}

                  // disabled={!formik.values.days.includes(item.value)}
                  //   value={formik.values[item.id * 20].slice(0, -3)}
                />
              </div>
            </div>
            <div className="w-16 h-7 max-h-7 z-50 text-xs">
              <button
                onClick={() => submitHandler()}
                type="button"
                className="flex flex-row items-center justify-center rounded-cs bg-primary-900 w-full h-full min-w-fit  text-white text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed"
              >
                {status && status === 1 ? (
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                    <div
                      className={`w-[90%] h-[90%]  rounded-full
                      bg-primary-900
                      `}
                    ></div>
                  </div>
                ) : (
                  <>ثبت</>
                )}
              </button>
            </div>
          </div>
          {formik.errors.end && formik.touched.end && (
            <div className="text-[10px] text-red-300 mt-1.5">
              {String(formik.errors.end)}
            </div>
          )}
        </div>
      </div>
      {showTime ? (
        <div
          style={{ direction: "ltr" }}
          className="absolute z-[70] w-full bg-[#00000040] md:pb-[7px] max-h-[335px] md:max-h-fit top-[50px] md:top-[0px] left-0"
          onClick={() => setShowTime("")}
        >
          <TimePicker
            showTime={showTime}
            setShowTime={(e) => setShowTime(e)}
            setTime={TimeHandler}
            time={time}
          />
        </div>
      ) : null}
    </div>
  );
};

export default HourInput;
