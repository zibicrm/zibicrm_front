import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportAllEventService } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const EventReport = ({ userList }) => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, loading } = useAuth();
  const [eventsStatus, setEventStatus] = useState(0);
  const [dataAllEvent, setDataAllEvent] = useState([]);
  const [randomUser, setRandomUser] = useState(null);
  const [allData, setAllData] = useState([]);
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");

  function groupItems(array, property) {
    return array.reduce(function (groups, item) {
      var name = moment(item.date).format("YYYY-MM-DD");
      var group = groups[name] || (groups[name] = []);
      group.push(item);
      return groups;
    }, {});
  }
  function getDatesInRangeEvent(startDate, endDate) {
    // const d1 = new Date(startDate);
    // const d2 = new Date(endDate);
    const date = new Date(startDate.getTime());

    // ✅ Exclude start date
    date.setDate(date.getDate());

    const dates = [];

    // ✅ Exclude end date
    while (date <= endDate) {
      dates.push({
        date: moment(new Date(date)).format("YYYY-MM-DD"),
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      });
      date.setDate(date.getDate() + 1);
    }
    setAllData(dates);
  }
  const getEvents = (firstLoad) => {
    setEventStatus(1);
    reportAllEventService(
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
        user_id: selectedUser,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setDataAllEvent([]);
        } else {
          let final = [];
          let g = groupItems(data.result);
          for (let key in g) {
            let find = allData.find((d) => String(d.date) === String(key));
            g[key].map((item) => {
              find[item.event_type_id] = item.count;
            });
            final = [...final, find];
          }
          for (let key in final) {
            final[key] = {
              ...final[key],
              date: moment(final[key].date).locale("fa").format("YYYY/MM/DD"),
            };
          }
          setDataAllEvent(final);
        }
        setEventStatus(0);
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
        setEventStatus(0);
      });
  };
  const EventTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-fit bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          {payload.map((i, index) => (
            <p
              key={index}
              className={` text-right flex flex-row justify-between  border-dotted p-1 h-1/2 ${
                index + 1 === payload.length ? "" : "border-b-2"
              } `}
            >
              <span>{i.value}</span>
              <p className="mb-0">{i.name}</p>
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            <div className="text-[12px] text-gray-900">{entry.value}</div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    if (userList && userList.length) {
      let random = Math.floor(Math.random() * userList.length);
      setSelectedUser(userList[random].id);
      setRandomUser(userList[random]);
    }
  }, [userList]);
  useEffect(() => {
    if (
      !start &&
      !end &&
      !calendar &&
      userList &&
      userList.length &&
      selectedUser
    ) {
      getEvents(true);
    }
    if (
      start &&
      end &&
      !calendar &&
      userList &&
      userList.length &&
      selectedUser
    ) {
      getEvents(false);
    }
  }, [selectedUser, calendar]);
  useEffect(() => {
    if (user) {
      getDatesInRangeEvent(
        new Date(
          moment
            .from(firstDay, "fa", "YYYY-MM-DD")
            .locale("en")
            .format("YYYY-MM-DD")
        ),
        new Date(
          moment
            .from(lastDay, "fa", "YYYY-MM-DD")
            .locale("en")
            .format("YYYY-MM-DD")
        )
      );
    }
  }, [loading]);
  useEffect(() => {
    if (start && end) {
      getDatesInRangeEvent(new Date(start), new Date(end));
    }
  }, [start, end]);
  return (
    <div className="w-full p-6 rounded-cs bg-white flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center w-full">
        <span className="text-gray-900">وقایع ثبت شده </span>
        <div className="flex flex-row items-center gap-3">
          {randomUser && randomUser.name && (
            <FilterBtn
              label={randomUser.name}
              name="user"
              selectOption={userList}
              labelOption="name"
              valueOption="id"
              onChange={(e) => setSelectedUser(e.id)}
            />
          )}
          <div className="h-10 w-24">
            <PrimaryBtn
              text="تقویم"
              onClick={() => {
                setCalendar(true);
              }}
            >
              <span className="block mr-1  mb-1">
                <MdCalendarToday />
              </span>
            </PrimaryBtn>{" "}
          </div>
        </div>
      </div>
      <div className="w-full h-[800px] relative ltr">
        {eventsStatus === 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dataAllEvent}
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
                dataKey="date"
                interval={0}
                angle={280}
                height={70}
                tickMargin={35}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={false}
                content={<EventTooltip />}
                wrapperStyle={{ outline: "none" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={40}
                content={renderLegend}
              />
              <Bar
                dataKey="1"
                name="پیگیری"
                stackId="a"
                fill="#540B0E"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="2"
                stackId="a"
                name="مشاوره و اطلاعات"
                fill="#9E2A2B"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="3"
                stackId="a"
                name="نوبت ویزیت"
                fill="#DB766A"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="4"
                stackId="a"
                name="نوبت جراحی"
                fill="#8977E8"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="5"
                name="عدم پاسخ"
                stackId="a"
                fill="#C5BCF3"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="6"
                name="ارجاع به پاراکلینیک"
                stackId="a"
                fill="#E09F3E"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="7"
                name="تصمیم گیری"
                stackId="a"
                fill="#FFCB75"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="8"
                name="انصراف"
                stackId="a"
                fill="#FFF9D6"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="9"
                stackId="a"
                name="ویزیت شده"
                fill="#202F4F"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />

              <Bar
                dataKey="10"
                stackId="a"
                name="جراحی شده"
                fill="#185F8D"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="11"
                name="کنسل نوبت"
                stackId="a"
                fill="#6EA8D6"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
              <Bar
                dataKey="12"
                stackId="a"
                fill="#A5D7FF"
                stroke="#fff"
                name="سایر"
                strokeWidth={1.5}
                style={{ transform: "translate(0,-2px)" }}
              />
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

export default EventReport;
