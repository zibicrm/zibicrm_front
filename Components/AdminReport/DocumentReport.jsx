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

const DocumentReport = ({}) => {
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [documentCount, setDocumentCount] = useState(null);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  useEffect(() => {
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
            setDocumentCount(finalData);
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
    if (start && end && !calendar) {
      reportDocumentCountService(
        {
          start: start,
          end: end,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
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
            setDocumentCount(finalData);
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
  }, [calendar]);
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
  const SumOfDocument = () => {
    let sum = 0;
    documentCount && documentCount.map((d) => (sum = sum + d.count));
    return `تعداد کل ${sum}`;
  };
  return (
    <div className="flex  flex-col items-center gap-7  h-full  justify-start rounded-cs w-full">
      <div className="flex flex-row justify-between items-center w-full ">
        <span className="text-gray-900">پرونده ها </span>
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
        {documentCount && (
          <ResponsiveContainer>
            <PieChart width={800} height={400}>
              <Pie
                data={documentCount}
                cx={150}
                cy={150}
                innerRadius={110}
                outerRadius={130}
                fill="#8884d8"
                dataKey="count"
                barCategoryGap={0}
              >
                {documentCount &&
                  documentCount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                <Label width={55} position="center">
                  {SumOfDocument()}
                </Label>
              </Pie>

              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                height={250}
                content={renderLegendCellPhone}
                iconType="plainline"
                iconSize={28}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                wrapperStyle={{ maxHeight: "100%", overflow: "auto" }}
              />
            </PieChart>
          </ResponsiveContainer>
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

export default DocumentReport;
