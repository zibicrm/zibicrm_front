import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  Legend,
} from "recharts";
import Layout from "../../../Layout/Layout";
import {
  MdCallReceived,
  MdOutlineLibraryBooks,
  MdCalendarToday,
  MdSchedule,
  MdOutlineMedicalServices,
} from "react-icons/md";
import { FaTeeth } from "react-icons/fa";

import { RiStethoscopeLine } from "react-icons/ri";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Tabs from "../../../Components/Tabs";

import Modal from "../../../Components/Modal";
import RangePicker from "../../../Components/RangePicker";
import {
  reportUserAppointmentService,
  reportUserDayilyService,
  reportUserSurgeryAppointmentService,
} from "../../../Services/reportServices";
import { useAuth } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import moment from "jalali-moment";

const Users = ({}) => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [type, setType] = useState(0);
  const [dailyReport, setDailyReport] = useState(null);
  const { user, loading } = useAuth();
  let nowDay = moment(moment.now()).format("YYYY-MM-DD");
  let firstDay = moment().locale("fa").startOf("month").format("YYYY-MM-DD");
  let lastDay = moment().locale("fa").endOf("month").format("YYYY-MM-DD");
  const [tab, setTab] = useState(0);
  const [test, setTest] = useState(0);
  const [barData, setBarData] = useState(null);
  const tabs = [
    { id: 0, text: "جراحی" },
    { id: 1, text: "ویزیت" },
  ];
  const docTest = [
    { id: 0, text: "ویزیت و جراحی" },
    { id: 1, text: "ویزیت شده و جراحی شده" },
  ];
  // RECHART
  const data = [
    {
      name: "1",

      پورسانت: 2400,
      amt: 2400,
    },
    {
      name: "2",

      پورسانت: 1398,
      amt: 2210,
    },
    {
      name: "3",

      پورسانت: 9800,
      amt: 2290,
    },
    {
      name: "4",

      پورسانت: 3908,
      amt: 2000,
    },
    {
      name: "5",

      پورسانت: 4800,
      amt: 2181,
    },
    {
      name: "6",

      پورسانت: 3800,
      amt: 2500,
    },
    {
      name: "7",

      پورسانت: 4900,
      amt: 2100,
    },
    {
      name: "7",

      پورسانت: 5000,
      amt: 2100,
    },
    {
      name: "8",

      پورسانت: 4700,
      amt: 2100,
    },
    {
      name: "9",

      پورسانت: 5500,
      amt: 2100,
    },
    {
      name: "10",

      پورسانت: 6000,
      amt: 2100,
    },
    {
      name: "11",

      پورسانت: 8000,
      amt: 2100,
    },
    {
      name: "12",

      پورسانت: 4300,
      amt: 2100,
    },
    {
      name: "13",

      پورسانت: 4200,
      amt: 2100,
    },
  ];
  let secondData;
  const iconBoxList = [
    {
      id: 0,
      label: " تعداد شماره دریافتی",
      value: dailyReport && dailyReport.user_cellphone,
      icon: <MdCallReceived />,
    },
    {
      id: 1,
      label: "تعداد پرونده ",
      value: dailyReport && dailyReport.document,
      icon: <MdOutlineLibraryBooks />,
    },
    {
      id: 2,
      label: "نوبت جراحی ",
      value: dailyReport && dailyReport.appointment_surgery,
      icon: (
        <div className="relative text-2xl ">
          <MdCalendarToday />
          <div className="text-[11px] bg-white absolute right-1.5 top-2 block ">
            <MdOutlineMedicalServices />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      label: " نوبت ویزیت ",
      value: dailyReport && dailyReport.appointment,
      icon: (
        <div className="relative text-2xl ">
          <MdCalendarToday />
          <div className="text-[11px] bg-white absolute right-1.5 top-2 block ">
            <RiStethoscopeLine />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      label: "تعداد وقایع ",
      value: dailyReport && dailyReport.event,
      icon: <MdSchedule />,
    },
    {
      id: 5,
      label: " تعداد ایمپلنت ",
      value: dailyReport && dailyReport.implant,
      icon: <FaTeeth />,
    },
  ];
  const VisitTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] bg-gray-900 text-gray-200 font-normal text-xs  bg-opacity-70 rounded shadow-none  outline-none ring-0 p-2 ">
          <p className=" text-right flex flex-row justify-between border-b-2 border-dotted p-1 h-1/2">
            <span>{payload[0].payload.visited}</span>
            <p className="mb-0">{payload[0].name}</p>
          </p>
          <div className="flex justify-between mt-2 p-1">
            {/* <p className="mb-0">{payload[0].payload.day}</p> */}
            <span>{payload[0].payload.unVizited}</span>
            <p className="mb-0">{payload[1].name}</p>
          </div>
        </div>
      );
    }
    return null;
  };
  const Poursanttooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="w-[150px] h-[70px] bg-gray-500 text-gray-200 font-normal text-xs  rounded shadow-none border-none box-border ring-0 p-2 ">
          <p className=" text-right border-b-2 border-dotted p-1 h-1/2">
            پورسانت دریافتی
          </p>

          {/* <p  className="mb-0"> 5/08/1401</p> */}
          <p className=" text-right p-1 flex justify-end">
            {" "}
            <span>تومان</span> <span>۲۰۰۰۰۰۰۰</span>
          </p>
        </div>
      );
    }
    return null;
  };
  const formatterData = (groups) => {
    let chartD = [];
    for (var key in groups) {
      let numOfVizit = 0;
      let numOfUnVizit = 0;
      var group = groups[key];
      group.map((item) =>
        item.treatment
          ? (numOfVizit = numOfVizit + 1)
          : (numOfUnVizit = numOfUnVizit + 1)
      );
      chartD.push({
        day: key,
        visited: numOfVizit,
        unVizited: numOfUnVizit,
      });
    }
    for (let index = 0; index < secondData.length; index++) {
      const exist = chartD.filter((i) => i.day === secondData[index].day)[0];

      if (!exist) {
        chartD.push({
          day: secondData[index].day,
          visited: 0,
          unVizited: 0,
        });
      }
    }
    setBarData(chartD.sort((a, b) => new Date(a.day) - new Date(b.day)));
    for (let index = 0; index < chartD.length; index++) {
      const element = chartD[index];
      chartD[index] = {
        ...chartD[index],
        day: moment(chartD[index].day).locale("fa").format("YYYY/MM/DD"),
      };
    }
  };
  function getDatesInRange(startDate, endDate) {
    // const d1 = new Date(startDate);
    // const d2 = new Date(endDate);
    const date = new Date(startDate.getTime());

    // ✅ Exclude start date
    date.setDate(date.getDate());

    const dates = [];

    // ✅ Exclude end date
    while (date <= endDate) {
      dates.push({
        day: moment(new Date(date)).format("YYYY-MM-DD"),
        visited: 0,
        unVizited: 0,
      });
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          gap: "1em",
        }}
      >
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-row items-center gap-1">
            <div
              className={`w-4 h-1 rounded-cs`}
              style={{ background: `${entry.color}` }}
            ></div>
            <div className="text-gray-900">{entry.value}</div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    setTest(docTest[0]);
  }, []);
  useEffect(() => {
    if (!start && !end && user) {
      if (type === 0) {
        reportUserDayilyService(
          { start: nowDay, end: nowDay },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
              setDailyReport([]);
            } else {
              setDailyReport(data.result);
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

      secondData = getDatesInRange(
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
      if (tab === 1) {
        reportUserAppointmentService(
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
              secondData && formatterData(data.result);
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
      } else {
        reportUserSurgeryAppointmentService(
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
              secondData && formatterData(data.result);
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
    }
  }, [loading]);
  useEffect(() => {
    if (start && end && !calendar && user) {
      if (type === 0) {
        reportUserDayilyService(
          { start, end },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
              setDailyReport([]);
            } else {
              setDailyReport(data.result);
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
      } else if (type === 1) {
        if (tab === 1) {
          reportUserAppointmentService(
            {
              start,
              end,
            },
            {
              Authorization: "Bearer " + user.token,
            }
          )
            .then(({ data }) => {
              if (data.status === false) {
              } else {
                setBarData([]);
                secondData && formatterData(data.result);
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
        } else {
          reportUserSurgeryAppointmentService(
            {
              start,
              end,
            },
            {
              Authorization: "Bearer " + user.token,
            }
          )
            .then(({ data }) => {
              if (data.status === false) {
              } else {
                setBarData([]);

                secondData && formatterData(data.result);
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
      }
    }
    if (start && end && !calendar) {
      secondData = getDatesInRange(new Date(start), new Date(end));
    }
  }, [calendar]);
  useEffect(() => {
    if (user && !calendar) {
      secondData = getDatesInRange(
        new Date(
          start && end
            ? start
            : moment
                .from(firstDay, "fa", "YYYY-MM-DD")
                .locale("en")
                .format("YYYY-MM-DD")
        ),
        new Date(
          start && end
            ? end
            : moment
                .from(lastDay, "fa", "YYYY-MM-DD")
                .locale("en")
                .format("YYYY-MM-DD")
        )
      );
      if (tab === 1) {
        reportUserAppointmentService(
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
              secondData && formatterData(data.result);
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
      } else {
        reportUserSurgeryAppointmentService(
          {
            start:
              start && end
                ? start
                : moment
                    .from(firstDay, "fa", "YYYY-MM-DD")
                    .locale("en")
                    .format("YYYY-MM-DD"),
            end:
              start && end
                ? end
                : moment
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
              secondData && formatterData(data.result);
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
    }
  }, [tab]);
  return (
    <Layout>
      <div className="bg-white  px-6 py-3 flex flex-row items-center justify-between border-b border-gray-200">
        <h1 className="text-xl text-gray-900">گزارشات کاربر</h1>
      </div>
      <div className="bg-gray-100  p-6">
        <div className=" w-full min-h-[200px] rounded-cs p-6 bg-white flex flex-col justify-start gap-6 ">
          {/* report and calender  */}
          <div className="flex flex-col sm:flex-col md:flex-row text-sm md:text-base lg:text-lg  md:justify-between  items-center w-full">
            <span className="text-gray-900 text-xs sm:text-xs md:text-base lg:text-lg ">
              گزارشات روزانه
            </span>
            <div className="h-9 w-14 md:w-24 text-xs sm:text-xs md:text-base lg:text-lg ">
              <PrimaryBtn
                text="تقویم"
                onClick={() => {
                  setCalendar(true);
                  setType(0);
                }}
              >
                <span className="block mr-1  mb-1">
                  <MdCalendarToday />
                </span>
              </PrimaryBtn>
              {/* <MdCalendarToday/> */}
            </div>
          </div>
          {/* cards start */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-6 lg:gap-6 xl:gap-6 items-center justify-items-center  text-xs sm:text-sm  ">
            {iconBoxList.map((item) => (
              <div
                key={item.id}
                className=" w-full py-5 max-h-40  px-4 mx-4 iconBox   bg-primary-50 border border-primary-900 rounded-cs  hover:shadow-btn flex flex-col items-center gap-4"
              >
                <div className="text-gray-900 rounded-full w-12 h-12 text-2xl bg-white  flex items-center justify-center duration-300">
                  {item.icon}
                </div>
                <span className="text-gray-900 text-center text-sm">
                  {item.label}
                </span>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className=" w-full h-full bg-white rounded-cs px-6 py-4 flex flex-col items-center gap-4 my-8">
          <div className="w-full bg-white   flex flex-col items-center gap-4">
            <div className="flex flex-row justify-between items-center w-full ">
              <div className="flex flex-row items-center gap-2 ">
                <span>نوبت ها </span>
                <div>
                  <Tabs options={tabs} setTab={setTab} tab={tab} />
                </div>
              </div>
              <div className="h-9 w-24">
                <PrimaryBtn
                  text="تقویم"
                  onClick={() => {
                    setCalendar(true);
                    setType(1);
                  }}
                >
                  <span className="block mr-1  mb-1">
                    <MdCalendarToday />
                  </span>
                </PrimaryBtn>
              </div>
            </div>

            {/* Bar chart */}
            <div className="w-full h-[560px] flex justify-center ltr ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={barData}
                  margin={{
                    top: 0,
                    bottom: 5,
                  }}
                  key={`l_${data.length}`}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={36}
                    content={renderLegend}
                    wrapperStyle={{
                      border: "0px",
                      outline: "0px",
                      direction: "rtl",
                    }}
                    iconType="plainline"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    margin={{ top: "50px" }}
                    angle={280}
                    tickMargin={40}
                    height={80}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} interval={1} />
                  <Tooltip
                    content={<VisitTooltip />}
                    cursor={{ fill: "transparent" }}
                    wrapperStyle={{ border: "0px", outline: "0px" }}
                  />
                  <Bar
                    // stroke="#fff"
                    // strokeWidth={2}
                    dataKey="visited"
                    name={tab === 0 ? "جراحی شده" : "ویزیت شده"}
                    stackId="a"
                    fill="#4267B3"
                    barSize={20}
                    style={{ transform: "translate(0,-2px)" }}
                  />
                  <Bar
                    dataKey="unVizited"
                    name={tab === 0 ? "جراحی " : "ویزیت "}
                    stackId="a"
                    fill="#C7D2E9"
                    // radius={[24, 24, 0, 0]}
                    barSize={20}
                    // stroke="#fff"
                    // strokeWidth={2}
                    // height={200}
                    style={{ transform: "translate(0,-2px)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
              {/* <Bar options={optionsLine} data={dataBar} className=" w-full"/> */}
            </div>
          </div>
        </div>
        {/* line chart */}
        {/* <div className=" w-full h-full rounded-cs bg-white px-6 py-4 flex flex-col items-center gap-4 my-8">
          <div className="w-full  bg-white flex flex-col items-center gap-4">
            <div className="flex flex-row justify-between items-center w-full ">
              <div className="flex flex-row items-center gap-2 ">
                <span> درآمد ماهانه </span>
              </div>
              <div className="h-9 w-24">
                <PrimaryBtn
                  text="تقویم"
                  onClick={() => {
                    setCalendar(true);
                    setType(2);
                  }}
                >
                  <span className="block mr-1  mb-1">
                    <MdCalendarToday />
                  </span>
                </PrimaryBtn>
              </div>
            </div>
            <div className="w-full h-[558px] flex justify-center ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={500}
                  data={data}
                  margin={{
                    top: 24,
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
                    label={{
                      value: " ماه",
                      position: "insideTopRight",
                      fontSize: 10,
                      offset: "-15",
                      dy: 0,
                    }}
                    fontSize="10"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    label={{
                      value: " تعداد ویزیت",
                      angle: -90,
                      position: "top",
                      fontSize: 10,
                      offset: "-30",
                      dx: -35,
                    }}
                    fontSize="10"
                  />
                  <Tooltip
                    content={<Poursanttooltip />}
                    wrapperStyle={{ border: "0px", outline: "0px" }}
                  />
                  <Line
                    type="natural"
                    dataKey="پورسانت"
                    stroke="#1A0846"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}

        {/* <div className=" w-full h-full rounded-cs bg-white px-6 py-4 flex flex-col items-center gap-4 my-8">
          <div className="w-full h-[579px] bg-white  flex flex-col items-center gap-4">
            <div className="flex flex-row justify-between items-center w-full ">
              <div className="flex flex-row items-center gap-2 ">
                <span> میزان عملکرد شما </span>
              </div>
              <div className="h-9 w-24 ">
                <PrimaryBtn
                  text="تقویم"
                  onClick={() => {
                    setCalendar(true);
                    setType(3);
                  }}
                >
                  <span className="block mr-1  mb-1">
                    <MdCalendarToday />
                  </span>
                </PrimaryBtn>
              </div>
            </div>
            <div className="w-full h-[579px] flex justify-start text-sm lg:text-sm ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={500}
                  data={lastData}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <Legend verticalAlign="top" height={36} />{" "}
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Bar
                    dataKey="pv"
                    fill="#4267B3"
                    minPointSize={5}
                    barSize={25}
                    radius={[50, 50, 0, 0]}
                  >
                    <LabelList dataKey="name" content={renderCustomizedLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}
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
    </Layout>
  );
};

export default Users;
