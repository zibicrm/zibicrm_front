import React, { useEffect, useState } from "react";
import PrimaryBtn from "../common/PrimaryBtn";
import { CloseBtn } from "../common/CloseBtn";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePicker from "react-multi-date-picker";
import moment from "jalali-moment";
const RangePicker = ({
  calendar,
  setCalendar,
  start,
  setStart,
  end,
  setEnd,
}) => {
  const [valueCalendar, setValueCalendar] = useState({ format: "DD/MM/YYYY" });
  const [error, setError] = useState(false);
  const [showStart, setShowStart] = useState(start ? moment(start).locale("fa").format("YYYY/MM/DD") : null);
  const [showEnd, setShowEnd] = useState(end ? moment(end).locale("fa").format("YYYY/MM/DD") : null);
  let nowDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");


  const convert = (date, format = valueCalendar.format) => {
    let object = { date, format };
    if (date) {
      setValueCalendar({
        date: date.toDate(),
      });
      setShowStart(moment(date.toDate()).locale("fa").format("YYYY/MM/DD"));
      setStart(moment(date.toDate()).format("YYYY-MM-DD"));
    } else {
      setValueCalendar({ date: "" });
    }
  };
  const convertEnd = (date, format = valueCalendar.format) => {
    let object = { date, format };
    if (date) {
      setValueCalendar({
        date: date.toDate(),
      });
      setShowEnd(moment(date.toDate()).locale("fa").format("YYYY/MM/DD"));
      setEnd(moment(date.toDate()).format("YYYY-MM-DD"));
    } else {
      setValueCalendar({ date: "" });
    }
  };
  const test = () => {
    if (
      moment.from(start, "fa", "YYYY/MM/DD").format("YYYY/MM/DD") >
      moment.from(end, "fa", "YYYY/MM/DD").format("YYYY/MM/DD")
    ) {
      setError(true);
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    if (start && end) {
      test();
    }
  }, [start, end]);
  return (
    <div className="w-fit rounded-cs relative bg-white p-6 flex flex-col items-start justify-center gap-8">
      <h1>انتخاب بازه زمانی</h1>
      <div className="flex flex-row items-start gap-9">
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-3">
            <span>از</span>
            <div
              style={{ direction: "rtl" }}
              className={`hidden md:block h-[42px]   md:h-12 input-controll relative  `}
            >
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                // disabled={disabled}
                calendarPosition="bottom-right"
                maxDate={nowDay}
                // animations={[opacity(), transition({ from: 35, duration: 800 })]}
                render={<InputIcon />}
                className={`text-primary-700`}
                inputClass={`custom-input`}
                onChange={convert}
                id={"rangePicker"}
                onOpen={() => {
                  setCalendar(true);
                }}
                onClose={() => {
                  // setCalendar(false);
                }}
                value={showStart}
              />

              {/* {!isShow && !value.date && (
                <label
                  htmlFor={name}
                  className={`absolute text-xs md:text-sm right-5 top-4 text-gray-900  ${
                    disabled &&
                    "cursor-not-allowed bg-gray-100 border-gray-200 hover:shadow-none"
                  }`}
                >
                  {label}{" "}
                </label>
              )} */}
            </div>
          </div>
          <span className="md:text-xs text-[10px] text-red-300 mt-1.5">
            {error ? "بازه زمانی اشتباه است" : ""}
          </span>
        </div>
        <div className="flex flex-row items-center gap-3">
          <span>تا</span>
          <div
            style={{ direction: "rtl" }}
            className={`hidden md:block h-[42px]   md:h-12 input-controll relative  `}
          >
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              maxDate={nowDay}
              render={<InputIcon />}
              className={`text-primary-700`}
              inputClass={`custom-input`}
              onChange={convertEnd}
              id={"rangePicker"}
              value={showEnd}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end w-full">
        <div className="h-12 w-64">
          <PrimaryBtn
            disabled={error || !start || !end}
            text="ثبت"
            onClick={() => setCalendar(false)}
          />
        </div>
      </div>
      <CloseBtn
        onClick={() => {
          setCalendar(false);
          // setStart(null);
          // setEnd(null);
        }}
      />
    </div>
  );
};

export default RangePicker;
