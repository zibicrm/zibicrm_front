import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { Calendar } from "react-multi-date-picker";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import {
  reportCompareSupplierAppointmentService,
  reportCompareSupplierAppointmentSurgery,
} from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";
import Tabs from "../Tabs";

const PorsantReport = ({}) => {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState(0);
  const [compareStatus, setCompareStatus] = useState(0);
  const [dataCompareSuplier, setDataCompareSuplier] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [calendar, setCalendar] = useState(false);
  const [allCount, setAllCount] = useState(null);

  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const getCompareSupplierAppointment = (firstLoad) => {
    if (tab === 0) {
      setCompareStatus(1);
      reportCompareSupplierAppointmentService(
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
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setDataCompareSuplier([]);
          } else {
            let finalData = [];
            data.result.map((item) => {
              finalData.push({
                name: item.last_name,
                count: item.appointment_count,
                color: item.color,
              });
            });
            let a = 0;
            finalData.map((i) => {
              if (Number(i.count) >= 0) {
                a = Number(i.count) + Number(a);
              }
            });
            setAllCount(a);
            setDataCompareSuplier(finalData);
          }
          setCompareStatus(0);
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
          setCompareStatus(0);
        });
    } else {
      setCompareStatus(1);
      reportCompareSupplierAppointmentSurgery(
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
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setDataCompareSuplier([]);
          } else {
            let finalData = [];
            data.result.map((item) => {
              finalData.push({
                name: item.last_name,
                count: item.appointment_surgery_count,
                color: item.color,
              });
            });
            let a = 0;
            finalData.map((i) => {
              if (Number(i.count) >= 0) {
                a = Number(i.count) + Number(a);
              }
            });
            setAllCount(a);
            setDataCompareSuplier(finalData);
          }
          setCompareStatus(0);
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
          setCompareStatus(0);
        });
    }
  };
  const VisitTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] flex flex-col items-end bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          <p className=" text-right flex flex-row justify-end border-b-2 border-dotted p-1 h-1/2 w-full">
            <span>{payload[0].payload.name}</span>
          </p>
          <div className="flex justify-between mt-2 p-1">
            تعداد : {payload[0].payload.count}
          </div>
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 0, text: "ویزیت" },
    { id: 1, text: "جراحی" },
  ];
  useEffect(() => {
    if (user && !loading && !start && !end) {
      getCompareSupplierAppointment(true);
    }
    if (user && !loading && start && end) {
      getCompareSupplierAppointment(false);
    }
  }, [tab]);
  useEffect(() => {
    if (user && !loading && !start && !end) {
      getCompareSupplierAppointment(true);
    }
  }, [loading]);
  useEffect(() => {
    if (user && !loading && start && end && !calendar) {
      getCompareSupplierAppointment(false);
    }
  }, [calendar]);
  return (
    <div className="w-full bg-white rounded-cs px-6 py-4 flex flex-col items-center gap-6">
      <div className="flex flex-row justify-between items-center w-full ">
        <div className="flex flex-row items-center gap-2 ">
          <span className="text-gray-900"> مقایسه کاربران</span>
          <div>
            <Tabs options={tabs} setTab={setTab} tab={tab} />
          </div>
        </div>
        <div className="h-10 w-24 ">
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
      </div>
      <div className="w-full h-[600px] ltr flex items-center justify-end">
        {compareStatus === 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={150} height={40} data={dataCompareSuplier}>
              <XAxis
                dataKey="name"
                angle={285}
                interval={0}
                tickMargin={40}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />

              <Tooltip cursor={false} content={<VisitTooltip />} />

              <YAxis tick={{ fontSize: 12 }} />
              <Bar
                dataKey="count"
                fill="#8884d8"
                minPointSize={5}
                radius={[24, 24, 0, 0]}
              >
                {dataCompareSuplier.map((entry, index) => (
                  <Cell
                    cursor="pointer"
                    fill={entry.color}
                    key={`cell-${index}`}
                  />
                ))}
                {/* <LabelList
                      dataKey="name"
                      content={renderCustomizedLabel}
                      position="top"
                    /> */}
              </Bar>
              <ReferenceLine
                y={allCount / dataCompareSuplier.length}
                label={Math.floor(allCount / dataCompareSuplier.length)}
                stroke="#4267B3"
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full relative h-96">
            <PageLoading />
          </div>
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

export default PorsantReport;
