import React from "react";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import TimePicker from "../common/TimePicker";
import HourInput from "./HourInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";
import moment from "moment-timezone";
import { toast } from "react-toastify";
const DisableAttendTime = ({}) => {
  const [edit, setEdit] = useState("");
  const [error, setError] = useState("");
  const [click, setClick] = useState(false);
  const [selected, setSelected] = useState("Sunday");
  const [editTime, setEditTime] = useState("");
  const [attendDays, setAttendDays] = useState([null]);
  const [showTime, setShowTime] = useState("");
  const [time, setTime] = useState("12:34pm");

  const initialValuesTime = {
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };
  const timeFormik = useFormik({
    initialValues: initialValuesTime,
    onSubmit: (values) => {},
    enableReinitialize: true,
  });

  const TimeHandler = (e) => {
    let convertedTime = moment(e, "hh:mm:ss A").format("HH:mm");
    let filter = timeFormik.values[selected].filter(
      (item) => item.id === editTime.id
    )[0];
    let index = timeFormik.values[selected].indexOf(filter);
    let filterValue = timeFormik.values[selected];
    filter = { ...filter, [editTime.type]: convertedTime };
    if (filter.end <= filter.start) {
      toast.error("بازه زمانی انتخابی اشتباه می باشد");
    }
    if (filter.end > filter.start) {
      filterValue[index] = filter;
      timeFormik.setFieldValue(selected, filterValue);
    }
  };
  const deleteHandler = (id) => {
    let filter = timeFormik.values[selected].filter((item) => item.id !== id);
    timeFormik.setFieldValue([selected], filter);
  };
  useEffect(() => {
    setAttendDays(timeFormik.values);
  }, [timeFormik.values]);
  return (
    <div className="flex flex-row  h-[360px] w-full px-5 py-6 relative">
      <div className="flex flex-col w-1/2 items-start gap-2">
        <HourInput day={selected} dayFormik={timeFormik} />
        {timeFormik.values[selected] &&
          timeFormik.values[selected].map((item, index) => (
            <div
              key={index}
              className="flex flex-col h-full max-h-[40px] justify-between"
            >
              <div className="flex flex-row gap-2 items-center ">
                <div className="flex flex-row items-center ">
                  <input
                    className={`border-none z-0 cursor-pointer h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest ${
                      edit === item.id ? "opacity-100 " : "opacity-60 "
                    }`}
                    onClick={() => {
                      setEditTime({ type: "start", id: item.id });
                    }}
                    value={item.start}
                    type={"button"}
                  />
                  <div
                    className={`h-[1px] w-4 opacity-60  mx-1 bg-gray-900`}
                  ></div>
                  <input
                    className={`border-none z-0 cursor-pointer h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2 rounded-cs tracking-widest ${
                      edit === item.id ? "opacity-100 " : "opacity-60 "
                    }`}
                    type={"button"}
                    onClick={() => {
                      setEditTime({ type: "end", id: item.id });
                    }}
                    value={item.end}
                  />
                  {edit === item.id && (
                    <button
                      onClick={() => setEdit(0)}
                      type="button"
                      className=" mr-1 flex flex-row items-center justify-center   min-w-fit  text-primary-700 text-lg  duration-200 "
                    >
                      <AiOutlineCheck />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteHandler(item.id)}
                  className="text-xl hover:text-primary-700"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
              <div className="text-[12px] text-red-300">
                {error &&
                  click &&
                  "بازه های انتخابی روز های انتخاب شده را مشخص کنید"}
              </div>
            </div>
          ))}
      </div>
      <div className="w-1/2  ">
        {editTime.id > 0 && (
          <div
            style={{ direction: "ltr" }}
            className="z-[70] w-full absolute bg-[#00000040] md:pb-[7px] max-h-[335px] md:max-h-fit top-[250px] md:top-[0px] left-0"
            onClick={() => setEditTime(0)}
          >
            <TimePicker
              showTime={showTime}
              setShowTime={(e) => setEditTime(e)}
              setTime={TimeHandler}
              time={time}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisableAttendTime;
