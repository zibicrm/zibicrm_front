import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportDocumentCountService } from "../../Services/reportServices";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const PatientComponent = ({}) => {
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

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
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  useEffect(() => {
    //first load
    if (user && !loading && !start && !end) {
      reportDocumentCountService(
        {
          start: moment
            .from(firstDay, "fa", "YYYY-MM-DD")
            .locale("en")
            .format("YYYY-MM-DD"),
          end: moment
            .from(lastDay, "fa", "YYYY-MM-DD")
            .locale("en")
            .format("YYYY-MM-DD"),
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          //save data result into state
          if (data.status === false) {
          } else {
            let finalData = [];
            data.result.map((item) => {
              finalData.push({
                name: item.last_name,
                count: item.document_count,
                color: item.color,
              });
            });
            // setDocumentCount(finalData);
          }
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
        });
    }
  }, [loading]);
  useEffect(() => {
    //when calendar selected
    if (start && end && !calendar) {
      // reportDocumentCountService(
      //   {
      //     start: start,
      //     end: end,
      //   },
      //   {
      //     Authorization: "Bearer " + user.token,
      //   }
      // )
      //   .then(({ data }) => {
      //     if (data.status === false) {
      //     } else {
      //       let finalData = [];
      //       data.result.map((item) => {
      //         finalData.push({
      //           name: item.last_name,
      //           count: item.document_count,
      //           color: item.color,
      //         });
      //       });
      //       setDocumentCount(finalData);
      //     }
      //   })
      //   .catch((err) => {
      //     if (err.response && err.response.status === 401) {
      //       userDispatch({
      //         type: "LOGOUTNOTTOKEN",
      //       });
      //     }
      //     if (err.response) {
      //       toast.error(err.response.data.message);
      //     }
      //   });
    }
  }, [calendar]);

  return (
    <div className="flex  flex-col items-center gap-7  h-full  justify-start rounded-cs w-full">
      <div className="flex flex-row justify-between items-center w-full ">
        <span> بیماران </span>
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
      <div className="w-full h-[350px] ltr">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Legend
              verticalAlign="top"
              align="right"
              layout="horizontal"
              height={250}
              iconType="plainline"
              // iconSize={12}
              fontSize={12}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              wrapperStyle={{ maxHeight: "10%" }}
              // direction="ltr"
              
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="pv"
              stackId="1"
              name="بدهکار"
              stroke="#4267B3"
              fill="#4267B3"
            />
            <Area
              type="monotone"
              dataKey="uv"
              stackId="1"
              name="بستانکار"
              stroke="#A1B3D9"
              fill="#A1B3D9"
            />
            <Area
              type="monotone"
              dataKey="amt"
              stackId="1"
              name="تسویه شده"
              stroke="#D9E1F0"
              fill="#D9E1F0"
            />
          </AreaChart>
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

export default PatientComponent;
