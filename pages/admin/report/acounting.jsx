import { useRouter } from "next/router";
import Modal from "../../../Components/Modal";
import RangePicker from "../../../Components/RangePicker";

import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import { getAllPatientStatusService } from "../../../Services/patientStatusServices";

import { getAllClinicService } from "../../../Services/clinicServices";
import { getAllUsersService } from "../../../Services/userServies";
import Error from "next/error";
import DailyAcountingReport from "../../../Components/AcountingReport/DailyAcountingReport";
import ChecksComponent from "../../../Components/AcountingReport/checksComponent";
import PaymentType from "../../../Components/AcountingReport/PaymentType";
import PatientComponent from "../../../Components/AcountingReport/PatientComponent";
const Acounting = ({}) => {
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [type, setType] = useState(null);

  const [allDoctors, setAllDoctors] = useState(null);

  const router = useRouter();
  const userDispatch = useAuthActions();

  const { user, loading } = useAuth();

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
          <h1 className="text-xl text-gray-900"> گزارشات حسابداری </h1>
        </div>
        <div className="w-full max-w-full  flex-row items-center flex  gap-6 px-6  py-6">
          <DailyAcountingReport />
        </div>
        <div className="flex flex-col gap-4 items-center  my-6 px-6 ">
          <ChecksComponent />
        </div>
        <div className="w-full max-w-full overflow-x-hidden flex-row items-center flex  gap-6 px-6  py-6">
          <div className="flex bg-white flex-col items-center gap-7 px-6 py-4  h-full min-h-[450px] justify-start  rounded-cs w-[550px]">
            <PaymentType />
          </div>
          <div className=" w-[calc(100%-550px)] min-h-[450px] h-full px-6 py-4 rounded-cs bg-white flex flex-col gap-6 ">
            <PatientComponent />
          </div>
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

export default Acounting;
