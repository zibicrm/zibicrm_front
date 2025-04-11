import moment from "jalali-moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdOutlineAssignment,
  MdOutlineFeaturedPlayList,
  MdOutlineLibraryBooks,
  MdOutlineMedicalServices,
  MdOutlinePriceChange,
  MdOutlineReceipt,
} from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";
import { toast } from "react-toastify";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import { useAuth } from "../../Provider/AuthProvider";
import { reportClinicDaily } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const DailyClinicReport = ({ clinicList }) => {
  const [daillyReportStatus, setDaillyReportStatus] = useState(false);
  const [daillyReport, setDaillyReport] = useState(null);
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(3);

  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const getDailyReport = (firstLoad) => {
    setDaillyReportStatus(true);
    reportClinicDaily(
      {
        start: firstLoad
          ? moment
              .from(firstDay, "fa", "YYYY-MM-DD")
              .locale("en")
              .format("YYYY-MM-DD")
          : start,
        end: firstLoad
          ? moment
              .from(lastDay, "fa", "YYYY-MM-DD")
              .locale("en")
              .format("YYYY-MM-DD")
          : end,
        clinic_id: selectedClinic,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
        } else {
          setDaillyReport(data.result);
        }

        setDaillyReportStatus(false);
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
        setDaillyReportStatus(false);
      });
  };

  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedClinic) {
      getDailyReport(true);
    }
  }, [loading]);
  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedClinic) {
      getDailyReport(true);
    }
    if (user && !loading && start && end && !calendar && selectedClinic) {
      getDailyReport(false);
    }
  }, [selectedClinic]);
  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedClinic) {
      getDailyReport(true);
    }
    if (user && !loading && start && end && !calendar && selectedClinic) {
      getDailyReport(false);
    }
  }, [calendar]);
  return (
    <div className=" w-full relative min-h-[450px] h-full px-6 py-4 bg-white flex flex-col justify-start gap-5 rounded">
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row  text-sm md:text-base lg:text-lg justify-items-center sm:justify-items-center md:justify-between  lg:justify-between items-center w-full  ">
        <span className="text-gray-900 ">گزارشات روزانه</span>
        <div className="flex flex-row items-center gap-3">
          <div className="h-10 w-24">
            <PrimaryBtn
              text="تقویم"
              onClick={() => {
                setCalendar(true);
              }}
            >
              <span className="block mr-1  mb-1">
                <MdCalendarToday />
              </span>
            </PrimaryBtn>
          </div>
          {clinicList && clinicList.length ? (
            <FilterBtn
              label={"ظفر"}
              name="clinic"
              selectOption={clinicList}
              labelOption="title"
              valueOption="id"
              onChange={(e) => setSelectedClinic(e.id)}
            />
          ) : null}
        </div>
      </div>

      {!daillyReportStatus ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-6 lg:gap-6 xl:gap-6 items-center justify-items-center text-base text-primary-900 relative">
          <div className=" w-full py-5 h-40  px-4 mx-4 iconBox   bg-white border-none shadow-cs border-primary-900 rounded-cs  hover:shadow-btn flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              {/* <MdCalendarToday /> */}
              <div className="relative">
                <MdCalendarToday />
                <div className="text-[11px] text-primary-900 absolute  block right-1.5 top-2">
                  <RiStethoscopeLine />
                </div>
              </div>
            </div>
            <span className=" text-sm">نوبت ویزیت</span>
            <span>{daillyReport ? daillyReport.appointment : null}</span>
          </div>

          <div className=" w-full py-5 h-40 px-4 mx-4 iconBox   bg-white border-none shadow-cs border-primary-900 rounded-cs  hover:shadow-btn flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <div className="relative">
                <MdCalendarToday />
                <div className="text-[11px]  absolute right-1.5 top-2 block ">
                  <MdOutlineMedicalServices />
                </div>
              </div>
            </div>
            <span className=" text-sm">نوبت جراحی</span>
            <span>
              {daillyReport ? daillyReport.appointment_surgery : null}
            </span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white border-none shadow-cs border-primary-900 rounded-cs  hover:shadow-btn  flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <MdOutlineLibraryBooks />
            </div>
            <span className=" text-base">چک های دریافتی</span>
            <span className="text-center">
              تعداد {daillyReport ? daillyReport.receive.count : null} | قیمت{" "}
              {daillyReport
                ? CurrencyNum.format(daillyReport.receive.sum)
                : null}
            </span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white shadow-cs border-none border-primary-900  rounded-cs hover:shadow-btn  flex flex-col items-center gap-4 ">
            <div className="rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300 ">
              <div className="relative">
                <MdOutlineFeaturedPlayList />
                <div className="text-[11px] text-primary-900 absolute block text-base right-0 top-1.5">
                  <MdAttachMoney />
                </div>
              </div>
            </div>
            <span className=" text-sm"> چک های وصول شده</span>
            <span>
              تعداد {daillyReport && daillyReport.sale.count} | قیمت{" "}
              {daillyReport && CurrencyNum.format(daillyReport.sale.sum)}{" "}
            </span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white shadow-cs border-none border-primary-900  rounded-cs hover:shadow-btn  flex flex-col items-center gap-4">
            <div className="rotate-180 rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <MdOutlineLibraryBooks />
            </div>
            <span className="text-sm text-gray-900"> تعداد پرونده ها </span>
            <span> {daillyReport ? daillyReport.document : null}</span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white shadow-cs border-none border-primary-900  rounded-cs hover:shadow-btn flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <MdOutlineAssignment />
            </div>
            <span className=" text-sm">ثبت درمان</span>
            <span>{daillyReport ? daillyReport.treatment : null}</span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white  shadow-cs border-none border-primary-900  rounded-cs hover:shadow-btn flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <MdOutlineReceipt />
            </div>
            <span className=" text-sm">چک های خرج شده</span>
            <span>
              تعداد {daillyReport && daillyReport.cache.count} | قیمت{" "}
              {daillyReport && CurrencyNum.format(daillyReport.cache.sum)}{" "}
            </span>
          </div>

          <div className=" w-full py-5 h-40  px-4 iconBox   bg-white shadow-cs border-none border-primary-900  rounded-cs hover:shadow-btn flex flex-col items-center gap-4">
            <div className=" rounded-full w-12 h-12 min-h-[48px] min-w-[48px] bg-primary-50 text-2xl flex items-center justify-center duration-300">
              <MdOutlinePriceChange />
            </div>
            <span className="text-sm text-gray-900">چک های برگشتی</span>
            <span>
              {" "}
              تعداد {daillyReport && daillyReport.returned.count} | قیمت :
              {daillyReport && CurrencyNum.format(daillyReport.returned.sum)}{" "}
            </span>
          </div>
        </div>
      ) : (
        <PageLoading />
      )}
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

export default DailyClinicReport;
