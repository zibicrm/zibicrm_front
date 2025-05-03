import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  MdCalendarToday,
  MdCheck,
  MdListAlt,
  MdOutlineCancel,
  MdOutlineGroup,
  MdOutlineMarkunread,
  MdPersonOutline,
  MdRemoveRedEye,
  MdSchedule,
} from "react-icons/md";
import Search from "../../Components/Search";
import Layout from "../../Layout/Layout";
import { useAuth, useAuthActions } from "../../Provider/AuthProvider";

import Tabs from "../../Components/Tabs";
import SelectAppoitment from "../../Components/SelectAppointment";
import Calendar from "../../common/Calendar";
import IconBtn from "../../common/IconBtn";
import { getAllClinicService } from "../../Services/clinicServices";
import { toast } from "react-toastify";
import { getDoctorByClinicService } from "../../Services/doctorServices";
import {
  cancelAppointmentService,
  getDateTableVisit,
  getTimeTableVisit,
  setNewReserveVisit,
} from "../../Services/appointmentService";
import {
  cancelAppointmentSurgeryService,
  getDateTableSurgery,
  getTimeTableSurgery,
  setNewReserveSurgery,
} from "../../Services/appointmentSurgeryService";
import {
  getEventByDataService,
  getAppointmentByDateService,
  getAppointmentSurgeryByDateService,
  getDoneFollowUpEventService,
} from "../../Services/supplierService";

import { useFormik } from "formik";

import { getServiceByClinic } from "../../Services/serviceRequest";
import PageLoading from "../../utils/LoadingPage";
import moment from "jalali-moment";
import Link from "next/link";

import Image from "next/future/image";
import {
  IconAddAppointment,
  IconAppointemntMenu,
  IconCheck,
  IconClinicReport,
  IconDoctorMenu,
  IconParaclinic,
  IconPatientStatus,
  IconRecordMenu,
  IconRollback,
  IconServices,
  IconSms,
  IconSystemicDiseases,
  IconVipAppointment,
} from "../../assets/Icons";
import { RiHospitalLine, RiStethoscopeLine } from "react-icons/ri";
import { BsCurrencyDollar } from "react-icons/bs";
import {
  eventFollowUpLaboratoryDone,
  eventGetTodayLaboratory,
  eventGetTodayLaboratoryFollowup,
  eventReceiveLaboratory,
  reportReferAppointmentService,
  reportReferSurgeryAppointmentService,
} from "../../Services/reportServices";

const Panel = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [tab2, setTab2] = useState(0);
  const [select, setSelect] = useState();
  const [selectShow, setSelectShow] = useState();
  const [allClinic, setAllClinic] = useState([]);
  const [allDoctor, setAllDoctor] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [add, setAdd] = useState(false);
  const [status, setStatus] = useState(0);
  const [statusAppoitmnet, setStatusAppoitmnet] = useState(0);
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [todayEvent, setTodayEvent] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [cancel, setCancel] = useState(-1);
  const [reserve, setReserve] = useState(null);
  const [description, setDescription] = useState("");
  const [days, setDays] = useState([""]);
  const userDispatch = useAuthActions();
  const [threeTable, setThreeTable] = useState([]);
  const [reciveStatus, setReciveStatus] = useState(0);
  const [reciveId, setReciveId] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [allService, setAllService] = useState([]);
  const eventRef = useRef(null);
  const [refer, setRefer] = useState([]);
  const [referStatus, setReferStatus] = useState(0);
  const [mdCheck, setMdCheck] = useState(false);
  const [followupStatus, setFollowUpStatus] = useState(0);
  const [followUpDelivery, setFollowUpDelivery] = useState([]);
  const [doneFollowUp, setDoneFollowUp] = useState(false);
  const [doneFollowUpStatus, setDoneFollowUpStatus] = useState(0);
  const [showDeliveryresult, setShowDeliveryresult] = useState(false);

  const head = [
    { id: 0, title: "شماره پرونده" },
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "پزشک " },
    { id: 9, title: "کارشناس" },
    { id: 10, title: "زمان مراجعه" },
    { id: 8, title: "عملیات" },
  ];
  // const tableThreeHead = [
  //   { id: 2, title: "نام بیمار" },
  //   { id: 3, title: "تاریخ ثبت وقایع" },
  //   { id: 4, title: "مدت زمان گذشته" },
  //   { id: 5, title: "توضیحات" },
  //   { id: 6, title: "تغییر وضعیت" },
  // ];
  const getFollowUp = () => {
    getEventByDataService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTodayEvent(data.result);
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
  const getRefer = () => {
    if (user && !loading) {
      setReferStatus(1);
      if (tab2 === 0) {
        reportReferAppointmentService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setRefer(data.result);
            }
            setReferStatus(0);
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
            setReferStatus(0);
          });
      } else {
        reportReferSurgeryAppointmentService({
          Authorization: "Bearer " + user.token,
        })
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setRefer(data.result);
            }
            setReferStatus(0);
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
            setReferStatus(0);
          });
      }
    }
  };
  const getDelivery = () => {
    if (user && !loading) {
      eventGetTodayLaboratory({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            let tableData = [];
            data.result.map((item) => {
              tableData.push({
                id: item.id,
                pName: item.document.name,
                date: item.created_at,

                followUp: item.follow_up_date,
                description: item.description,
              });
            });

            setThreeTable(tableData);
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
  const eventReceiveLaboratoryStatus = (id) => {
    setReciveStatus(1);
    eventReceiveLaboratory(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success(data.result[0]);
          getDelivery();
          getFollowUpLabratoryData();
        }
        setReciveStatus(0);
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
        setReciveStatus(0);
      });
  };
  const tableTwoHead = [
    { id: 15, title: "شماره پرونده" },
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "پزشک " },
    { id: 14, title: "مطب" },
    { id: 9, title: "کارشناس" },
    { id: 10, title: "زمان مراجعه" },
    { id: 3, title: "عملیات" },
    { id: 30, title: "ثبت درمان" },
  ];

  // GET APPOINTMENTS
  const getAppointment = () => {
    setStatusAppoitmnet(1);
    if (tab === 0) {
      getAppointmentByDateService(
        {
          clinic_id: user.user.clinic_id,
          dateOfDay: selectShow,
          doctor_id: user.user.id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setTodayAppointment(data.result);
          }
          setStatusAppoitmnet(0);
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
          setStatusAppoitmnet(0);
        });
    } else {
      getAppointmentSurgeryByDateService(
        {
          clinic_id: user.user.clinic_id,
          dateOfDay: selectShow,
          doctor_id: user.user.id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setTodayAppointment(data.result);
          }
          setStatusAppoitmnet(0);
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
          setStatusAppoitmnet(0);
        });
    }
  };
  const getFollowUpLabratoryData = () => {
    eventGetTodayLaboratoryFollowup({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          // toast.success(data.result[0]);
          setFollowUpDelivery(data.result);
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
  const cancelAppointment = () => {
    if (tab === 0) {
      cancelAppointmentService(
        {
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
          }
          setCancel(-1);
          setDescription("");
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
          setCancel(-1);
          setDescription("");
        });
    } else {
      cancelAppointmentSurgeryService(
        {
          appointment_id: cancel,
          description,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            if (doctor && clinic) {
              getData();
            } else {
              getAllData();
            }
            j;
          }
          setCancel(-1);
          setDescription("");
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
          setCancel(-1);
          setDescription("");
        });
    }
  };
  const followUpdLabratoryDone = (id) => {
    setFollowUpStatus(1);
    eventFollowUpLaboratoryDone(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success(data.result[0]);
          setMdCheck(false);
          getFollowUpLabratoryData();
        }
        setFollowUpStatus(0);
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
        setFollowUpStatus(0);
      });
  };
  const doneFollowUpEvent = (id) => {
    setDoneFollowUpStatus(1);
    getDoneFollowUpEventService(id, { Authorization: "Bearer " + user.token })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success(data.result[0]);
          setDoneFollowUp(-1);
          getFollowUp();
        }
        setDoneFollowUpStatus(0);
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
        setDoneFollowUpStatus(0);
      });
  };
  function diffYMDHMS(date2) {
    let date1 = moment(Date.now());
    let years = date1.diff(date2, "year");
    date2.add(years, "years");

    let months = date1.diff(date2, "months");
    date2.add(months, "months");

    let days = date1.diff(date2, "days");
    date2.add(days, "days");

    let hours = date1.diff(date2, "hours");
    date2.add(hours, "hours");

    let minutes = date1.diff(date2, "minutes");
    date2.add(minutes, "minutes");

    let seconds = date1.diff(date2, "seconds");
    if (years > 0) return `${years} سال `;
    if (months > 0) return `${months} ماه `;
    if (days > 0) return `${days} روز  `;
    if (hours > 0) return `${hours} ساعت `;
    if (minutes > 0) return `${minutes} دقیقه `;
    if (seconds > 0) return `${seconds} ثانیه `;
  }
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
    if (user && !loading) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllClinic(data.result);
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
      getFollowUp();
      getRefer();
      getDelivery();
      getFollowUpLabratoryData();
    }
    if (router.query.ref === "event") {
      eventRef.current?.scrollIntoView();
    }
  }, [user, loading]);
  useEffect(() => {
    if (user && user.token && clinic) {
      getDoctorByClinicService(clinic, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setAllDoctor(data.result);
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
  useEffect(() => {
    if (user && user.token && doctor && clinic && doctor) {
      if (tab === 0) {
        getDateTableVisit(
          {
            doctor_id: doctor,
            clinic_id: clinic,
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
              setDays(day);
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
        getDateTableSurgery(
          {
            doctor_id: doctor,
            clinic_id: clinic,
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
              setDays(day);
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
  }, [doctor]);
  useEffect(() => {
    if (user && user.token && doctor && clinic && select) {
      setStatus(1);
      if (tab === 0) {
        getTimeTableVisit(
          {
            doctor_id: doctor,
            clinic_id: clinic,
            ...select,
          },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setAllTimes(data.result);
            }
            setStatus(0);
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
            setStatus(0);
          });
      } else {
        getTimeTableSurgery(
          {
            doctor_id: doctor,
            clinic_id: clinic,
            ...select,
          },
          {
            Authorization: "Bearer " + user.token,
          }
        )
          .then(({ data }) => {
            if (data.status === false) {
              toast.error(data.message[0]);
            } else {
              setAllTimes(data.result);
            }
            setStatus(0);
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
            setStatus(0);
          });
      }
    }
    if (user && user.token && clinic && selectShow) {
      getAppointment();
    }
  }, [select, tab, selectShow]);
  useEffect(() => {
    if (user && user.token && clinic && selectShow) {
      getAppointment();
    }
    setSelect(null);
  }, [clinic, doctor]);
  useEffect(() => {
    setDoctor(null);
  }, [clinic]);
  useEffect(() => {
    if (router.query.ref === "event") {
      eventRef.current?.scrollIntoView();
    }
  }, [router.query.ref]);
  useEffect(() => {
    getRefer();
  }, [tab2]);
  const tabs = [
    { id: 0, text: "ویزیت" },
    { id: 1, text: "جراحی" },
  ];
  // const tabs2 = [
  //   { id: 0, text: "ویزیت نشده" },
  //   { id: 1, text: "جراحی نشده" },
  // ];

  // FORMIK FORMIK
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
      if (tab === 0) {
        setNewReserveVisit(
          {
            ...select,
            ...values,
            clinic_id: clinic,
            doctor_id: doctor,
            document_id: userInfo.id,
            VisitTime: reserve,
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
            ...select,
            ...values,
            clinic_id: clinic,
            doctor_id: doctor,
            document_id: userInfo.id,
            VisitTime: reserve,
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

  const Menu = [
    {
      id: 1,
      label: "بیماران",
      icon: <MdOutlineGroup />,
      child: [
        {
          id: 0,
          label: "تشکیل پرونده",
          icon: IconAddAppointment,
          link: "/doctor/record/add",
        },
        {
          id: 1,
          label: "پرونده بیماران",
          icon: IconRecordMenu,
          link: "/doctor/record",
        },
        {
          id: 2,
          label: "نوبت دهی ",
          icon: IconAppointemntMenu,
          link: "/doctor/appointment",
        },
        {
          id: 3,
          label: "ثبت نوبت دهی ویژه",
          icon: IconVipAppointment,
          link: "/doctor/vip-appointment",
        },
      ],
    },
    {
      id: 7,
      label: " پیامک ها ",
      icon: <MdOutlineMarkunread />,
      child: [
        {
          id: 1,
          label: "ارسال پیامک ",
          icon: IconSms,
          link: "/doctor/message",
        },
      ],
    },
    {
      id: 9,
      label: "اطلاعات پایه",
      icon: <MdListAlt />,
      child: [
        { id: 0, label: "خدمات", icon: IconServices, link: "/doctor/service" },
        {
          id: 3,
          label: "وضعیت های بیمار",
          icon: IconPatientStatus,

          link: "/doctor/patient-status",
        },
        {
          id: 4,
          label: " بیماری های سیستمیک",
          icon: IconSystemicDiseases,
          link: "/doctor/diseases",
        },
      ],
    },
    {
      id: 2,
      label: "پزشکان",
      icon: (
        <div className="relative text-xl w-5 h-5">
          <MdPersonOutline />
          <div className="text-xs absolute -right-1 top-0 block">
            <RiStethoscopeLine />
          </div>
        </div>
      ),
      child: [
        {
          id: 0,
          label: "پزشکان",
          icon: IconDoctorMenu,
          link: "/doctor/doctor",
        },
      ],
    },

    {
      id: 4,
      label: "حسابداری",
      icon: <BsCurrencyDollar />,
      value: "",
      child: [
        {
          id: 0,
          label: "مدیریت چک ها",
          icon: IconCheck,
          link: "/doctor/finance/checks",
        },
        {
          id: 1,
          label: "عودت ها",
          icon: IconRollback,
          link: "/doctor/finance/rollback",
        },
        {
          id: 2,
          label: "گزارشات مالی مطب",
          icon: IconClinicReport,
          link: "/doctor/finance",
        },
      ],
    },
    {
      id: 5,
      label: "پاراکلینیک",
      icon: <RiHospitalLine />,
      child: [
        {
          id: 0,
          label: "پاراکلینیک ها",
          icon: IconParaclinic,
          link: "/doctor/paraclinic",
        },
      ],
    },
    // {
    //   id: 10,
    //   label: "پروفایل کاربری",
    //   icon: <MdPersonOutline />,
    //   value: "",
    //   child: [
    //     {
    //       id: 0,
    //       label: "نمایش پروفایل",
    //       icon: IconProfile,
    //       link: "",
    //     },
    //     {
    //       id: 0,
    //       label: "تغییر رمز عبور",
    //       link: "/clinic/user/change-password",
    //       icon: IconChangePassword,
    //     },
    //     {
    //       id: 0,
    //       label: "شکایات-انتقادات-پیشنهادات",
    //       value: "add",
    //       icon: "",
    //     },
    //   ],
    // },
  ];

  // ACCESS CHANGE
  if (user && user.user.rule !== 3 && user.user.doctor !== 1)
    return <Error statusCode={404} />;
  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between gap-3 mb-4">
          <div className="h-14 my-6 rounded-cs border border-gray-300 w-full">
            {/* ACCESS CHANGE */}
            <Search access="doctor" />
          </div>
        </div>
      </div>
      <div className="py-4 px-8 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-6 shadow-cs p-4">
          <div className="flex flex-row items-start justify-between w-full">
            <div className="w-full flex items-center justify-between gap-x-4">
              <span>نوبت های جاری</span>
              <Tabs options={tabs} setTab={setTab} tab={tab} />
            </div>
          </div>
          <div
            className="col-span-3 flex flex-row items-start w-full border rounded-cs
           border-primary-900 "
          >
            <div
              className={`w-1/2 flex flex-row justify-between pt-6 px-4 min-h-[475px] border-l border-primary-900`}
            >
              {select && select.dateOfDay ? (
                <div className={"w-full"}>
                  <SelectAppoitment
                    allTimes={allTimes}
                    select={select}
                    status={status}
                    back={true}
                    setSelect={setSelect}
                    setReserve={setReserve}
                    reserve={reserve}
                    setSelectShow={setSelectShow}
                  />
                </div>
              ) : (
                <Calendar
                  setSlectShow={setSelectShow}
                  select={select}
                  setSelect={setSelect}
                  days={days}
                  vip={false}
                />
              )}
            </div>
            <div className="flex flex-col p-6 gap-6 w-9/12 max-h-[475px] min-h-[475px]  ">
              <span className="text-gray-900">
                نوبت های {tab === 0 ? "ویزیت" : "جراحی"}{" "}
                {todayAppointment.length
                  ? moment(selectShow).locale("fa").format("YYYY/MM/DD")
                  : null}{" "}
              </span>
              <div className="w-full max-w-full overflow-x-scroll border min-h-[380px]">
                <table className="w-full relative min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                  <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                    <tr className="text-right text-sm">
                      <th className="w-20 text-center border-l border-b text-gray-900 border-gray-200 relative">
                        ردیف
                      </th>

                      {head.map((item) => (
                        <th
                          key={item.id}
                          className=" text-right border-l border-b px-3 border-gray-200 relative text-gray-900"
                          // onClick={() => setSort("date")}
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto w-full min-h-[400px] ">
                    {todayAppointment &&
                      statusAppoitmnet === 0 &&
                      todayAppointment.map((item, index) => (
                        <tr
                          key={index}
                          className={`h-12 cursor-pointer text-xs  hover:bg-primary-50 duration-100 ${
                            item.status !== 1 ? "text-red-700" : "text-gray-600"
                          }`}
                        >
                          <td className="w-6  text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                              rel="noopener noreferrer"
                            >
                              <a target={"_blank"}>{index + 1}</a>
                            </Link>
                          </td>
                          <td className="w-6   text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                              rel="noopener noreferrer"
                            >
                              <a target={"_blank"}>
                                {item.document && item.document.document_id
                                  ? item.document.document_id
                                  : "ثبت نشده"}
                              </a>
                            </Link>
                          </td>

                          <td className=" text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                            >
                              <a target={"_blank"} rel="noopener noreferrer">
                                {item.document && item.document.name}
                              </a>
                            </Link>
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                            >
                              <a target={"_blank"} rel="noopener noreferrer">
                                {item.document && item.document.tell}
                              </a>
                            </Link>
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                            >
                              <a target={"_blank"} rel="noopener noreferrer">
                                {item.doctor && item.doctor.name}
                              </a>
                            </Link>
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                            >
                              <a target={"_blank"} rel="noopener noreferrer">
                                {item.supplier &&
                                  item.supplier.first_name +
                                    " " +
                                    item.supplier.last_name}
                              </a>
                            </Link>
                          </td>

                          <td
                            className={` text-right px-3 border-x border-gray-200 `}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/doctor/record/detail/?id=${item.document_id}`}
                            >
                              <a target={"_blank"} rel="noopener noreferrer">
                                {item.VisitTime.slice(0, 5)}
                              </a>
                            </Link>
                          </td>
                          <td
                            onClick={(e) => e.stopPropagation()}
                            className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12  border-gray-200"
                          >
                            <IconBtn
                              icon={<MdSchedule />}
                              onClick={() => setAdd(item.document)}
                            />

                            {item.status === 2 ? null : (
                              <IconBtn
                                icon={
                                  <div className="relative text-2xl">
                                    <MdCalendarToday />
                                    <span className="text-[16px] absolute bg-white -bottom-0.5 -right-0.5">
                                      <MdOutlineCancel />
                                    </span>
                                  </div>
                                }
                                onClick={() => setCancel(item.id)}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    {statusAppoitmnet === 1 && (
                      <div className=" w-full h-80 flex items-center justify-center">
                        <PageLoading />
                      </div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {todayEvent.length < 1 ? null : (
          <div className="w-full flex flex-row items-start text-sm gap-6">
            <div className="flex flex-col shadow-cs p-6 gap-6  w-full">
              <span className="text-gray-900">پیگیری های امروز</span>
              <div
                className="flex flex-col gap-2.5 min-h-[400px]"
                ref={eventRef}
              >
                {todayEvent.map((item, index) => (
                  <div
                    key={item}
                    className="flex flex-row items-center justify-between p-4 border border-red-300 rounded-cs bg-white hover:bg-red-50"
                  >
                    <div className="flex flex-row items-center  text-gray-900  ">
                      <div className="mx-1 mt-[3px] border border-red-300 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        <span className="mt-[3px]">{index + 1}</span>
                      </div>
                      <span className="px-1 border-l   border-primary-900">
                        {item &&
                          moment(item.follow_up_date)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                      </span>
                      <span className="px-1 ">
                        {item.document && item.document.name}
                      </span>
                      <span className="px-1 border-x border-primary-900">
                        {item.document && item.document.tell}
                      </span>
                      <span className="px-1 ">{item && item.description}</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <button
                        onClick={() => setDoneFollowUp(item.id)}
                        type="button"
                        className=" cursor-pointer w-8 h-8  px-2 text-3xl flex items-center justify-center rounded-cs font-bold bg-white text-green-500 duration-300 hover:bg-green-700 hover:text-white"
                      >
                        <span className="text-2xl">
                          {" "}
                          <MdCheck />
                        </span>
                      </button>
                      <IconBtn
                        icon={<MdSchedule />}
                        onClick={() => setAdd(item.document)}
                      />
                      <IconBtn
                        icon={<MdRemoveRedEye />}
                        onClick={() =>
                          router.push(
                            `/doctor/record/detail/?id=${item.document.id}`
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* <div className="w-full flex flex-col items-center gap-4 p-6 shadow-cs rounded-cs">
          <div className="w-full flex items-center justify-between">
            <span className="text-gray-900">
              {tab2 === 0 ? "ویزیت" : "جراحی"} نشده ها
            </span>
            <Tabs options={tabs2} setTab={setTab2} tab={tab2} />
          </div>
          <div className="w-full max-w-full border min-h-[380px] max-h-[400px] overflow-y-auto">
            <table className="w-full relative min-w-[600px] md:min-w-fit  max-w-full  ">
              <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                <tr className="text-right text-sm">
                  <th className="w-20 text-center border-l border-b text-gray-900 border-gray-200 relative">
                    ردیف
                  </th>

                  {tableTwoHead.map((item) => (
                    <th
                      key={item.id}
                      className=" text-right border-l border-b px-3 border-gray-200 relative text-gray-900"
                      // onClick={() => setSort("date")}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto w-full min-h-[400px] ">
                {refer &&
                  referStatus === 0 &&
                  refer.map((item, index) => (
                    <tr
                      key={index}
                      className={`h-12 cursor-pointer text-xs  hover:bg-primary-50 duration-100 ${
                        item.status !== 1 ? "text-red-700" : "text-gray-600"
                      }`}
                    >
                      <td className="w-6  text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                          rel="noopener noreferrer"
                        >
                          <a target={"_blank"}>{index + 1}</a>
                        </Link>
                      </td>
                      <td className="w-6   text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                          rel="noopener noreferrer"
                        >
                          <a target={"_blank"}>
                            {item.document
                              ? item.document.document_id
                              : "ثبت نشده"}
                          </a>
                        </Link>
                      </td>

                      <td className=" text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.document && item.document.name}
                          </a>
                        </Link>
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.document && item.document.tell}
                          </a>
                        </Link>
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.doctor && item.doctor.name}
                          </a>
                        </Link>
                      </td>

                      <td className=" text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.clinic && item.clinic.title}
                          </a>
                        </Link>
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.supplier &&
                              item.supplier.first_name +
                                " " +
                                item.supplier.last_name}
                          </a>
                        </Link>
                      </td>

                      <td
                        className={` text-right px-3 border-x border-gray-200 `}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/clinic/record/detail/?id=${item.document_id}`}
                        >
                          <a target={"_blank"} rel="noopener noreferrer">
                            {item.VisitTime.slice(0, 5) +
                              " " +
                              moment(item.dateOfDay)
                                .locale("fa")
                                .format("YYYY/M/D")}
                          </a>
                        </Link>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12  border-gray-200"
                      >
                        <IconBtn
                          icon={<MdSchedule />}
                          onClick={() => setAdd(item.document)}
                        />

                        {item.status === 2 ? null : (
                          <IconBtn
                            icon={
                              <div className="relative text-2xl">
                                <MdCalendarToday />
                                <span className="text-[16px] absolute bg-white -bottom-0.5 -right-0.5">
                                  <MdOutlineCancel />
                                </span>
                              </div>
                            }
                            onClick={() => setCancel(item.id)}
                          />
                        )}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className=" text-right items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-r border-gray-200"
                      >
                        <Link
                          href={`/clinic/record/detail/health/?id=${item.document_id}`}
                        >
                          <a
                            className="w-28 h-8 block"
                            target={"_blank"}
                            rel="noopener noreferrer"
                          >
                            <PrimaryBtn text="ثبت درمان" />
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                {referStatus === 1 && (
                  <div className=" w-full h-80 flex items-center justify-center">
                    <PageLoading />
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
      {/* {mdCheck ? (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <div className="w-[400px]  bg-white rounded p-6 font-normal text-sm flex flex-col gap-6 justify-items-center ">
            <div className="flex justify-between ">
              <h1 className="text-xl text-gray-900">اتمام پیگیری</h1>
              <CloseBtn onClick={() => setMdCheck(false)} />
            </div>
            <p className=" text-sm">جهت نصب روکش تایم اختصاص داد شد؟</p>
            <div className="flex items-center justify-between gap-6">
              <div className="w-1/2 h-12">
                <OutlineBtn text="ثبت نوبت" onClick={() => setAdd(mdCheck)} />
              </div>
              <div className="w-1/2 h-12">
                <PrimaryBtn
                  text="بله"
                  onClick={() => followUpdLabratoryDone(mdCheck.eventId)}
                  status={followupStatus}
                  disabled={followupStatus === 1}
                />
              </div>
            </div>
          </div>
        </Modal>
      ) : null} */}
      {/* {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={add} />
        </Modal>
      ) : null} */}
      {/* {cancel >= 0 ? (
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
      ) : null} */}
      {/* {doneFollowUp > 0 ? (
        <Modal>
          <div className="w-[400px] bg-white p-6 flex flex-col items-center gap-12">
            <div className="flex flex-row justify-between w-full  ">
              <h2 className="text-xl">آيا از انجام پیگیری اطمینان دارید؟</h2>
              <CloseBtn onClick={() => setDoneFollowUp(-1)} />
            </div>
           
            <div className="flex w-full flex-row items-center justify-between gap-6">
              <div className="w-full h-12">
                <OutlineBtn text="انصراف" onClick={() => setDoneFollowUp(-1)} />
              </div>
              <div className="w-full h-12">
                <PrimaryBtn
                  text="تایید"
                  disabled={doneFollowUpStatus === 1}
                  status={doneFollowUpStatus}
                  onClick={() => doneFollowUpEvent(doneFollowUp)}
                />
              </div>
            </div>
          </div>
        </Modal>
      ) : null} */}
      {/* {reserve ? (
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
              ثبت نوبت {tab === 0 ? "ویزیت" : "جراحی"}
            </h2>
            <div className="w-full h-12">
              <SearchInPatients
                setUser={setUserInfo}
                access="clinic"
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
      ) : null} */}
    </Layout>
  );
};

export default Panel;
