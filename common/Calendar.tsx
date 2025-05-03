import moment from "jalali-moment";
import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IoThermometer } from "react-icons/io5";
import calendarData from "../data/CalendarData";
export type ICalendarProps = {
  days: any;
  select: any;
  setSelect: any;
  setSlectShow?: any;
  vip?: boolean;
};

const Calendar: React.FC<ICalendarProps> = ({
  days,
  select,
  setSelect,
  setSlectShow,
  vip,
}) => {
  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(1401);
  const [day, setDay] = useState(0);
  const [nowDay, setNowDay] = useState<number>(0);
  let s = moment.now();

  let nowMonth = moment(s).locale("fa").format("MM");
  let nowYear = moment(s).locale("fa").format("YYYY");
  useEffect(() => {
    setMonth(Number(nowMonth));
    setYear(Number(nowYear));
    if (month === Number(nowMonth)) {
      let nowDay: any = moment(s).locale("fa").format("DD");
      setNowDay(nowDay);
    } else {
      setNowDay(0);
    }
  }, []);
  const filterDay = (name: any, id: number, holiday: boolean) => {
    let d: any = calendarData?.[year]?.[month as keyof typeof calendarData]?.filter(
      (item) => item.id === id
    )[0];

    if (vip === true) {
      return true;
    } else {
      //days===>doctors days and name=====>name of week (sunday monday...)
      if (
        d &&
        Number(d.id) >= Number(nowDay) &&
        days.includes(name) &&
        !holiday
      ) {
        return true;
      } else {
        return false;
      }
    }
  };
  const nextMonth = () => {
    if (year === 1402 && month === 12) {
      null;
    } else if (month < 12) {
      setSelect(null);
      setMonth(month + 1);
    } else if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      null;
    }
  };
  const prevMonth = () => {
    if (year === 1401 && month === 1) {
      null;
    } else if (month > 1) {

      setSelect(null);
      setMonth(month - 1);
    } else if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      null;
    }
  };
  const setDate = (date: any, day: any, disabled: any, holiday: boolean) => {
    let fullDate = year + "/" + month + "/" + date;

    let miladi = moment.from(fullDate, "fa", "YYYY/MM/DD").format("YYYY-MM-DD");
    if (!disabled && filterDay(day, date, holiday)) {
      setSelect({ day: day, dateOfDay: miladi });
      setSlectShow && setSlectShow(miladi);
    } else {
      setSlectShow && setSlectShow(miladi);
    }
  };
  useEffect(() => {
    if (select) {
      let day: any = moment(select.dateOfDay).locale("fa").format("DD");
      setDay(day);
    }
  }, [select]);
  useEffect(() => {
    if (month === Number(nowMonth)) {
      let nowDay: any = moment(s).locale("fa").format("DD");
      setNowDay(nowDay);
    } else {
      setNowDay(0);
    }
  }, [month]);

  return (
    <div className="w-full ">
      <div className="flex flex-row items-center justify-between border-b border-pastelRed-800 pb-3">
        <button
          onClick={prevMonth}
          type="button"
          className="bg-primary-100 text-gray-900 w-6 h-6 rounded-cs text-2xl"
        >
          <BsChevronRight />
        </button>
        <span className="text-bsae text-gray-900">
          {moment
            .from(`${year}/${month}/1`, "fa", "YYYY/MM/DD")
            .locale("fa")
            .format("MMMM YYYY")}
        </span>
        <button
          onClick={nextMonth}
          type="button"
          className="bg-primary-100 text-gray-900 w-6 h-6 rounded-cs text-2xl"
        >
          <BsChevronLeft />
        </button>
      </div>
      <div className="pt-2">
        <div className="grid grid-cols-7 text-sm text-gray-900">
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            ش
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            ی
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            د
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            س
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            چ
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            پ
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
            ج
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-6 mt-5  text-sm">
        {calendarData?.[year]?.[month as keyof typeof calendarData]?.map(
          (item: any) => (
            <button
              key={item.id}
              className={`w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 rounded-cs relative flex items-center justify-center   ${
                item.isDisable ? "text-white cursor-default" : ""
              }  ${item.isWeekend ? "text-red-400" : ""} ${
                item.isHoliday ? "text-red-400" : ""
              } ${
                !item.isHoliday &&
                !item.isDisable &&
                !item.isWeekend &&
                !filterDay(item.name, item.id, item.isHoliday)
                  ? "text-gray-400"
                  : ""
              } ${
                !item.isDisable &&
                filterDay(item.name, item.id, item.isHoliday) &&
                Number(day) !== Number(item.id)
                  ? "bg-primary-50 border text-gray-700 border-primary-900 rounded-cs text-b hover:shadow-btn cursor-pointer"
                  : ""
              } ${
                Number(day) == Number(item.id)
                  ? "bg-primary-900 text-white  "
                  : ""
              } ${
                Number(nowDay) == Number(item.id) &&
                Number(day) !== Number(item.id)
                  ? "bg-primary-500 text-white-important"
                  : ""
              }`}
              onClick={() =>
                setDate(item.id, item.name, item.disabled, item.holiday)
              }
              type="button"
              // disabled={!filterDay(item.name, item.id)}
            >
              {item.day}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;



// import moment from "jalali-moment"; 
// import React, { useEffect, useState } from "react";
// import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
// import { IoThermometer } from "react-icons/io5";
// import calendarData from "../data/CalendarData";
// export type ICalendarProps = {
//   days: any;
//   select: any;
//   setSelect: any;
//   setSlectShow?: any;
//   vip?: boolean;
// };

// const Calendar: React.FC<ICalendarProps> = ({
//   days,
//   select,
//   setSelect,
//   setSlectShow,
//   vip,
// }) => {
//   const [month, setMonth] = useState(9);
//   const [year, setYear] = useState(1401);
//   const [day, setDay] = useState(0);
//   const [nowDay, setNowDay] = useState<number>(0);
//   let s = moment.now();
//   let nowMonth = moment(s).locale("fa").format("MM");
//   let nowYear = moment(s).locale("fa").format("YYYY");
//   useEffect(() => {
//     setMonth(Number(nowMonth));
//     setYear(Number(nowYear));
//     if (month === Number(nowMonth)) {
//       let nowDay: any = moment(s).locale("fa").format("DD");
//       setNowDay(nowDay);
//     } else {
//       setNowDay(0);
//     }
//   }, []);
//   const filterDay = (name: any, id: number) => {
//     let d: any = calendarData[year][month as keyof typeof calendarData].filter(
//       (item) => item.id === id
//     )[0];
//     if (vip === true) {
//       return true;
//     } else {
//       if (d && Number(d.id) >= Number(nowDay) && days.includes(name)) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   };
//   const nextMonth = () => {
//     if (year === 1402 && month === 6) {
//       null;
//     } else if (month < 12) {
//       setSelect(null);
//       setMonth(month + 1);
//     } else if (month === 12) {
//       setYear(year + 1);
//       setMonth(1);
//     } else {
//       null;
//     }
//   };
//   const prevMonth = () => {
//     if (year === 1401 && month === 1) {
//       null;
//     } else if (month > 1) {
//       setSelect(null);
//       setMonth(month - 1);
//     } else if (month === 1) {
//       setYear(year - 1);
//       setMonth(12);
//     } else {
//       null;
//     }
//   };
//   const setDate = (date: any, day: any, disabled: any) => {
//     let fullDate = year + "/" + month + "/" + date;

//     let miladi = moment.from(fullDate, "fa", "YYYY/MM/DD").format("YYYY-MM-DD");
//     if (!disabled && filterDay(day, date)) {
//       setSelect({ day: day, dateOfDay: miladi });
//       setSlectShow && setSlectShow(miladi);
//     } else {
//       setSlectShow && setSlectShow(miladi);
//     }
//   };
//   useEffect(() => {
//     if (select) {
//       let day: any = moment(select.dateOfDay).locale("fa").format("DD");
//       setDay(day);
//     }
//   }, [select]);
//   useEffect(() => {
//     if (month === Number(nowMonth)) {
//       let nowDay: any = moment(s).locale("fa").format("DD");
//       setNowDay(nowDay);
//     } else {
//       setNowDay(0);
//     }
//   }, [month]);

//   return (
//     <div className="w-full ">
//       <div className="flex flex-row items-center justify-between border-b border-pastelRed-800 pb-3">
//         <button
//           onClick={prevMonth}
//           type="button"
//           className="bg-primary-100 text-gray-900 w-6 h-6 rounded-cs text-2xl"
//         >
//           <BsChevronRight />
//         </button>
//         <span className="text-bsae text-gray-900">
//           {moment
//             .from(`${year}/${month}/1`, "fa", "YYYY/MM/DD")
//             .locale("fa")
//             .format("MMMM YYYY")}
//         </span>
//         <button
//           onClick={nextMonth}
//           type="button"
//           className="bg-primary-100 text-gray-900 w-6 h-6 rounded-cs text-2xl"
//         >
//           <BsChevronLeft />
//         </button>
//       </div>
//       <div className="pt-2">
//         <div className="grid grid-cols-7 text-sm text-gray-900">
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             ش
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             ی
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             د
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             س
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             چ
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             پ
//           </div>
//           <div className="w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 bg-gray-100 bg-opacity-40 rounded-cs flex items-center justify-center">
//             ج
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-7 gap-y-6 mt-5  text-sm">
//         {calendarData[year][month as keyof typeof calendarData].map(
//           (item: any) => (
//             <button
//               key={item.id}
//               className={`w-6 h-6 md:w-8 md:h-8  lg:w-12 lg:h-12 rounded-cs relative flex items-center justify-center   ${
//                 item.isDisable ? "text-white cursor-default" : ""
//               }  ${item.isWeekend ? "text-red-400" : ""} ${
//                 item.isHoliday ? "text-red-400" : ""
//               } ${
//                 !item.isHoliday &&
//                 !item.isDisable &&
//                 !item.isWeekend &&
//                 !filterDay(item.name, item.id)
//                   ? "text-gray-400"
//                   : ""
//               } ${
//                 !item.isDisable &&
//                 filterDay(item.name, item.id) &&
//                 Number(day) !== Number(item.id)
//                   ? "bg-primary-50 border text-gray-700 border-primary-900 rounded-cs text-b hover:shadow-btn cursor-pointer"
//                   : ""
//               } ${
//                 Number(day) == Number(item.id)
//                   ? "bg-primary-900 text-white  "
//                   : ""
//               } ${
//                 Number(nowDay) == Number(item.id) &&
//                 Number(day) !== Number(item.id)
//                   ? "bg-primary-500 text-white-important"
//                   : ""
//               }`}
//               onClick={() => setDate(item.id, item.name, item.disabled)}
//               type="button"
//               // disabled={!filterDay(item.name, item.id)}
//             >
//               {item.day}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Calendar;
