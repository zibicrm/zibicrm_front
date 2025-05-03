import React from "react";
import { MdArrowForward, MdOutlineCancel, MdOutlineChat } from "react-icons/md";
import { useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import moment from "moment-timezone";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as jMoment from "jalali-moment";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Tabs from "../Tabs";
import PrimaryBtn from "../../common/PrimaryBtn";
import Modal from "../Modal";
import {
  cancelAppointmentSurgeryService,
  sendMessageAppointmentSurgery,
  sendRemindMessageAppointmentSurgery,
  setNewReserveSurgery,
} from "../../Services/appointmentSurgeryService";
import {
  cancelAppointmentService,
  sendMessageAppointment,
  sendRemindMessageAppointment,
  setNewReserveVisit,
} from "../../Services/appointmentService";
import VisitTimelineCalendar from "./VisitTimelineCalendar";
import { useAuth } from "../../Provider/AuthProvider";
import PageLoading from "../../utils/LoadingPage";
import SurgeryTimelineCalendar from "./SurgeryTimelineCalendar";
import { CloseBtn } from "../../common/CloseBtn";
import SearchInPatients from "../SearchInPatients";
import SelectInput from "../../common/SelectInput";
import { getServiceByClinic } from "../../Services/serviceRequest";
import Tooltip from "../../common/tooltip";
import {
  appointmentSurgeryService,
  appointmentVisitService,
  getAllAppointmentVisitService,
  getAllDoctorsAppointmentSurgeryService,
  getInfoAppointmentSurgeryService,
  getInfoAppointmentVisitService,
} from "../../Services/timelineService";
import Link from "next/link";

const tabs = [
  { id: 0, text: "نوبت جراحی" },
  { id: 1, text: "نوبت ویزیت" },
];

const holidays = [
  { id: 1, isHoliday: false, isWeekend: false, day: "26", name: "Tuesday" },
];

const TimelineCalendar = ({ access }) => {
  const [tab, setTab] = useState(0);
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [holiday, setHoliday] = useState();

  const [select, setSelect] = useState();

  const [reserve, setReserve] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [allService, setAllService] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [reservedTimeModal, setReservedTimeModal] = useState(false);
  const [remindStatus, setRemindStatus] = useState(0);
  const [documentId, setDocumentId] = useState(null);
  const [surgeryAppointmentInfo, setSurgeryAppointmentInfo] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [visitTime, setVisitTime] = useState(null);
  const [resendStatus, setResendStatus] = useState(0);
  const [cancel, setCancel] = useState(-15);
  const [type, setType] = useState(null);
  const [cancelStatus, setCancelStatus] = useState(0);
  const [description, setDescription] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [surgeryAppointmentInfoModal, setSurgeryAppointmentInfoModal] =
    useState(false);
  const [reception, setReception] = useState(null);
  const [visitAppointmentInfo, setVisitAppointmentInfo] = useState(null);
  const [visitAppointments, setVisitAppointments] = useState(null);
  const [value, setValue] = useState({
    format: "DD/MM/YYYY",
    date: new Date(),
  });
  const [currentDate, setCurrentDate] = useState(value);
  const { loading, user } = useAuth();
  const [surgeryAppointments, setSurgeryAppointments] = useState(null);
  const [getInfoLoading, setGetInfoLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const router = useRouter();
  const formattedDate = `${moment(currentDate.date, "YY/MM/DDDD").format(
    "YYYY"
  )}-${moment(currentDate.date, "YY/MM/DDDD").format("MM")}-${moment(
    currentDate.date,
    "YY/MM/DDDD"
  ).format("DD")}`;

  const ffa = moment(currentDate.date).format("YYYY-MM-DD");
  const dd = moment(currentDate.date).format("dddd");

  function convertNumberToFarsiDayOfWeek(date) {
    switch (date) {
      case 0:
        return "یکشنبه";
      case 1:
        return "دوشنبه";
      case 2:
        return "سه شنبه";
      case 3:
        return "چهارشنبه";
      case 4:
        return "پنج شنبه";
      case 5:
        return "جمعه";
      case 6:
        return "شنبه";
      default:
        return "";
    }
  }

  function convertNumberToFarsiMonths(date) {
    switch (date) {
      case "01":
        return "فروردین";
      case "02":
        return "اردیبهشت";
      case "03":
        return "خرداد";
      case "04":
        return "تیر";
      case "05":
        return "مرداد";
      case "06":
        return "شهریور";
      case "07":
        return "مهر";
      case "08":
        return "آبان";
      case "09":
        return "آذر";
      case "10":
        return "دی";
      case "11":
        return "بهمن";
      case "12":
        return "اسفند";
    }
  }

  function convertToFarsi(value) {
    let jtime = jMoment(value.date, "YYYY/MM/DD")
      .locale("fa")
      .format("YYYY/MM/DD");
    let farsiYear = jtime.split("/")[0];
    let farsiMonth = convertNumberToFarsiMonths(jtime.split("/")[1]);
    let farsiDay = jtime.split("/")[2];

    let farsiDayOfWeek = convertNumberToFarsiDayOfWeek(value.date.getDay());

    return `${farsiDayOfWeek} ${farsiDay} ${farsiMonth} ${farsiYear}`;
  }

  convertToFarsi(value);



  const convertDayOfWeek = (day) => {
    switch (day) {
      case "Saturday":
        return "شنبه";
      case "Sunday":
        return "یکشنبه";
      case "Monday":
        return "دوشنبه";
      case "Tuesday":
        return "سه شنبه";
      case "Wednesday":
        return "چهارشنبه";
      case "Thursday":
        return "پنج شنبه";
      case "Friday":
        return "جمعه";
    }
  };

  const getSurgeryAppointmentsInfo = async () => {
    if (user && user.token && documentId) {
      getInfoAppointmentSurgeryService(
        { appointment_surgery_id: documentId },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          // if (data.status === false) {
          //   toast.error(data.message[0]);
          //   setSurgeryAppointmentInfo([]);
          // } else {

          //   setSurgeryAppointmentInfo(data.result);
          // }

          setSurgeryAppointmentInfo(data.result[0]);
          setGetInfoLoading(false);
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
          setGetInfoLoading(false);
        });
    }
  };

  const getVisitAppointmentsInfo = async () => {
    if (user && user.token && documentId) {
      getInfoAppointmentVisitService(
        { appointment_id: documentId },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          // if (data.status === false) {
          //   toast.error(data.message[0]);
          //   setSurgeryAppointmentInfo([]);
          // } else {

          //   setSurgeryAppointmentInfo(data.result);
          // }

          setVisitAppointmentInfo(data.result[0]);
          setGetInfoLoading(false);
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
          setGetInfoLoading(false);
        });
    }
  };

  const remindMessageSurgery = (id) => {
    setRemindStatus(1);

    if (tab === 0) {
      sendRemindMessageAppointmentSurgery(
        {
          appointment_id: id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
          }
          setRemindStatus(0);
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
          setRemindStatus(0);
        });
    } else {
      sendRemindMessageAppointment(
        {
          appointment_id: id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
          }
          setRemindStatus(0);
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
          setRemindStatus(0);
        });
    }
  };

  const resendMessageSurgery = (id) => {
    setResendStatus(1);

    if (tab === 0) {
      sendMessageAppointmentSurgery(
        {
          appointment_id: id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
          }
          setResendStatus(0);
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
          setResendStatus(0);
        });
    } else {
      sendMessageAppointment(
        {
          appointment_id: id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
          }
          setResendStatus(0);
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
          setResendStatus(0);
        });
    }
  };

  const setReceptionHandler = async () => {
    if (tab === 0) {
      appointmentSurgeryService(
        {
          appointment_surgery_id: documentId,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            setReload(!reload);
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
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
      appointmentVisitService(
        {
          appointment_id: documentId,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            setReload(!reload);
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
            // setSurgeryAppointmentInfo(null);
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
  };

  const cancelAppointment = () => {
    setCancelStatus(1);
    if (type === 3) {
      cancelAppointmentService(
        {
          appointment_id: String(cancel),
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            getEvent(id);
            setReload(!reload);
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
          }
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
          setCurrPage(1);
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
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
        });
    } else {
      cancelAppointmentSurgeryService(
        {
          appointment_id: String(cancel),
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then((res) => {
          if (res.data.status === false) {
            toast.error(res.data.message[0]);
          } else {
            toast.success(res.data.result[0]);
            getEvent(id);
            setReload(!reload);
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
          }
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
          setCurrPage(1);
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
          setCancelStatus(0);
          setCancel(-1);
          setDescription("");
        });
    }
  };

  // info
  useEffect(() => {
    if (documentId && tab === 0) {
      getSurgeryAppointmentsInfo();
    } else if (documentId && tab === 1) {
      getVisitAppointmentsInfo();
    }
  }, [documentId]);

  // formik
  const initialValues = {
    doctor_id: "",
    document_id: "",
    service_id: "",
    clinic_id: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);

      if (tab === 1) {
        setNewReserveVisit(
          {
            dateOfDay: formattedDate,
            day: moment(currentDate.date).format("dddd"),
            VisitTime: visitTime,
            doctor_id: doctorId,
            document_id: userInfo.id,
            clinic_id: clinic,
            service_id: values.service_id,
          },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("نوبت ویزیت با موفقیت رزرو شد");
              setReserve(null);
              setReload(!reload);
              router.push({ pathname: window.location.href }, undefined, {
                scroll: false,
              });
            }
            formik.setStatus(0);
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
            formik.setStatus(0);
          });
      } else {
        setNewReserveSurgery(
          {
            dateOfDay: formattedDate,
            day: moment(currentDate.date).format("dddd"),
            VisitTime: visitTime,
            doctor_id: doctorId,
            document_id: userInfo.id,
            clinic_id: clinic,
            service_id: values.service_id,
          },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              toast.success("نوبت جراحی با موفقیت رزرو شد");
              setReserve(null);
              // new request
              setReload(!reload);
              router.push({ pathname: window.location.href }, undefined, {
                scroll: false,
              });
              // router.push('/admin/timeline-appointments/')
            }
            formik.setStatus(0);
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
            formik.setStatus(0);
          });
      }
    },
    // validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    // if (user && user.token && clinic) {
    //   getDoctorByClinicService(clinic, {
    //     Authorization: "Bearer " + user.token,
    //   })
    //     .then(({ data }) => {
    //       if (data.status === false) {
    //         toast.error(data.message[0]);
    //       } else {
    //         setAllDoctor(data.result);
    //       }
    //     })
    //     .catch((err) => {
    //       if (err.response && err.response.status === 401) {
    //         userDispatch({
    //           type: "LOGOUTNOTTOKEN",
    //         });
    //       }
    //       if (err.response) {
    //         toast.error(err.response.data.message);
    //       }
    //     });
    // }
    if (user && user.token && clinic) {
      getServiceByClinic(clinic, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setAllService([]);
          } else {
            setAllService(data.result);
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
  }, [clinic]);

  const getDoctorsVisitAppointments = async () => {
    if (user && user?.token) {
      await getAllAppointmentVisitService(
        { date: formattedDate },
        {
          Authorization: "Bearer " + user?.token,
        }
      )
        .then(({ data }) => {
          // if (data.status === false) {
          //   toast.error(data.message[0]);
          // } else {
          //   setSurgeryAppointments(data.result);
          // }
          setVisitAppointments(data);
          setSurgeryAppointments(null);
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
  };
  const getDoctorsSurgeryAppointments = async () => {
    if (user && user?.token) {
      await getAllDoctorsAppointmentSurgeryService(
        { date: formattedDate },
        {
          Authorization: "Bearer " + user?.token,
        }
      )
        .then(({ data }) => {
          // if (data.status === false) {
          //   toast.error(data.message[0]);
          // } else {
          //   setSurgeryAppointments(data.result);
          // }
          setSurgeryAppointments(data);
          setVisitAppointments(null);
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
  };

  useEffect(() => {
    if (user && user.token && tab === 0) {
      getDoctorsSurgeryAppointments();
    }
  }, [loading, currentDate, tab, reload]);

  useEffect(() => {
    if (user && user.token && tab === 0) {
      getDoctorsSurgeryAppointments();
      const intervalSurgery = setInterval(() => {
        getDoctorsSurgeryAppointments();
      }, 10000);
      return () => clearInterval(intervalSurgery);
    }
  }, [loading, currentDate, tab]);

  useEffect(() => {
    if (user && user.token && tab === 1) {
      getDoctorsVisitAppointments();
    }
  }, [loading, currentDate, tab, reload]);

  useEffect(() => {
    if (user && user.token && tab === 1) {
      getDoctorsVisitAppointments();
      const intervalVisit = setInterval(() => {
        getDoctorsVisitAppointments();
      }, 10000);
      return () => clearInterval(intervalVisit);
    }
  }, [loading, currentDate, tab]);

  const convert = (date, format = value.format) => {
    let object = { date, format };
    if (date) {
      setValue({
        date: date.toDate(),
      });
    } else {
      setValue({ date: "" });
    }
  };

  // if ((!surgeryAppointments) && (!visitAppointments)) return <PageLoading />;

  //   if (tab === 0) {
  //     if (!surgeryAppointments) {
  //       return <PageLoading />;
  //     }
  //   }

  //   if (tab === 1) {
  //     if (!visitAppointments) {
  //       return <PageLoading />;
  //     }
  //   }

  return (
    <>
      <div className="h-full w-full">
        <div className="flex  items-center justify-between  border-b pb-6">
          <div className="flex items-center gap-x-4">
            <div className="flex items-center ">
              <h1 className="text-gray-900  leading-6">خط زمانی نوبت ها</h1>
            </div>

            <Tabs options={tabs} tab={tab} setTab={setTab} />
          </div>
          <div>
            <div className="flex">
              <div className="">
                <PrimaryBtn onClick={() => setDatePickerModal(true)}>
                  <div className="flex flex-row items-center gap-2 p-3">
                    <span className="text-base leading-5 whitespace-nowrap">
                      {convertToFarsi(currentDate)}
                    </span>
                    <MdCalendarToday />
                  </div>
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>

        {tab === 0 ? (
          <div className="w-full h-full">
            {surgeryAppointments ? (
              <SurgeryTimelineCalendar
                setReserve={setReserve}
                setClinic={setClinic}
                setReservedTimeModal={setReservedTimeModal}
                surgeryAppointments={surgeryAppointments}
                setDocumentId={setDocumentId}
                getInfoLoading={getInfoLoading}
                setGetInfoLoading={setGetInfoLoading}
                documentId={documentId}
                setDoctorId={setDoctorId}
                setVisitTime={setVisitTime}
                setPatientId={setPatientId}
                setSurgeryAppointmentInfoModal={setSurgeryAppointmentInfoModal}
                setReception={setReception}
              />
            ) : (
              <div className="relative w-full h-80 flex items-center justify-center">
                <PageLoading />
              </div>
            )}
          </div>
        ) : (
          <div>
            {visitAppointments ? (
              <VisitTimelineCalendar
                setReserve={setReserve}
                setClinic={setClinic}
                setReservedTimeModal={setReservedTimeModal}
                visitAppointments={visitAppointments}
                setDocumentId={setDocumentId}
                getInfoLoading={getInfoLoading}
                setGetInfoLoading={setGetInfoLoading}
                documentId={documentId}
                setDoctorId={setDoctorId}
                setVisitTime={setVisitTime}
                setPatientId={setPatientId}
                setSurgeryAppointmentInfoModal={setSurgeryAppointmentInfoModal}
                setReception={setReception}
              />
            ) : (
              <div className=" relative w-full h-80 flex items-center justify-center">
                <PageLoading />
              </div>
            )}
          </div>
        )}
      </div>

      {datePickerModal && (
        <Modal>
          <Calendar
            value={value && value.date && value.date}
            onChange={convert}
            calendar={persian}
            locale={persian_fa}
            mapDays={({
              date,
              today,
              selectedDate,
              currentMonth,
              isSameDate,
            }) => {

              if (date.month.name === "اردیبهشت") {
                if (date.day === 26)
                  return {
                    disabled: true,
                    style: { color: "red" },
                  };
              }
              if (date.month.name === "خرداد") {
                if (date.day === 14 || date.day === 15)
                  return {
                    disabled: true,
                    style: { color: "red" },
                  };
              }
              // if (date.month.name === "تیر") {
              //   if (date.day === 8 || date.day === 16)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "مرداد") {
              //   if (date.day === 5 || date.day === 6)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "شهریور") {
              //   if (date.day === 15 || date.day === 23 || date.day === 25)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "مهر") {
              //   if (date.day === 2 || date.day === 11)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "آذر") {
              //   if (date.day === 26)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "بهمن") {
              //   if (date.day === 5 || date.day === 19 || date.day === 22)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
              // if (date.month.name === "اسفند") {
              //   if (date.day === 6 || date.day === 29)
              //     return {
              //       disabled: true,
              //       style: { color: "red" },
              //     };
              // }
            }}
          >
            <div className="w-full p-4 flex flex-row-reverse items-center justify-between">
              <div className="w-24 h-10">
                <button
                  onClick={() => {
                    setDatePickerModal(false);
                  }}
                  className="flex flex-row items-center justify-center rounded-cs  w-full h-full min-w-fit  text-primary-900 border border-primary-900 text-xs xl:text-[13px] hover:shadow-btn duration-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:shadow-none disabled:cursor-not-allowed"
                >
                  انصراف
                </button>
              </div>
              <div className="w-24 h-10">
                <PrimaryBtn
                  onClick={() => {
                    setCurrentDate(value);
                    setSurgeryAppointments(null);
                    setVisitAppointments(null);
                    setDatePickerModal(false);
                  }}
                  text="ثبت"
                />
              </div>
            </div>
          </Calendar>
        </Modal>
      )}
      {reserve && (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-8 relative rounded-cs max-w-sm w-96 gap-4 flex flex-col"
          >
            <CloseBtn onClick={() => setReserve(null)} />
            <h2 className="text-xl">
              ثبت نوبت {tab === 1 ? "ویزیت" : "جراحی"}
            </h2>
            <div className="w-full h-12">
              <SearchInPatients
                setUser={setUserInfo}
                access="admin"
                placeholder="نام بیمار"
              />
            </div>
            <SelectInput
              formik={formik}
              label="نوع خدمات"
              name="service_id"
              selectOption={allService}
              labelOption="title"
              valueOption="id"
            />
            <div className="w-full  h-12">
              <PrimaryBtn text="ثبت" type="submit" />
            </div>
          </form>
        </Modal>
      )}

      {documentId && (
        <Modal>
          {!getInfoLoading ? (
            <div className=" bg-white w-[359px] h-[390px] px-4 py-6 flex flex-col rounded-cs">
              <h1 className="text-sm ">
                کارشناس :
                {tab === 0
                  ? `${
                      surgeryAppointmentInfo?.supplier
                        ? surgeryAppointmentInfo?.supplier?.first_name
                        : ""
                    } ${
                      surgeryAppointmentInfo?.supplier
                        ? surgeryAppointmentInfo?.supplier?.last_name
                        : ""
                    }`
                  : `${
                      visitAppointmentInfo?.supplier
                        ? visitAppointmentInfo?.supplier?.first_name
                        : ""
                    } ${
                      visitAppointmentInfo?.supplier
                        ? visitAppointmentInfo?.supplier?.last_name
                        : ""
                    }`}
              </h1>
              <div className="w-full h-full border rounded-xl overflow-hidden mb-4 mt-4">
                <table className="w-full h-full rounded-xl text-xs text-center">
                  <tr className="border-b">
                    <td className="border-l py-2">نام بیمار</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.document.name
                        : visitAppointmentInfo?.document.name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-l py-2">مطب</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.clinic.title
                        : visitAppointmentInfo?.clinic.title}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-l py-2">پزشک</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.doctor.name
                        : visitAppointmentInfo?.doctor.name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-l py-2">روز</td>
                    <td>
                      {convertDayOfWeek(
                        tab === 0
                          ? surgeryAppointmentInfo?.day
                          : visitAppointmentInfo?.day
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-l py-2">ساعت</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.VisitTime
                        : visitAppointmentInfo?.VisitTime}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-l py-2">خدمات</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.service.title
                        : visitAppointmentInfo?.service.title}
                    </td>
                  </tr>
                  <tr className="">
                    <td className="border-l py-2">نوع نوبت</td>
                    <td>
                      {tab === 0
                        ? surgeryAppointmentInfo?.vip
                          ? "ویژه"
                          : "معمولی"
                        : visitAppointmentInfo?.vip
                        ? "ویژه"
                        : "معمولی"}
                    </td>
                  </tr>
                </table>
              </div>
              <div className="flex flex-row justify-end items-center gap-2">
                <div className="w-24 h-8">
                  <Link href={`${access}/record/detail/?id=${patientId}`}>
                    <a target="_blank" rel="noreferrer">
                      <PrimaryBtn
                        text="پرونده"
                        onClick={() => {
                          // router.push(`${access}/record/detail/?id=${patientId}`);
                          setDocumentId(null);
                        }}
                      />
                    </a>
                  </Link>
                </div>
                {reception !== 2 && reception !== 1 && (
                  <div className="w-24 h-8">
                    <PrimaryBtn
                      text="پذیرش شد"
                      onClick={() => {
                        setReceptionHandler();
                        setDocumentId(null);
                      }}
                    />
                  </div>
                )}
                {reception !== 2 && (
                  <Tooltip text="ارسال یادآوری">
                    <button
                      onClick={() => remindMessageSurgery(documentId)}
                      type="button"
                      // disabled={remindStatus === 1}
                      className="truncate cursor-pointer w-7 h-7 bg-primary-900  text-3xl flex items-center justify-center rounded-cs font-bold text-black disabled:bg-gray-300 disabled:text-white"
                    >
                      {/* {remindStatus === 1 ? (
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                      <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                    </div>
                  ) : (
                    <span className="text-xl text-white">
                      <MdOutlineChat />
                    </span>
                  )} */}
                      <span className="text-xl text-white">
                        <MdOutlineChat />
                      </span>
                    </button>
                  </Tooltip>
                )}
                {reception !== 2 && (
                  <Tooltip text="ارسال مجدد ویزیت">
                    <button
                      onClick={() => resendMessageSurgery(documentId)}
                      type="button"
                      className=" cursor-pointer w-7 h-7 bg-[#FDAB31]  text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                    >
                      {/* {resendStatus === 1 ? (
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-700 to-white animate-spin rounded-full flex items-center justify-center">
                      <div className="w-[90%] h-[90%] bg-gray-300 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="text-xl relative text-white">
                      <MdCalendarToday />
                      <span className="absolute text-xs -bottom-0.5 right-0 bg-[#FDAB31]">
                        <MdOutlineChat />
                      </span>
                    </div>
                  )} */}
                      <span className="text-xl text-white">
                        <MdCalendarToday />
                      </span>
                    </button>
                  </Tooltip>
                )}
                {reception !== 2 && (
                  <Tooltip text="کنسل نوبت">
                    <button
                      onClick={() => {
                        setCancel(documentId);
                        setType(tab === 0 ? 4 : 3);
                        setDocumentId(null);
                      }}
                      type="button"
                      className=" cursor-pointer w-7 h-7 bg-red-400  text-3xl flex items-center justify-center rounded-cs font-bold text-black "
                    >
                      <div className="relative text-xl text-white">
                        <MdCalendarToday />
                        <span className="text-xs absolute -bottom-0.5 -right-0.5 bg-red-400">
                          <MdOutlineCancel />
                        </span>
                      </div>
                    </button>
                  </Tooltip>
                )}
              </div>
              <CloseBtn
                onClick={() => {
                  setSurgeryAppointmentInfoModal(false);
                  setDocumentId(null);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </Modal>
      )}

      {cancel >= 0 ? (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <div className="bg-white p-8 relative rounded-cs max-w-sm gap-4 flex flex-col">
            <CloseBtn onClick={() => setCancel(-1)} />
            <h2 className="text-xl"> کنسل کردن نوبت</h2>
            <p className="text-[#FF9900] text-sm">
              اخطار!
              <br /> اگر قصد ثبت نوبت جدید دارید ابتدا از موجود بودن نوبت مورد
              نظر اطمینان حاصل نمایید همچنین توجه نمایید که در صورت کنسل شدن،
              اجازه ثبت این نوبت برای افراد دیگر ازاد می باشد.
            </p>
            <textarea
              className="w-full h-60 outline-none border border-primary-400 rounded-cs p-4"
              placeholder="توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="w-full  h-12">
              <PrimaryBtn
                text="ثبت"
                onClick={() => cancelAppointment()}
                disabled={description.length <= 5}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default TimelineCalendar;
