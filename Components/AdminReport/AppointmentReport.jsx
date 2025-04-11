import moment from "jalali-moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FilterBtn from "../../common/FilterBtn";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth } from "../../Provider/AuthProvider";
import { reportCompareUserAllAppointments } from "../../Services/reportServices";
import PageLoading from "../../utils/LoadingPage";
import Modal from "../Modal";
import RangePicker from "../RangePicker";

const AppointmentReport = ({ userList }) => {
  const [appointmentsStatus, setAppointmentStatus] = useState(0);
  const [dataCompareAppointment, setDataCompareAppointment] = useState([]);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [randomUser, setRandomUser] = useState(null);
  const [allCount, setAllCount] = useState(null);

  const { user, loading } = useAuth();
  let lastDay = moment(moment.now()).locale("fa").format("YYYY/MM/DD");
  let firstDay = moment(moment().add(-30, "days"))
    .locale("fa")
    .format("YYYY/MM/DD");
  const getCompareAllAppointment = (firstLoad) => {
    setAppointmentStatus(1);
    reportCompareUserAllAppointments(
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
          setDataCompareAppointment([]);
        } else {
          // setDataCompareAppointment(data.result);
          let aLength = {};
          let final = [];
          for (let key in data.result.appointment) {
            aLength = {
              ...aLength,
              [key]: { appointment: data.result.appointment[key].length },
            };
          }
          for (let key in data.result.appointment_surgery) {
            aLength[key] = {
              ...aLength[key],
              surgery: data.result.appointment_surgery[key].length,
            };
          }

          for (let key in aLength) {
            final.push({
              date: moment(key).locale("fa").format("YYYY/MM/DD"),
              surgery: aLength[key].surgery,
              appointment: aLength[key].appointment,
            });
          }
          let a = 0;
          final.map((i) => {
            if (Number(i.appointment) >= 0) {
              a = Number(i.appointment) + Number(a);
            }
          });
          setDataCompareAppointment(final);
        }
        setAppointmentStatus(0);
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
        setAppointmentStatus(0);
      });
  };
  const AppointmentTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          <p className=" text-right flex flex-row justify-between border-b-2 border-dotted p-1 h-1/2">
            <span>
              {payload[0].payload.appointment
                ? payload[0].payload.appointment
                : 0}
            </span>
            <p className="mb-0">ویزیت</p>
          </p>
          <div className="flex justify-between mt-2 p-1">
            <p className="mb-0">
              {payload[0].payload.surgery ? payload[0].payload.surgery : 0}
            </p>
            <p className="mb-0">جراحی</p>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    // if (!start && !end && !calendar && userList && userList.length) {
    //   getCompareAllAppointment(true);
    // }
    if (userList && userList.length) {
      let random = Math.floor(Math.random() * userList.length);
      setSelectedUser(userList[random].id);
      setRandomUser(userList[random]);
    }
  }, [userList]);
  useEffect(() => {
    if (user && !loading && start && end) {
      getCompareAllAppointment(false);
    }
  }, [calendar]);
  useEffect(() => {
    if (
      !start &&
      !end &&
      !calendar &&
      userList &&
      userList.length &&
      selectedUser
    ) {
      getCompareAllAppointment(true);
    }
    if (
      start &&
      end &&
      !calendar &&
      userList &&
      userList.length &&
      selectedUser
    ) {
      getCompareAllAppointment(false);
    }
  }, [selectedUser]);
  return (
    <div className="w-full p-6 rounded-cs bg-white flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center w-full   ">
        <span className="text-gray-900">نوبت ها</span>
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
            </PrimaryBtn>
          </div>
        </div>
      </div>
      <div className="w-full h-[800px] relative ltr">
        {appointmentsStatus === 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={350}
              data={dataCompareAppointment}
              margin={{
                top: 5,
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
                angle={280}
                interval={0}
                tickMargin={40}
                padding={{ left: 20, right: 20 }}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                content={<AppointmentTooltip />}
              />
              <Line
                type="monotone"
                dataKey="surgery"
                stroke={
                  userList &&
                  userList.find(
                    (item) => Number(item.id) === Number(selectedUser)
                  ) &&
                  userList.find(
                    (item) => Number(item.id) === Number(selectedUser)
                  ).color
                }
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="appointment"
                stroke="#111827"
                activeDot={{ r: 8 }}
              />
              {/* <ReferenceLine
                y={allCount / implantChartData.length}
                label=""
                stroke="#4267B3"
                strokeDasharray="3 3"
              /> */}
            </LineChart>
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

export default AppointmentReport;
