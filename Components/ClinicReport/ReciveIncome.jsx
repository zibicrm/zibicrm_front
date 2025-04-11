import moment from "jalali-moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { MdCalendarToday } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PrimaryBtn from "../../common/PrimaryBtn";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import { useAuth } from "../../Provider/AuthProvider";
import { reportClinicIncome } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const ReciveIncome = ({}) => {
  const { user, loading } = useAuth();
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const [clinicRecievePrice, setClinicRecievePrice] = useState(null);
  const [pageLoadingStatus, setPageLoadingStatus] = useState(false);
  const recieveColor = ["#FDC353", "#202F4F", "#202F4F"];

  const reportClinicIncomeChart = (firstLoad) => {
    setPageLoadingStatus(true);
    reportClinicIncome(
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
          let recieveRayy = [];
          data.result.map((m) => {
            recieveRayy.push({
              title: m.title,
              price: m.treatment_sum_receive_price,
            });
          });
          setClinicRecievePrice(recieveRayy);
        }
        setPageLoadingStatus(false);
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

  useEffect(() => {
    if (user && !loading) {
      reportClinicIncomeChart(true);
    }
  }, [loading]);

  useEffect(() => {
    if (user && !loading && !start && !end && !calendar) {
      reportClinicIncomeChart(true);
    }
    if (user && !loading && start && end && !calendar) {
      reportClinicIncomeChart(false);
    }
  }, [calendar]);
  const ReiciveTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2  ">
          <div className="flex justify-between mt-5 ">
            <p className="mb-0">قیمت کل </p>
            <p className="mb-0">
              {CurrencyNum.format(Number(payload[0].payload.price))}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="w-1/3 bg-white px-6 py-4 flex flex-col items-center gap-4  h-[597px] rounded ">
      <div className="flex flex-row justify-between items-center w-full ">
        <span className="text-gray-900">درآمد دریافتی</span>
        <div
          className="h-9 w-24"
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
      </div>
      <div className="w-full lg:h-full ltr relative  ">
        {!pageLoadingStatus ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={clinicRecievePrice}
              margin={{
                top: 20,
                right: 30,
                left: 15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                vertical={false}
              />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 12 }}
                fontFamily={"Tajrid"}
              />

              <YAxis tick={{ fontSize: 12 }} fontFamily={"Tajrid"} />
              <Tooltip
                content={<ReiciveTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="price"
                stackId="a"
                // fill="#202F4F"
                barSize={112}
                radius={[24, 24, 0, 0]}
              >
                {clinicRecievePrice &&
                  clinicRecievePrice.map((entry, index) => (
                    <Cell
                      cursor="pointer"
                      // fill={entry.color}
                      fill={recieveColor[index]}
                      // fill={entry.recieveColor}
                      key={`cell-${index}`}
                    />
                  ))}
              </Bar>
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

export default ReciveIncome;
