import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Error from "next/error";
import PageLoading from "../utils/LoadingPage";
import { toast } from "react-toastify";
import ShowTimes from "./ShowTimes";
import Modal from "./Modal";
import Calendar from "../common/Calendar";
import Tabs from "./Tabs";
import * as yup from "yup";
import { useFormik } from "formik";
import { getDateTableVisit } from "../Services/appointmentService";
import DisableAttendTime from "./DisableAttendTime";
import EditAttendTime from "./EditAttendTime";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
const EditDoctorTime = () => {
  const [select, setSelect] = useState(null);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState([null]);
  const [tab, setTab] = useState(0);
  const [doctorTime, setDoctorTime] = useState([]);
  const [attendTime, SetAttendTime] = useState([]);
  const router = useRouter();
  const { user, loading } = useAuth();
  const query = router.query;
  const userDispatch = useAuthActions();
  const setValueFormik = () => {
    doctorTime.map((item) => timeFormik.setFieldValue(item.day, item.time));
  };
  const getData = async () => {
    await getDateTableVisit(
      {
        doctor_id: query.id,
        clinic_id: query.clinic,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          let day = data.result.map((item) => item.day);
          let times = data.result.map((item) => {
            return { day: item.day, time: item.times, id: item.id };
          });
          setDoctorTime([...times]);
          setDays(day);
          SetAttendTime(day);
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
  const validationSchema = yup.object({
    tell: yup.string().required("شماره تلفن پزشک را وارد کنید"),
    name: yup.string().required("نام پزشک را وارد کنید"),
    speciality: yup.string().required("تخصص پزشک را وارد کنید"),
    clinic_id: yup.string().required("کلینیک را انتخاب کنید"),
    dvs: yup.string().required("میانگین زمان جراحی را وارد کنید"),
    days: yup.string(),
  });
  const initialValues = {
    tell: "",
    name: "",
    speciality: "",
    clinic_id: "",
    days: "",
    dvs: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);

      for (const key in days) {
        days[key].length <= 0 ? delete days[key] : null;
      }
      let finalValue = {
        ...values,
        days: days,
      };
      // newDoctorService(finalValue, {
      //   Authorization: "Bearer " + user.token,
      // })
      //   .then(({ data }) => {
      //     if (data.status === false) {
      //       toast.error(data.message[0]);
      //     } else {
      //       toast.success("پزشک با موفقیت ثبت شد");
      //       router.push("/admin/doctor");
      //     }
      //     formik.setStatus(0);
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
      //     formik.setStatus(0);
      //   });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  const initialValuesTime = {
    Saturday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };
  const timeFormik = useFormik({
    initialValues: initialValuesTime,
    onSubmit: (values) => {},
    enableReinitialize: true,
  });

  // useEffect(() => {
  //   SetAttendTime(timeFormik.values);
  // }, [timeFormik.values]);

  useEffect(() => {
    if (user && user.token && query.id && query.clinic) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [loading, query.id]);
  useEffect(() => {
    doctorTime && setValueFormik();
  }, [doctorTime]);
  const options = [
    { id: 0, text: "روز" },
    { id: 1, text: "ساعت" },
  ];
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!days) return <PageLoading />;

  return (
    <>
      <div className="border border-gray-200">
        <div className="w-full max-w-full overflow-x-scroll p-6 flex flex-row items-start  gap-6">
          {/* <div className="flex flex-col items-start w-1/2 p-6 shadow-cs rounded-cs gap-2">
            <div className="w-full flex flex-row items-center justify-between">
              <span>غیرفعال کردن روز های حضور</span>
              <Tabs options={options} setTab={setTab} tab={tab} />
            </div>
            <div className="border border-primary-100 w-full rounded-cs p-6">
              {tab === 0 ? (
                <Calendar
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              ) : tab === 1 && !select ? (
                <Calendar
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              ) : tab === 1 && select.day ? (
                <DisableAttendTime />
              ) : null}
            </div>
          </div> */}

          <div className="flex flex-col items-start w-1/2 max-w-fit  p-6 shadow-cs rounded-cs gap-2">
            <div className="w-full flex flex-row  items-center justify-start">
              <span>ویرایش زمان حضور پزشکان</span>
            </div>
            <div className="border border-primary-100 w-full rounded-cs max-w-fit p-6 mt-5">
              <EditAttendTime
                daySelected={attendTime}
                doctorTimes={doctorTime}
                formik={timeFormik}
                setDays={SetAttendTime}
                getData={getData}
              />
            </div>
          </div>
        </div>
      </div>
      {open ? (
        <Modal>
          <ShowTimes setOpen={setOpen} data={days} />
        </Modal>
      ) : null}
    </>
  );
};

export default EditDoctorTime;
