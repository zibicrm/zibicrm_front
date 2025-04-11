import { all } from "axios";
import moment from "jalali-moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MdCalendarToday } from "react-icons/md";
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
import { reportUserImplant } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const ImplantReport = ({}) => {
  const { user, loading } = useAuth();
  const [implantChartData, setImplantChartData] = useState(null);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [allCount, setAllCount] = useState(null);
  const [getDataStatus, setDataStatus] = useState(0);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const getData = (firstLoad) => {
    setDataStatus(1);
    reportUserImplant(
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
      { Authorization: "Bearer " + user.token }
    )
      .then(({ data }) => {
        if (data.status === false) {
        } else {
          let finallData = [];
          for (let key in data.result) {
            let secondArray = data.result[key];
            finallData.push({
              uName: key,
              count: secondArray.count,
              sum: secondArray.sum,
              color: secondArray.color,
            });
          }
          let res = finallData.filter((item) => item.uName !== "count_all");

          setAllCount(String(data.result.count_all));
          setImplantChartData(res);
        }
        setDataStatus(0);
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
        setDataStatus(0);
      });
  };
  const ImplantTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-fit flex flex-row items-center justify-between gap-3 h-fit py-2 bg-gray-900 bg-opacity-70 text-gray-200 font-normal text-xs border-none rounded p-2">
          <p className=" text-right">{payload[0].payload.uName}</p>
          <p className="mb-0">تعداد : {payload[0].payload.count}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (user && !loading) {
      getData(true);
    }
  }, [loading]);
  useEffect(() => {
    if (user && !loading && start && end && !calendar) {
      getData(false);
    }
  }, [calendar]);
  return (
    <div className="flex flex-col gap-4 items-center  my-6 p-6 w-full h-full bg-white rounded">
      <div className=" w-full flex flex-row justify-between mt-3 mb-1 ">
        <h1 className="text-sm text-gray-900">تعداد ایمپلنت</h1>
        <div className="flex flex-row-reverse justify-between  ">
          {allCount &&
            Array(allCount.length)
              .fill()
              .map((item, index) => (
                <span
                  key={index}
                  className=" flex items-center text-gray-900 justify-center w-9 h-8 bg-primary-50 text-center rounded m-1 "
                >
                  {allCount[index]}
                </span>
              ))}
        </div>
        <div
          className="h-9 w-24 "
          onClick={() => {
            setCalendar(true);
          }}
        >
          <PrimaryBtn text="تقویم">
            <span className="block mr-1  mb-1 ">
              <MdCalendarToday />
            </span>
          </PrimaryBtn>
        </div>
      </div>
      <div className="w-full relative h-[400px]">
        {getDataStatus === 0 ? (
          implantChartData &&
          implantChartData.length && (
            <ResponsiveContainer width="105%" height="100%">
              <BarChart
                width={800}
                height={500}
                data={implantChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="uName"
                  tick={{ fontSize: 12 }}
                  angle={280}
                  interval={0}
                  tickMargin={35}
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} tickMargin={25} />
                <Tooltip
                  content={ImplantTooltip}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  label={{ position: "top" }}
                  barSize={20}
                  radius={[20, 20, 0, 0]}
                >
                  {implantChartData &&
                    implantChartData.map((entry, index) => {
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color ? entry.color : "#ccc"}
                      />;
                    })}
                </Bar>
                <ReferenceLine
                  y={allCount / implantChartData.length}
                  label={Math.floor(allCount / implantChartData.length)}
                  stroke="#4267B3"
                  strokeDasharray="3 3"
                  x={500}
                  XAxis={500}
                />
              </BarChart>
            </ResponsiveContainer>
          )
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

export { ImplantReport };
