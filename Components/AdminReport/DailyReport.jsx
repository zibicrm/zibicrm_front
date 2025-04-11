import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  MdCalendarToday,
  MdCallMade,
  MdCallReceived,
  MdOutlineLibraryBooks,
  MdOutlineMedicalServices,
  MdSchedule,
} from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportUserDailySupplierService } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";
import { toast } from "react-toastify";

const DailyReport = ({ userList }) => {
  const { user, loading } = useAuth();
  const [dailyStatus, setDaily] = useState(0);
  const [dailyReport, setDailyReport] = useState(null);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  let yesteday = moment(moment().add(-1, "days")).format("YYYY-MM-DD");
  let nowDay = moment(moment.now()).format("YYYY-MM-DD");

  const getReportDaily = (firstLoad) => {
    setDaily(1);
    reportUserDailySupplierService(
      {
        start: firstLoad ? nowDay : start,
        end: firstLoad ? nowDay : end,
        user_id: selectedUser,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setDailyReport([]);
        } else {
          setDailyReport(data.result);
        }
        setDaily(0);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          userDispatch({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message);
        }
        setDaily(0);
      });
  };

  useEffect(() => {
    if(user){
      if(!start && !end){
        getReportDaily(true)
      } else {
        getReportDaily(false)
      }

    }
  }, [loading,selectedUser,calendar]);

  // useEffect(() => {
  //   if (
  //     !start &&
  //     !end &&
  //     !calendar &&
  //     userList &&
  //     userList.length
  //   ) {
  //     getReportDaily(true);
  //   }
  // }, [loading]);
  // useEffect(() => {

  //   if (
  //     start &&
  //     end &&
  //     !calendar &&
  //     userList &&
  //     userList.length
  //   ) {

  //     getReportDaily(false);
  //   }
  //   if (
  //     !start &&
  //     !end &&
  //     !calendar &&
  //     userList &&
  //     userList.length
  //   ) {
  //     getReportDaily(true);
  //   }
  // }, [calendar, selectedUser]);
  const iconBoxList = [
    {
      id: 0,
      title: "تعداد مکالمات خروجی",
      icon: <MdCallReceived />,
      value: dailyReport && dailyReport.outgoing,
    },
    {
      id: 1,
      title: "تعداد مکالمات ورودی",
      icon: <MdCallMade />,
      value: dailyReport && dailyReport.incoming,
    },
    {
      id: 2,
      title: "تعداد پرونده ها",
      icon: <MdOutlineLibraryBooks />,
      value: dailyReport && dailyReport.document,
    },
    {
      id: 3,
      title: "تعداد وقایع",
      icon: <MdSchedule />,
      value: dailyReport && dailyReport.event,
    },
    {
      id: 4,
      title: "نوبت ویزیت",
      icon: (
        <div className="relative">
          <MdCalendarToday />
          <div className="text-[11px] text-primary-900 absolute  block right-1.5 top-2">
            <RiStethoscopeLine />
          </div>
        </div>
      ),
      value: dailyReport && dailyReport.appointment,
    },
    {
      id: 5,
      title: "نوبت جراحی",
      icon: (
        <div className="relative">
          <MdCalendarToday />
          <div className="text-[11px]  absolute right-1.5 top-2 block ">
            <MdOutlineMedicalServices />
          </div>
        </div>
      ),
      value: dailyReport && dailyReport.appointment_surgery,
    },
  ];
  return (
    <div className=" w-full h-full flex flex-col gap-6 ">
      <div className="flex flex-row justify-between items-center w-full ">
        <span className="text-gray-900">گزارشات روزانه</span>
        <div className="flex flex-row items-center gap-2">
          <FilterBtn
            label="کاربر"
            name="user"
            selectOption={[{ id: null, name: "همه" }, ...userList]}
            labelOption="name"
            valueOption="id"
            onChange={(e) => {
              setSelectedUser(e.id);
            }}
          />
          <div className="h-10 w-24 ">
            <PrimaryBtn
              text="تقویم"
              onClick={() => {
                setCalendar(true);
                // setType(0);

                // setUserListId(userList.id)
              }}
            >
              <span className="block mr-1  mb-1">
                <MdCalendarToday />
              </span>
            </PrimaryBtn>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 w-full relative min-h-[300px] gap-6 items-center justify-items-center text-primary-900 ">
        {dailyStatus === 0 ? (
          iconBoxList.map((item) => (
            <button
              key={item.id}
              className=" w-full cursor-default py-5 max-h-40  px-4 iconBox  bg-white border-none shadow-cs border border-primary-900 rounded-cs  hover:shadow-btn  flex flex-col items-center gap-4"
            >
              <div className=" rounded-full  min-w-[48px] w-12 min-h-[48px] h-12 bg-primary-50 text-2xl flex items-center justify-center duration-300">
                {item.icon}
              </div>
              <span className=" text-sm">{item.title}</span>
              <span> {item.value}</span>
            </button>
          ))
        ) : (
          <PageLoading />
        )}
      </div>
      {calendar ? (
        <Modal>
          <RangePicker
            end={end}
            setEnd={setEnd}
            setStart={setStart}
            start={start}
            calendar={calendar}
            setCalendar={setCalendar}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default DailyReport;
