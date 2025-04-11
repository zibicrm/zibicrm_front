import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { IoCalendarSharp } from "react-icons/io5";
import HoursInput from "./HoursInput";

const SetAttendTime = ({ formik, name, setDays }) => {
  const [isOpen, setOpen] = useState(null);
  const [daySelected, setDaysSelected] = useState([]);
  const [level, setLevel] = useState(0);
  // const [days, setDays] = useState([]);

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
  useEffect(() => {
    setDays(timeFormik.values);
  }, [timeFormik.values]);
  const renderTime = (a) => {
    switch (a) {
      case "Saturday":
        return "شنبه ";
      case "Sunday":
        return "یکشنبه ";
      case "Monday":
        return "دوشنبه ";
      case "Tuesday":
        return "سه شنبه ";
      case "Wednesday":
        return "چهارشنبه ";
      case "Thursday":
        return "پنجشنبه ";
      case "Friday":
        return "جمعه ";
      default:
    }
  };
  return (
    <>
      <div
        className={`pt-3 pb-2 flex items-center relative cursor-pointer justify-start w-full px-4 h-[42px] md:h-12 mt-0 border rounded-cs  autofill:bg-primary-100 appearance-none focus:outline-none focus:ring-0 focus:bg-primary-100  ${
          formik.errors[name] && formik.touched[name]
            ? "shadow-err border-red-300 hover:shadow-err"
            : "hover:shadow-btn border-primary-400 hover:border-primary-300 focus:border-primary-300"
        }`}
        onClick={() => setOpen(true)}
      >
        {daySelected.length > 0 ? (
          <span className="text-primary-700 text-xs md:text-base absolute  right-5">
            {daySelected.map((e) => {
              return renderTime(e);
            })}
          </span>
        ) : null}
        {daySelected.length > 0 ? null : (
          <span className="text-gray-400 text-xs md:text-sm absolute top-4  right-5">
            روزهای حضور در مجموعه
          </span>
        )}
        <span className="text-gray-400 text-xl absolute top-3 left-5">
          <IoCalendarSharp />
        </span>
      </div>
      {isOpen ? (
        <HoursInput
          daySelected={daySelected}
          setDays={setDaysSelected}
          level={level}
          setLevel={setLevel}
          setOpen={(e) => setOpen(e)}
          formik={timeFormik}
        />
      ) : null}
    </>
  );
};

export default SetAttendTime;
