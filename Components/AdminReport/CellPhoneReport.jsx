import moment from "jalali-moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportSupplierCellPhoneService } from "../../Services/reportServices";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const CellPhoneReport = ({}) => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { user, loading } = useAuth();
  const [supplierData, setSupplierData] = useState([]);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const renderLegendCellPhone = (props) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
            <div className="text-[12px] text-gray-900">{entry.value} :</div>
            <span className="text-gray-900">{entry.payload.value}</span>
          </div>
        ))}
      </div>
    );
  };
  const getSupplierCellPhone = (firstLoad) => {
    reportSupplierCellPhoneService(
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
        // user_id: selectedUserEvent,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          let finalData = [];
          data.result.map((item) => {
            finalData.push({
              name: item.last_name,
              notAnswere: item.notanswer,
              document: item.document,
              receive: item.receive,
              color: item.color,
            });
          });
          setSupplierData(finalData);
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
  };
  const CellPhoneTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-fit bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          {payload.map((i, index) => (
            <div key={index}>
              <p
                className={` text-right flex flex-row justify-between  border-dotted p-1 h-1/2 border-b-2`}
              >
                <span>{i.value}</span>
                <p className="mb-0">{i.name}</p>
              </p>
              <p
                className={` text-right flex flex-row justify-between p-1 h-1/2 `}
              >
                <span>{i.payload.payload.document}</span>
                <p className="mb-0">تشکیل پرونده</p>
              </p>
              <p
                className={` text-right flex flex-row justify-between p-1 h-1/2`}
              >
                <span>{i.payload.payload.notAnswere}</span>
                <p className="mb-0">عدم پاسخ</p>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    if (user && !loading && start && end && !calendar) {
      getSupplierCellPhone(false);
    }
  }, [calendar]);
  useEffect(() => {
    if (user && !loading && !start && !end) {
      getSupplierCellPhone(true);
    }
  }, [loading]);
  return (
    <div className="w-1/2 h-[450px] bg-white rounded-cs p-6 flex flex-col items-start">
      <div className="flex flex-row justify-between items-center w-full ">
        <div className="flex flex-row items-center gap-2">
          <span className="text-gray-900">آنالیز تلفن های دریافتی</span>
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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={800} height={400} className="ltr">
          <Pie
            data={supplierData}
            cx={200}
            cy={200}
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="receive"
          >
            {supplierData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={<CellPhoneTooltip />}
            wrapperStyle={{ outline: "none" }}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            height={250}
            iconType="plainline"
            content={renderLegendCellPhone}
            iconSize={28}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            wrapperStyle={{ maxHeight: "100%", overflow: "auto" }}
          />
        </PieChart>
      </ResponsiveContainer>
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

export default CellPhoneReport;
