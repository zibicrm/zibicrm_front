import moment from "moment";
import React, { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import PrimaryBtn from "../common/PrimaryBtn";
import TimePicker from "../common/TimePicker";
import HourInput from "./HourInput";
import Modal from "./Modal";

const HoursInput = ({
  setOpen,
  formik,
  level,
  setLevel,
  daySelected,
  setDays,
}) => {
  const [showTime, setShowTime] = useState(0);
  const [time, setTime] = useState("12:34pm");
  const [selected, setSelect] = useState("");
  const [edit, setEdit] = useState("");
  const [error, setError] = useState("");
  const [click, setClick] = useState(false);
  const [editTime, setEditTime] = useState("");
  const days = [
    { id: 1, value: "Saturday", label: "شنبه" },
    { id: 2, value: "Sunday", label: "یکشنبه" },
    { id: 3, value: "Monday", label: "دوشنبه" },
    { id: 4, value: "Tuesday", label: "سه شنبه" },
    { id: 5, value: "Wednesday", label: "چهارشنبه" },
    { id: 6, value: "Thursday", label: "پنجشنبه" },
    { id: 7, value: "Friday", label: "جمعه" },
  ];
  const TimeHandler = (e) => {
    let convertedTime = moment(e, "hh:mm:ss A").format("HH:mm");
    let filter = formik.values[selected].filter(
      (item) => item.id === editTime.id
    )[0];
    let index = formik.values[selected].indexOf(filter);
    let filterValue = formik.values[selected];
    filter = { ...filter, [editTime.type]: convertedTime };
    if (filter.end <= filter.start) {
      toast.error("بازه زمانی انتخابی اشتباه می باشد");
    }
    if (filter.end > filter.start) {
      filterValue[index] = filter;
      formik.setFieldValue(selected, filterValue);
    }
  };
  const changeHandler = (e) => {
    let filtered = daySelected.filter((item) => item === e.target.value);
    if (!filtered.length) {
      setDays([...daySelected, e.target.value]);
    }
    if (filtered.length) {
      let filter = daySelected.filter((item) => item !== e.target.value);
      setDays(filter);
    }
  };
  useEffect(() => {
    daySelected[0] && setSelect(daySelected[0]);
  }, [daySelected]);
  const deleteHandler = (id) => {
    let filter = formik.values[selected].filter((item) => item.id !== id);
    formik.setFieldValue([selected], filter);
  };
  useEffect(() => {
    for (let index = 0; index < daySelected.length; index++) {
      const element = daySelected[index];
      if (!formik.values[element].length) {
        setError(element);
      } else {
        setError("");
      }
    }
  }, [formik.values, daySelected]);
  const submitHandler = () => {
    setClick(true);
    if (!error) {
      setOpen(false);
    }
  };
  return (
    <Modal setModal={() => {}}>
      <div className="md:max-w-md bg-white rounded-cs max-w-[80vw]  flex z-50 flex-col items-center justify-start ">
        <div className="bg-primary-700  text-xl md:text-base rounded-b-[46px] rounded-t-cs px-16 py-3 md:py-6 text-white flex flex-col items-center justify-between w-full gap-4">
          <span>انتخاب روز</span>
          <div className="bg-white flex flex-row items-center gap-5 px-4 py-3 rounded-cs">
            {level === 0 &&
              days.map((item) => (
                <div key={item.id}>
                  <input
                    type="checkbox"
                    id={item.value}
                    name="days"
                    onChange={changeHandler}
                    checked={formik.values[item.value].length && true}
                    value={item.value}
                    // onBlur={formik.handleBlur}
                    className="hidden"
                  />
                  <div className="flex flex-row items-center gap-2">
                    <label
                      htmlFor={item.value}
                      className={`w-9 h-9 rounded-full  flex items-center justify-center  ${
                        daySelected.includes(item.value)
                          ? "bg-primary-700 text-white "
                          : "bg-white text-primary-700 border border-primary-700  cursor-pointer"
                      }`}
                    >
                      {item.label.slice(0, 1)}
                    </label>
                  </div>
                </div>
              ))}
            {level === 1 &&
              days.map((item) => (
                <button
                  className={`w-9 h-9 rounded-full  flex items-center justify-center ${
                    selected === item.value &&
                    "bg-primary-700 text-white border-none"
                  } ${
                    daySelected.includes(item.value) && selected !== item.value
                      ? "bg-white text-primary-700 border border-primary-700  cursor-pointers "
                      : "border border-gray-100 text-gray-100"
                  }  `}
                  onClick={() => setSelect(item.value)}
                  disabled={!daySelected.includes(item.value)}
                  key={item.id}
                  type="button"
                >
                  {item.label.slice(0, 1)}
                </button>
              ))}
          </div>
        </div>
        {level === 0 && (
          <div className="px-3 pt-20 pb-36 h-[360px] ">
            <p className="text-center">
              روزهای حضور خود در هفته را از منو بالا انتخاب نمایید در مرحله بعد
              بازه زمانی حضور در هر روز را وارد خواهید کرد
            </p>
          </div>
        )}
        {level === 1 && (
          <div className="flex flex-row  h-[360px] w-full px-5 py-6 relative">
            <div className="flex flex-col w-1/2 items-start gap-2">
              <HourInput day={selected} dayFormik={formik} />
              {formik.values[selected] &&
                formik.values[selected].map((item, index) => (
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
        )}

        <div className="w-full flex flex-row  justify-between items-center p-3">
          <div className="h-12 w-24 md:w-44">
            {level === 1 && (
              <button
                onClick={() => setLevel(0)}
                className="border w-full h-full text-xs md:text-base border-primary-700 text-primary-700 rounded-cs"
              >
                قبلی
              </button>
            )}
          </div>
          <div className="h-12 w-24 md:w-44 ">
            <PrimaryBtn
              text={level === 0 ? "بعدی" : "ثبت"}
              onClick={level === 0 ? () => setLevel(1) : () => submitHandler()}
              type="button"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HoursInput;
