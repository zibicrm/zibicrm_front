import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import Modal from "../Modal";
import RangePicker from "../RangePicker";
import { MdCalendarToday } from "react-icons/md";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useState } from "react";

const data = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: "Page C",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: "Page D",
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: "Page E",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: "Page F",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
];

const ImplantPatient = () => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  return (
    <div className="flex flex-col gap-4 items-center  my-6 p-6 w-full h-full bg-white rounded">
      <div className=" w-full flex flex-row justify-between mt-3 mb-1 ">
        <h1 className="text-sm text-gray-900">تعداد ایمپلنت</h1>
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
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="name"
              scale="band"
              tick={{ fontSize: 12 }}
              angle={280}
              interval={0}
              tickMargin={35}
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} tickMargin={25} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="amt"
              fill="#8884d8"
              stroke="#8884d8"
            />
            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
          </ComposedChart>
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

export default ImplantPatient;
