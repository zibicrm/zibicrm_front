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
  Bar,
  BarChart,
} from "recharts";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import PageLoading from "../../utils/LoadingPage";

import React from "react";
import { useState } from "react";

import { useEffect } from "react";
import { useAuth } from "../../Provider/AuthProvider";
import RangePicker from "../RangePicker";
import Modal from "../Modal";
import { toast } from "react-toastify";
import moment from "jalali-moment";

const ChecksComponent = ({}) => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState(1);
  const [checksData, setChecksdata] = useState(null);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");

  const visitSelectOption = [
    { id: "1", name: "دریافتی" },
    { id: "2", name: "پرداختی" },
  ];
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
      tst: 46677,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
      tst: 46677,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
      tst: 46677,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
      tst: 46677,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
      tst: 46677,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
      tst: 46677,
    },
  ];
  const [showChart,setShowChart]=useState(false)
  const cheksStatus = (firstLoad) => {
    setShowChart(true);
  };
  
  useEffect(() => {
  }, [loading]);
  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedType) {
      cheksStatus(true);
    }
    if (user && !loading && start && end && !calendar && selectedType) {
      cheksStatus(false);
    }
  }, [selectedType]);



  useEffect(() => {
    if (user && !loading && !start && !end && !calendar && selectedType) {
      cheksStatus(true);
    }
    if (user && !loading && start && end && !calendar && selectedType) {
      cheksStatus(false);
    }
  }, [calendar]);

  return (
    <div className="w-full p-6 bg-white flex flex-col gap-4 rounded">
      <div className="flex flex-row justify-between items-center w-full ">
        <span> چک ها</span>
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
              label="دریافتی"
              name="user"
              selectOption={visitSelectOption}
              labelOption="name"
              valueOption="id"
              onChange={(e) => {
                setSelectedType(e.id);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[800px] ltr relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            // data={checksData}
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
              // content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              layout="horizontal"
              height={250}
              iconType="plainline"
              // content={renderLegend}
              iconSize={12}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              wrapperStyle={{ maxHeight: "5%", overflow: "auto" }}
            />
            <Bar
              dataKey="pv"
              name="چک های برگشتی"
              stackId="a"
              fill="#540B0E"
              barSize={20}
              fillRule
              stroke="white"
              strokeWidth={2}
            
              style={{ transform: "translate(0,-2px)" }}
            />
            <Bar
              dataKey="uv"
              name="چک های خرج شده"
              stackId="a"
              fill="#9E171D"
              barSize={20}
              fillRule
              stroke="white"
              strokeWidth={2}
           
              style={{ transform: "translate(0,-2px)" }}
            />
            <Bar
              dataKey="amt"
              name="چک های وصول شده"
              stackId="a"
              fill="#DB766A"
              barSize={20}
              fillRule
              stroke="white"
              strokeWidth={2}
             
              style={{ transform: "translate(0,-2px)" }}
            />
            <Bar
              dataKey="tst"
              name="اسناد دریافتی"
              stackId="a"
              fill="#F1D7D8"
              barSize={20}
              fillRule
              stroke="white"
              strokeWidth={2}
              
              style={{ transform: "translate(0,-2px)" }}
            />
          </BarChart>
        </ResponsiveContainer>
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

export default ChecksComponent;
