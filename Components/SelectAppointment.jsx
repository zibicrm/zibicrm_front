import { useState } from "react";
import moment from "jalali-moment";
import PageLoading from "../utils/LoadingPage";
import { BsArrowReturnLeft, BsCalendarWeekFill } from "react-icons/bs";
import OutlineBtn from "../common/OutlineBtn";

const SelectAppoitment = ({
  select,
  allTimes,
  status,
  reserve,
  setReserve,
  back,
  setSelect,
  setSelectShow,
}) => {
  let nowDay = moment(moment.now()).format("YYYY-MM-DD");

  const convertTime = (time) => {
    let jalalydate = moment(time.dateOfDay).locale("fa").format("DD MMMM YYYY");
    let day = convertDay(time.day);
    let final = day + " " + String(jalalydate);
    return final;
  };
  const checkInclude = (time) => {
    const include = allTimes.reserveAppointments.includes(time);
    if (include) {
      return true;
    } else return false;
  };
  const convertDay = (day) => {
    switch (day) {
      case "Saturday":
        return "شنبه";
      case "Sunday":
        return "یکشنبه";
      case "Monday":
        return "دوشنبه";
      case "Tuesday":
        return "سه شنبه";
      case "Wednesday":
        return "چهارشنبه";
      case "Thursday":
        return "پنج شنبه";
      case "Friday":
        return "جمعه";
    }
  };
  return (
    <div className="flex flex-col items-center gap-3 h-full border-t lg:border-t-0 pt-2 lg:pt-0  md:pr-6  w-full ">
      {select && status === 0 ? (
        <>
          {back ? (
            <div className="flex flex-row items-center justify-center w-full relative">
              <div className="w-64 h-12">
                <OutlineBtn
                  text={convertTime(select)}
                  onClick={() => {
                    setSelect(null), setSelectShow(nowDay);
                  }}
                >
                  <span className="mr-2 block">
                    <BsCalendarWeekFill />
                  </span>
                </OutlineBtn>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelect(null), setSelectShow(nowDay);
                }}
                className="text-primary-700 text-2xl absolute left-0"
              >
                <BsArrowReturnLeft />
              </button>
            </div>
          ) : (
            <span className="md:text-base min-w-fit">
              {convertTime(select)}
            </span>
          )}
          <div className="grid grid-cols-4  gap-y-4 w-full justify-items-center  overflow-y-auto pt-2 border-t border-pastelRed-800">
            {allTimes &&
            allTimes.AppointmentTable &&
            allTimes.AppointmentTable.length ? (
              allTimes.AppointmentTable.map((item, index) => (
                <button
                  key={index}
                  className={`border text-gray-900 border-primary-700  rounded-cs flex items-center justify-center w-12 md:w-20 lg:w-24 h-12 duration-300 hover:text-white hover:bg-primary-700 text-sm md:text-base disabled:bg-gray-200 disabled:bg-opacity-20 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    item === reserve
                      ? "bg-primary-900 text-white"
                      : "bg-primary-100"
                  }`}
                  disabled={checkInclude(item)}
                  type="button"
                  onClick={() => setReserve(item)}
                >
                  {item}
                </button>
              ))
            ) : (
              <div className="w-full col-span-4 h-full flex items-center justify-center  pt-2 text-primary-900">
                <span className="mt-36 w-full flex items-center justify-center h-24">
                  داده ای یافت نشد
                </span>
              </div>
            )}
          </div>
        </>
      ) : null}
      {status === 1 ? (
        <div className="w-full min-h-[400px] relative h-full  flex items-center justify-center">
          <PageLoading />
        </div>
      ) : null}
    </div>
  );
};

export default SelectAppoitment;
