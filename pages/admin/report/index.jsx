import { useRouter } from "next/router";
import {
  MdCalendarToday,
  MdCallReceived,
  MdOutlineLibraryBooks,
  MdSchedule,
  MdOutlineMedicalServices,
  MdCallMade,
} from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";
import moment from "jalali-moment";
import Layout from "../../../Layout/Layout";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";

import { getAllPatientStatusService } from "../../../Services/patientStatusServices";
import Error from "next/error";
import { faker } from "@faker-js/faker";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Link from "next/link";
import Tabs from "../../../Components/Tabs";
import FilterBtn from "../../../common/FilterBtn";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  LineChart,
  Line,
  Label,
  LabelList,
} from "recharts";
import Modal from "../../../Components/Modal";
import RangePicker from "../../../Components/RangePicker";
import {
  reportAllEventService,
  reportCompareSupplierAppointmentService,
  reportCompareSupplierAppointmentSurgery,
  reportCompareUserAllAppointments,
  reportDocumentCountService,
  reportSupplierCellPhoneService,
  reportUserDailySupplierService,
} from "../../../Services/reportServices";
import { getAllUsersService } from "../../../Services/userServies";
import PageLoading from "../../../utils/LoadingPage";
import { all } from "axios";
import DailyReport from "../../../Components/AdminReport/DailyReport";
import DocumentReport from "../../../Components/AdminReport/DocumentReport";
import PorsantReport from "../../../Components/AdminReport/PorsantReport";
import AppointmentReport from "../../../Components/AdminReport/AppointmentReport";
import EventReport from "../../../Components/AdminReport/EventReport";
import CellPhoneReport from "../../../Components/AdminReport/CellPhoneReport";
import { ImplantReport } from "../../../Components/AdminReport/ImplantReport";
import ImplantPatient from "../../../Components/AdminReport/ImplantPatient";
const AdminReport = () => {
  const [userList, setUserList] = useState([]);

  const router = useRouter();
  const { user, loading } = useAuth();
  let secondData;
  let nowDay = moment(moment.now()).format("YYYY-MM-DD");

  const userDispatch = useAuthActions();

  useEffect(() => {
    if (user && !loading) {
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
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [loading]);

  if (user && user.user.rule !== 2) return <Error statusCode={404} />;

  return (
    <Layout>
      <div className="bg-gray-100 pb-6">
        <div className="bg-white p-6 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900">گزارشات کاربر</h1>
        </div>
        <div className="w-full max-w-full overflow-x-hidden flex-row items-center flex  gap-6 px-6  py-6">
          <div className=" w-[calc(100%-550px)] min-h-[450px] h-full px-6 py-4 rounded-cs bg-white flex flex-col gap-6 ">
            <DailyReport userList={userList} />
          </div>
          <div className="flex bg-white flex-col items-center gap-7 px-6 py-4  h-full min-h-[450px] justify-start  rounded-cs w-[550px]">
            <DocumentReport />
          </div>
        </div>
        <div
          className="flex flex-row items-center gap-6 px-6 
        "
        >
          <div className="w-full bg-white rounded-cs px-6 py-4 flex flex-col items-center gap-6">
            <PorsantReport />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center  my-6 px-6">
          <div className="w-full p-6 rounded-cs bg-white flex flex-col gap-4">
            <AppointmentReport userList={userList} />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center  my-6 px-6">
          <div className="w-full p-6 rounded-cs bg-white flex flex-col gap-4">
            <EventReport userList={userList} />
          </div>
        </div>
        <div className="flex flex-row justify-start gap-4 items-center my-6  px-6 ">
          <ImplantReport />
        </div>
        {/* <div className="flex flex-row justify-start gap-4 items-center my-6  px-6 ">
          <ImplantPatient />
        </div> */}
        <div className="flex flex-row justify-start gap-4 items-center my-6  px-6 ">
          <CellPhoneReport />
        </div>
      </div>
    </Layout>
  );
};

export default AdminReport;
