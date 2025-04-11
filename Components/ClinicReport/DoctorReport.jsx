import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportClinicCompareDoctor } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const DoctorReport = ({ clinicList, setClinicList }) => {
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [test, setTest] = useState(0);
  const [compareStatus, setCompareStatus] = useState(false);
  const [compareDocs, setCompareDocs] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(1);
  const [randomClinic, setRandomClinic] = useState(null);

  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const docTest = [
    { id: 0, text: "ویزیت" },
    { id: 1, text: "جراحی" },
    { id: 2, text: "ثبت درمان  " },
  ];
  const compareDoctors = (firstLoad) => {
    setCompareStatus(true);
    reportClinicCompareDoctor(
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

          setCompareDocs(data.result);
        }
        setCompareStatus(false);
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
        setCompareStatus(false);
      });
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[200px] h-[70px] flex flex-col items-end bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          <p className=" text-left flex flex-row justify-between border-b-2 border-dotted p-1 h-1/2 w-full ">
            <span>ثبت درمان</span>
            <span>جراحی</span>
            <span>
              ویزیت
              
            </span>
          </p>
          <div className="flex flex-row-reverse justify-around mt-2 p-1 gap-10 ">
            <span> {payload[0].payload.appointment_count}</span>
            <span> {payload[0].payload.appointment_surgery_count}</span>

            <span> {payload[0].payload.treatment_count}</span>
          </div>
        </div>
      );
    }
    return null;
  };
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          direction: "rtl",
          gap: "1em",
        }}
      >
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-row items-center gap-1">
            <div
              className={`w-6 h-2 rounded-cs`}
              style={{ background: `${entry.color}` }}
            ></div>
            <div className="text-[12px] text-gray-900">
              {entry.payload.label}
            </div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    setTest(docTest[0]);
  }, [loading]);
  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedClinic) {
      compareDoctors(true);
    }
    if (user && !loading && start && end && !calendar && selectedClinic) {
      compareDoctors(false);
    }
  }, [selectedClinic]);

  useEffect(() => {
    if (clinicList && clinicList.length) {
      let random = Math.floor(Math.random() * clinicList.length);
      setSelectedClinic(clinicList[random].id);
      setRandomClinic(clinicList[random]);
    }
  }, [clinicList]);

  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedClinic) {
      compareDoctors(true);
    }
    if (user && !loading && start && end && !calendar && selectedClinic) {
      compareDoctors(false);
    }
  }, [calendar]);
  useEffect(() => {
    if (
      !start &&
      !end &&
      !calendar &&
      clinicList &&
      clinicList.length &&
      selectedClinic
    ) {
      compareDoctors(true);
    }
    if (
      start &&
      end &&
      !calendar &&
      clinicList &&
      clinicList.length &&
      selectedClinic
    ) {
      compareDoctors(false);
    }
  }, [selectedClinic]);

  return (
    <div className=" w-2/3 h-[597px] bg-white px-6 py-4 flex flex-col items-center gap-4 rounded">
      <div className="flex flex-row justify-between items-center w-full   ">
        <span className="text-gray-900"> سنجش پزشکان</span>
        <div className="flex flex-row items-center gap-3">
          <div
            className="h-10 w-24 "
            onClick={() => {
              setCalendar(true);
            }}
          >
            <PrimaryBtn text="تقویم">
              <span className="block mr-1  mb-1">
                <MdCalendarToday />
              </span>
            </PrimaryBtn>
          </div>
          {randomClinic && randomClinic.title && (
            <FilterBtn
              label={randomClinic.title}
              name="clinic"
              selectOption={clinicList}
              labelOption="title"
              valueOption="id"
              onChange={(e) => setSelectedClinic(e.id)}
            />
          )}
        </div>
      </div>

      <div className="w-full h-full ltr relative">
        {!compareStatus ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={compareDocs}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="5 5"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={285}
                interval={0}
                height={110}
                tickMargin={45}
                style={{ textAlign: "left" }}
                padding={{ left: 20, right: 20, bottom: 5 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                layout="horizontal"
                height={250}
                iconType="plainline"
                content={renderLegend}
                iconSize={28}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                wrapperStyle={{ maxHeight: "5%", overflow: "auto" }}
              />
              <Bar
                dataKey="appointment_count"
                stackId="a"
                fill="#202F4F"
                barSize={20}
                fillRule
                stroke="white"
                strokeWidth={2}
                label="ویزیت"
                style={{ transform: "translate(0,-2px)" }}
              />

              <Bar
                dataKey="appointment_surgery_count"
                stackId="a"
                fill="#FDC353"
                barSize={20}
                stroke="white"
                strokeWidth={2}
                label="جراحی"
                style={{ transform: "translate(0,-2px)" }}
              />

              <Bar
                dataKey="treatment_count"
                stackId="a"
                fill="#8977E8"
                barSize={20}
                stroke="white"
                strokeWidth={2}
                label="ثبت درمان"
                style={{ transform: "translate(0,-2px)" }}
              />
            </BarChart>
          </ResponsiveContainer>
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

export default DoctorReport;
