import { MdCalendarToday } from "react-icons/md";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import PageLoading from "../../utils/LoadingPage";

import React from "react";
import { useState } from "react";
import { reportClinicAppointment } from "../../Services/reportServices";
import { useEffect } from "react";
import { useAuth } from "../../Provider/AuthProvider";
import RangePicker from "../RangePicker";
import Modal from "../Modal";
import { toast } from "react-toastify";
import moment from "jalali-moment";

const AppointmentClinicReport = ({}) => {
  const [visitStatus, setVisitStatus] = useState(false);
  const [visitData, setVisitData] = useState([]);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { user, loading } = useAuth();
  const [selectedChart, setSelectedChart] = useState(1);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const reportClinicAppointmentChart = (firstLoad) => {
    setVisitStatus(true);
    reportClinicAppointment(
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
        type_appointment: selectedChart,
      },
      { Authorization: "Bearer " + user.token }
    )
      .then(({ data }) => {
        if (data.status === false) {
        } else {
          let stateData = [];
          let finalData = [];
          for (let obj in data.result) {
            if (obj === "1") {
              let pasdaranData = data.result[1];

              for (let key in pasdaranData) {
                stateData.push({
                  date: key,
                  countp: pasdaranData[key].length,
                });
              }
            } else if (obj === "3") {
              let zafarData = data.result[3];
              for (let key in zafarData) {
                let found = stateData.find((c) => c.date === key);
                if (found) {
                  found = { ...found, countz: zafarData[key].length };
                  finalData.push(found);
                } else {
                  finalData.push({ date: key, countz: zafarData[key].length });
                }
              }
            }
            for (let key in finalData) {
              finalData[key] = {
                ...finalData[key],
                date: moment(finalData[key].date)
                  .locale("fa")
                  .format("YYYY/MM/DD"),
              };
            }
            setVisitData(finalData);
          }
      
        }
        setVisitStatus(false);
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
        setVisitStatus(false);
      });
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
  const visitSelectOption = [
    { id: "1", name: "ویزیت" },
    { id: "2", name: "جراحی" },
  ];

  const ClinicsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] bg-gray-900 text-gray-900 bg-opacity-70 text-gray-200 font-normal text-xs border-none rounded p-2">
          <p className=" text-right border-b-2 border-dotted p-1 h-1/2 flex justify-between">
            <span>{payload[0].payload.countp}</span> <span>پاسداران</span>
          </p>
          <p className=" text-right  p-1 h-1/2 flex justify-between">
            <span>{payload[0].payload.countz}</span>
            <span>ظفر</span>
          </p>
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    if (user && !loading && start && end && !calendar) {
      reportClinicAppointmentChart(false);
    }
  }, [calendar]);
  useEffect(() => {
    if (user && !loading && !start && !end) {
      reportClinicAppointmentChart(true);
    }
  }, [loading, selectedChart]);
  return (
    <div className="w-full p-6 bg-white flex flex-col gap-4 rounded">
      <div className="flex flex-row justify-between items-center w-full ">
        <span className="text-gray-900">نوبت ها</span>
        <div className="flex flex-row items-center gap-2 ">
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
          <div className="h-10 w-26">
            <FilterBtn
              label="ویزیت"
              name="user"
              selectOption={visitSelectOption}
              labelOption="name"
              valueOption="id"
              onChange={(e) => {
                setSelectedChart(e.id);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[800px] ltr relative">
        {!visitStatus ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={visitData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
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
              <XAxis
                dataKey="date"
                interval={0}
                fontSize="10"
                tickMargin={35}
                padding={{ left: 20, right: 20 }}
                angle={280}
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                // label={{
                //   value: "تعداد ویزیت",
                //   angle: -90,
                //   position: "top",
                //   fontSize: 10,
                //   offset: "-30",
                //   dx: -35,
                // }}
                fontSize="10"
              />
              <Tooltip content={<ClinicsTooltip />} />

              <Line
                dataKey="countz"
                label="ظفر"
                stroke="#FDC353"
                activeDot={{ r: 8 }}
              />
              <Line
                dataKey="countp"
                label="پاسداران"
                stroke="#202F4F"
                activeDot={{ r: 8 }}
              />
            </LineChart>
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

export default AppointmentClinicReport;
