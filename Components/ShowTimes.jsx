import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const ShowTimes = ({ data, setOpen }) => {
  const [days, setDays] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selected, setSelect] = useState();
  useEffect(() => {
    let s = data.map((item) => {
      return item.day;
    });
    setSelectedDays(s);
  }, []);
  useEffect(() => {
    selectedDays[0] && setSelect(selectedDays[0]);
  }, [selectedDays]);
  const daysList = [
    { id: 1, value: "Saturday", label: "شنبه" },
    { id: 2, value: "Sunday", label: "یکشنبه" },
    { id: 3, value: "Monday", label: "دوشنبه" },
    { id: 4, value: "Tuesday", label: "سه شنبه" },
    { id: 5, value: "Wednesday", label: "چهارشنبه" },
    { id: 6, value: "Thursday", label: "پنجشنبه" },
    { id: 7, value: "Friday", label: "جمعه" },
  ];
  //   const changeHandler = (e: any) => {
  //     let filtered = selectedDays.filter((item: any) => item === e.target.value);
  //     if (!filtered.length) {
  //       setDays([...selectedDays, e.target.value]);
  //     }
  //     if (filtered.length) {
  //       let filter = selectedDays.filter((item: any) => item !== e.target.value);
  //       setDays(filter);
  //     }
  //   };
  const changeNameHandler = (day) => {
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
        return "پنجشنبه";
      case "Friday":
        return "جمعه";
      default:
        break;
    }
  };
  let filter = data.filter((item) => item.day == selected)[0];
  return (
    <div className="md:max-w-md bg-white rounded-cs max-w-[80vw]  flex z-50 flex-col items-center justify-start ">
      <div className="bg-primary-700  text-xl md:text-base rounded-b-[46px] rounded-t-cs px-16 py-3 md:py-6 text-white flex flex-col items-center justify-between w-full gap-4">
        <span>انتخاب روز</span>
        <div className="bg-white flex flex-row items-center gap-5 px-4 py-3 rounded-cs">
          {daysList.map((item) => (
            <button
              className={`w-9 h-9 rounded-full  flex items-center justify-center ${
                selected === item.value &&
                "bg-primary-700 text-white border-none"
              } ${
                selectedDays.includes(item.value) && selected !== item.value
                  ? "bg-white text-primary-700 border border-primary-700  cursor-pointers "
                  : "border border-gray-100 text-gray-100"
              }  `}
              onClick={() => {
                setSelect(item.value);
              }}
              disabled={!selectedDays.includes(item.value)}
              key={item.id}
              type="button"
            >
              {item.label.slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-row  h-fit w-full px-5 py-3 relative">
        <div className="flex flex-col w-full items-center gap-2">
          <span>{changeNameHandler(selected)}</span>
          <div className="flex flex-col h-full gap-2">
            {filter &&
              filter.times.map((t, index) => (
                <div key={index} className="flex flex-row gap-2 items-center ">
                  <div className="flex flex-row items-center gap-6 ">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-xs">از</span>
                      <div
                        className={`border-none  h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest 
                    }`}
                      >
                        {t.start.slice(0, 5)}
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-2">
                      <span className="text-xs">تا</span>
                      <div
                        className={`border-none  h-7 max-w-[68px]  outline-none md:w-24 md:h-7 w-11  text-[10px] md:text-xs bg-[#f5f5f5] md:px-3 md:py-2  rounded-cs tracking-widest 
                    }`}
                      >
                        {t.end.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button
        className="absolute top-4 left-4 text-xl p-1 z-[401] border border-white text-white rounded-full "
        onClick={() => setOpen(false)}
        type={"button"}
      >
        <IoCloseOutline />
      </button>
    </div>
  );
};

export default ShowTimes;
