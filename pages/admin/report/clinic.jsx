import { useRouter } from "next/router";
import Modal from "../../../Components/Modal";
import RangePicker from "../../../Components/RangePicker";
import {
  MdCallReceived,
  MdOutlineLibraryBooks,
  MdSchedule,
  MdCalendarToday,
  MdOutlineAutoAwesomeMoti,
  MdArrowDropDown,
  MdOutlineMedicalServices,
  MdOutlineAutoAwesomeMotion,
  MdOutlineAssignment,
  MdOutlineReceipt,
  MdOutlinePriceChange,
  MdOutlineFeaturedPlayList,
  MdAttachMoney,
} from "react-icons/md";
import FilterBtn from "../../../common/FilterBtn";
import { RiStethoscopeLine } from "react-icons/ri";
import PageLoading from "../../../utils/LoadingPage";
import Layout from "../../../Layout/Layout";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { getAllPatientStatusService } from "../../../Services/patientStatusServices";
import {
  reportClinicDaily,
  reportClinicCompareDoctor,
  reportClinicIncome,
  reportUserCompareAppointmentSurgery,
  reportClinicAppointment,
  reportUserImplant,
} from "../../../Services/reportServices";
import { getAllClinicService } from "../../../Services/clinicServices";
import { getAllUsersService } from "../../../Services/userServies";
import { getAllDoctorService } from "../../../Services/doctorServices";
import Error from "next/error";
import { faker } from "@faker-js/faker";
import PrimaryBtn from "../../../common/PrimaryBtn";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Tabs from "../../../Components/Tabs";
import { RiFontSize } from "react-icons/ri";
import moment from "jalali-moment";
import DailyClinicReport from "../../../Components/ClinicReport/DailyClinicReport";
import ReciveIncome from "../../../Components/ClinicReport/ReciveIncome";
import DoctorReport from "../../../Components/ClinicReport/DoctorReport";
import AppointmentClinicReport from "../../../Components/ClinicReport/AppointmentClinicReport";
const Clinic = ({}) => {
  const [patient, setPatient] = useState(null);
  const [status, setStatus] = useState(0);
  const [tab, setTab] = useState(0);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [type, setType] = useState(null);
  const [clinicList, setClinicList] = useState(null);
  const [userList, setUserList] = useState([]);
  const [allDoctors, setAllDoctors] = useState(null);
  const [visitStatus, setVisitStatus] = useState(false);
  const [pageLoadingStatus, setPageLoadingStatus] = useState(false);

  const router = useRouter();
  const userDispatch = useAuthActions();

  const { user, loading } = useAuth();
  const [implant, setImplant] = useState({});
  const getClinicsName = () => {
    getAllClinicService({ Authorization: "Bearer " + user.token })
      .then(({ data }) => {
        if (data.status === false) {
        } else {
          setClinicList(data.result);
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

  const tabs = [
    { id: 0, text: "پاسداران" },
    { id: 1, text: "ظفر" },
  ];
  const docTest = [
    { id: 0, text: "ویزیت" },
    { id: 1, text: "جراحی" },
    { id: 2, text: "ثبت درمان  " },
  ];
  const visitsData = [
    {
      name: "1",
      uv: 4000,
      pv: 2400,
      hv: 2700,
      amt: 2400,
    },
    {
      name: "2",
      uv: 3000,
      pv: 1398,
      hv: 1700,
      amt: 2210,
    },
    {
      name: "3",
      uv: 2000,
      pv: 9800,
      hv: 5000,
      amt: 2290,
    },
    {
      name: "4",
      uv: 2780,
      pv: 3908,
      hv: 9000,
      amt: 2000,
    },
    {
      name: "5",
      uv: 1890,
      pv: 4800,
      hv: 2700,
      amt: 2181,
    },
    {
      name: "6",
      uv: 2390,
      pv: 3800,
      hv: 9700,
      amt: 2500,
    },
    {
      name: "7",
      uv: 3490,
      pv: 4300,
      hv: 1300,
      amt: 2100,
    },
    {
      name: "8",
      uv: 390,
      pv: 430,
      hv: 1300,
      amt: 2100,
    },
    {
      name: "9",
      uv: 390,
      pv: 430,
      hv: 1300,
      amt: 2100,
    },
    {
      name: "10",
      uv: 390,
      pv: 530,
      hv: 1300,
      amt: 2100,
    },
    {
      name: "11",
      uv: 690,
      pv: 330,
      hv: 11300,
      amt: 2100,
    },
  ];

  useEffect(() => {
    if (user && !loading) {
      getClinicsName();

      getAllUsersService(
        { page: 1, count: 100 },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
          } else {
            let result = data.result;
            let users = [];
            result.map((u) => {
              users.push({
                id: u.id,
                name: u.last_name,
                color: u.color,
              });
            });
            setUserList(users);
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
      getAllPatientStatusService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setPatientStatus(data.result);
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
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
    setTab(tabs[0]);
  }, [loading]);
  useEffect(() => {
    if (start && end && !calendar && type === 1) {
    } else if (start && end && !calendar && type == 3) {
      compareDoctors();

    } else if (start && end && !calendar && type == 2) {
    } else if (start && end && !calendar && type === 4) {
    } else if (start && end && !calendar && type == 5) {
      reportUserCompareAppointmentSurgeryImplant();
    } else {
    }
  }, [calendar]);

  if (user && user.user.rule !== 2) return <Error statusCode={404} />;

  return (
    <Layout>
      <div className="bg-gray-100 overflow-x-hidden pb-6">
        <div className="bg-white  p-6  flex flex-row items-center justify-between border-b border-primary-900 ">
          <h1 className="text-xl text-gray-900"> گزارشات مطب </h1>
        </div>
        <div className="w-full max-w-full overflow-x-scroll flex-row items-center flex  gap-6 px-6  py-6">
          <DailyClinicReport clinicList={clinicList} />
        </div>
        <div className="flex flex-row items-center gap-6 px-6 overflow-x-hidden">
          <ReciveIncome />
          <DoctorReport clinicList={clinicList} setClinicList={setClinicList} />
        </div>
        <div className="flex flex-col gap-4 items-center  my-6 px-6 ">
          <AppointmentClinicReport />
        </div>
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

export default Clinic;
