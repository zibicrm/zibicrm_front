import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportDocumentCountService } from "../../Services/reportServices";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const PaymentType = ({}) => {
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [documentCount, setDocumentCount] = useState(null);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const getPaymentType = (firstLoad) => {
    console.log("getpaymentdata calendar change");
    //send calendardata to api 
    // reportSupplierCellPhoneService(
    //   {
    //     start: firstLoad
    //       ? moment
    //           .from(firstDay, "fa", "YYYY-MM-DD")
    //           .locale("en")
    //           .format("YYYY-MM-DD")
    //       : start,
    //     end: firstLoad
    //       ? moment
    //           .from(lastDay, "fa", "YYYY-MM-DD")
    //           .locale("en")
    //           .format("YYYY-MM-DD")
    //       : end,
    //     // user_id: selectedUserEvent,
    //   },
    //   {
    //     Authorization: "Bearer " + user.token,
    //   }
    // )
    //   .then(({ data }) => {
    //     if (data.status === false) {
    //       toast.error(data.message[0]);
    //     } else {
      //save data .result into state 
    //       let finalData = [];
    //       data.result.map((item) => {
    //         finalData.push({
    //           name: item.last_name,
    //           notAnswere: item.notanswer,
    //           document: item.document,
    //           receive: item.receive,
    //           color: item.color,
    //         });
    //       });
    //       setSupplierData(finalData);
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
  };
  useEffect(() => {
    if (user && !loading && start && end && !calendar) {
      getPaymentType(false);
    }
  }, [calendar]);
  useEffect(() => {
    if (user && !loading && !start && !end) {
      getPaymentType(true);
    }
  }, [loading]);
  return (
    <div className="flex  flex-col items-center gap-7  h-full  justify-start rounded-cs w-full">
      <div className="flex flex-row justify-between items-center w-full ">
        <span> نوع پرداختی</span>
        <div className="h-10 w-24 ">
          <PrimaryBtn
            text="تقویم"
            onClick={() => {
              setCalendar(true);
              //   setType(1);
            }}
          >
            <span className="block mr-1  mb-1">
              <MdCalendarToday />
            </span>
          </PrimaryBtn>
        </div>
      </div>
      <div className="w-full h-[350px] ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              // fill="#8884d8"
              dataKey="value"
              // data={supplierData}
              // labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  // fill={entry.color} if api has a color field
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              height={250}
              iconType="plainline"
              iconSize={12}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              // wrapperStyle={{ maxHeight: "100%", overflow: "auto" }}
            />
          </PieChart>
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

export default PaymentType;
