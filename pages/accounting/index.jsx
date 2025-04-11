import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdListAlt,
  MdOutlineCancel,
  MdOutlineFeaturedPlayList,
  MdOutlineGroup,
  MdOutlineMarkunread,
  MdPersonOutline,
  MdSchedule,
} from "react-icons/md";
import Search from "../../Components/Search";
import Layout from "../../Layout/Layout";
import { useAuth, useAuthActions } from "../../Provider/AuthProvider";
import Tabs from "../../Components/Tabs";
import IconBtn from "../../common/IconBtn";
import { toast } from "react-toastify";
import { getDoctorByClinicService } from "../../Services/doctorServices";
import {
  getDateTableVisit,
  getTimeTableVisit,
} from "../../Services/appointmentService";
import {
  getDateTableSurgery,
  getTimeTableSurgery,
} from "../../Services/appointmentSurgeryService";
import {
  getAppointmentByDateService,
  getAppointmentSurgeryByDateService,
} from "../../Services/supplierService";
import PrimaryBtn from "../../common/PrimaryBtn";
import { getServiceByClinic } from "../../Services/serviceRequest";
import PageLoading from "../../utils/LoadingPage";
import moment, { from } from "jalali-moment";
import Link from "next/link";
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
  getStatusChecksService,
  todayInternalCheckService,
  todayPeymentService,
  getTodayRollbackFinanceService,
} from "../../Services/financeServices";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import OutlineBtn from "../../common/OutlineBtn";
import SelectInput from "../../common/SelectInput";
import Input from "../../common/Input";
import { CloseBtn } from "../../common/CloseBtn";
import Modal from "../../Components/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import Pdf from "react-to-pdf";
import { FaFilePdf } from "react-icons/fa";
import { useExcelDownloder } from "react-xls";
import LoadingBtn from "../../utils/LoadingBtn";

const Panel = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [checkTab, setCheckTab] = useState(0);
  const [select, setSelect] = useState();
  const [selectShow, setSelectShow] = useState();
  const [allDoctor, setAllDoctor] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [add, setAdd] = useState(false);
  const [status, setStatus] = useState(0);
  const [statusPayment, setStatusPayment] = useState(0);
  const [statusCheck, setStatusCheck] = useState(0);
  const [todayPayment, setTodayPayment] = useState([]);
  const [todayCheck, setTodayCheck] = useState([]);
  const [todayRollback, setTodayRollback] = useState([]);
  const [statusRollback, setStatusRollback] = useState(0);

  const [allTimes, setAllTimes] = useState([]);
  const [cancel, setCancel] = useState(-1);
  const [days, setDays] = useState([""]);
  const userDispatch = useAuthActions();
  const [allService, setAllService] = useState([]);
  const eventRef = useRef(null);
  const [refer, setRefer] = useState([]);
  const [referStatus, setReferStatus] = useState(0);
  const [isTreatment, setTreatment] = useState(false);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(1);
  const [addCount, setAddCount] = useState(0);
  const [lastList, setLastList] = useState(false);
  const pdfRef = useRef();
  const [showExcell, setShowExcell] = useState(false);
  const [disable, setdisable] = useState(false);
  const head = [
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تلفن همراه" },
    { id: 4, title: "مبلغ قابل پرداخت" },
    { id: 3, title: "نوع پرداخت " },
    { id: 7, title: "تاریخ سر  رسید" },
    { id: 5, title: "کلینیک" },
    { id: 8, title: "کارشناس" },
    { id: 6, title: "عملیات " },
  ];

  const tableTwoHead = [
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تاریخ سر رسید" },
    { id: 3, title: "مبلغ قابل پرداخت " },
    { id: 4, title: "زمان گذشته از تاریخ سر رسید  " },
    { id: 5, title: "وضعیت " },
  ];
  const tableThreeHead = [
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "مبلغ " },
    { id: 3, title: "شناسه حساب" },
    { id: 4, title: "دارنده حساب" },
    { id: 5, title: "عملیات " },
  ];
  const { ExcelDownloder, Type } = useExcelDownloder();
  const [excellFile, setExcellFile] = useState([]);
  // console.log("excellFile", excellFile);
  // const [receiveFile, setReceiveFile] = useState(false);
  const [showDownload, setShowdownload] = useState(false);
  const [final, setFinal] = useState(true);
  const [send, setSend] = useState(false);
  const [recieve, setRecieve] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const data1 = {
    fils: excellFile,
  }; 

  const getTodayPayment = () => {
    setStatusPayment(1);
    todayPeymentService(
      { page: currPage, count: 50 },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTodayPayment(data.result);
          console.log(data.result, "excell");
          // let result = data.result;
          // let excellExport = [];
          // result.map((u) => {
          //   excellExport.push({
          //     بیمار: u.document.name,
          //     تلفن: u.document.tell,
          //     مبلغ: u.amount,
          //     پرداختی: u.serial === "1" ? "اقساط" : "چک",
          //     تاریخ: moment(u.date).locale("fa").format("YYYY/MM/DD"),
          //     کلینیک: u.treatment.clinic.title,

          //     کارشناس: u.user && u.user.first_name + " " + u.user.last_name,
          //   });
          // });
          // setExcellFile(excellExport);
        }
        setStatusPayment(0);
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
        setStatusPayment(0);
      });
  };
  const getTodayChecks = () => {
    setStatusCheck(1);
    todayInternalCheckService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTodayCheck(data.result);
        }
        setStatusCheck(0);
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
        setStatusCheck(0);
      });
  };
  const getTodayRollback = () => {
    setStatusRollback(1);
    getTodayRollbackFinanceService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setTodayRollback(data.result);
        }
        setStatusRollback(0);
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
        setStatusRollback(0);
      });
  };
  const getTodayPaymentPaginate = () => {
    if (!lastList) {
      todayPeymentService(
        { page: currPage, count: 50 },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            if (data.result.length === 0) {
              setLastList(true);
            } else {
              setTodayPayment([...todayPayment, ...data.result]);
            }
          }
          setStatusPayment(0);
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
          setStatusPayment(0);
        });
    }
  };

  const validationSchema = yup.object({
    status: yup.string().required("وضعیت را وارد کنید"),
  });
  // const validationSchema1 = yup.object({
  //   count: yup.string().required("تعداد را وارد کنید "),
  // });
  const initialValues = {
    treatment_id: "",
    status: "",
  };
  const excellinitialValuse = {
    count: " ",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      getStatusChecksService(
        { ...values, check_id: treatmentItem },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("با موفقیت ثبت شد");
            getTodayPayment();
          }
          setTreatment(false);
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
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  const paymentFormik = useFormik({
    initialValues: excellinitialValuse,
    onSubmit: (values) => {
      // setStatusPayment(1);

      setdisable(true);

      todayPeymentService(
        { page: currPage, count: values.count },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setdisable(false);
            values.count = " ";
            let result = data.result;
            let excellExport = [];
            result.map((u) => {
              excellExport.push({
                بیمار: u.document.name,
                تلفن: u.document.tell,
               
                مبلغ:  CurrencyNum.format(u.amount) ,
                پرداختی: u.serial === "1" ? "اقساط" : "چک",
                تاریخ: moment(u.date).locale("fa").format("YYYY/MM/DD"),
                کلینیک: u.treatment.clinic.title,

                کارشناس: u.user && u.user.first_name + " " + u.user.last_name,
              });
            });

            setExcellFile(excellExport);
            setShowLoading(false);
            setFinal(false);
            // setRecieve(true)

            console.log(data.result, "excell");
          }
          // setStatusPayment(0);
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
          setStatusPayment(0);
        });
    },
    //  validationSchema:validationSchema1,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && !loading) {
      getTodayPayment();
      getTodayChecks();
      getTodayRollback();
    }
    // if (user && user.user.rule !== 3) {
    //   router.push("/");
    // }
  }, [user, loading]);
  useEffect(() => {
    if (user && !loading) {
      getTodayPaymentPaginate();
    }
  }, [currPage]);
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

  const tabs = [
    { id: 0, text: "بدهکار" },
    { id: 1, text: "بستانکار" },
  ];
  const checkTabs = [
    { id: 0, text: "امروز" },
    { id: 1, text: "فردا" },
  ];
  const statusOption = [
    { id: 1, label: "وصول شده" },
    { id: 2, label: "برگشتی" },
    { id: 3, label: "خرج شده" },
  ];
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
          link: "/clinic/record/add",
        },
        {
          id: 1,
          label: "پرونده بیماران",
          icon: IconRecordMenu,
          link: "/clinic/record",
        },
        {
          id: 2,
          label: "نوبت دهی ",
          icon: IconAppointemntMenu,
          link: "/clinic/appointment",
        },
        {
          id: 3,
          label: "ثبت نوبت دهی ویژه",
          icon: IconVipAppointment,
          link: "/clinic/vip-appointment",
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
          link: "/clinic/message",
        },
      ],
    },
    {
      id: 9,
      label: "اطلاعات پایه",
      icon: <MdListAlt />,
      child: [
        { id: 0, label: "خدمات", icon: IconServices, link: "/clinic/service" },
        {
          id: 3,
          label: "وضعیت های بیمار",
          icon: IconPatientStatus,

          link: "/clinic/patient-status",
        },
        {
          id: 4,
          label: " بیماری های سیستمیک",
          icon: IconSystemicDiseases,
          link: "/clinic/diseases",
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
          link: "/clinic/doctor",
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
          link: "/clinic/finance/checks",
        },
        {
          id: 1,
          label: "عودت ها",
          icon: IconRollback,
          link: "/clinic/finance/rollback",
        },
        {
          id: 2,
          label: "گزارشات مالی مطب",
          icon: IconClinicReport,
          link: "/clinic/finance",
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
          link: "/clinic/paraclinic",
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
  //   if (user && user.user.rule !== 3) return <Error statusCode={404} />;
  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <h1 className="text-xl text-gray-900">داشبورد</h1>
        </div>
      </div>
      <div className="py-4 px-8 flex flex-col gap-8">
        <div className="h-14 my-6 rounded-cs border border-gray-300 w-full">
          <Search access="accounting" />
        </div>
        {/* <div> */}
        <div className="w-full flex flex-col items-center gap-4 p-6 shadow-cs rounded-cs">
          <div className="flex flex-row justify-between  w-full">
            <div>موعد های پرداختی </div>

            <div
              className="w-36 h-12 flex flex-row items-center text-center p-5 hover:shadow-btn duration-200 rounded-cs bg-primary-900  text-white text-xs cursor-pointer "
              onClick={() => {
                setShowExcell(true); //modal
                console.log(showDownload);
                setFinal(true);
                // setSend(true)
              }}
            >
              دریافت فایل اکسل
            </div>
          </div>

          <div
            onScroll={onScroll}
            ref={listInnerRef}
            className="w-full relative max-w-full border min-h-[380px] max-h-[400px] overflow-y-auto"
          >
            <table
              // ref={pdfRef}
              className="w-full  min-w-[600px] md:min-w-fit  max-w-full  "
            >
              <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit sticky top-0 ">
                <tr className="text-right text-sm ">
                  <th className="w-20 text-center border-l border-b shadow-border  border-gray-200  ">
                    ردیف
                  </th>

                  {head.map((item) => (
                    <th
                      key={item.id}
                      className=" text-right border-l shadow-border border-b px-3 border-gray-200  "
                      // onClick={() => setSort("date")}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-y-auto w-full min-h-[400px] ">
                {todayPayment &&
                  statusPayment === 0 &&
                  todayPayment.map((item, index) => (
                    <tr
                      key={index}
                      className={`h-12  text-xs  hover:bg-primary-50 duration-100 `}
                    >
                      <td className="w-6  text-right px-3 border-x border-gray-200">
                        {index + 1}
                      </td>

                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.document && item.document.name}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.document && item.document.tell}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {CurrencyNum.format(item.amount)} تومان
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.serial === "1" ? "اقساط" : "چک"}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {moment(item.date).locale("fa").format("YYYY/MM/DD")}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.treatment &&
                          item.treatment.clinic &&
                          item.treatment.clinic.title}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {item.user &&
                          item.user.first_name + " " + item.user.last_name}
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className=" text-right items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-r border-gray-200"
                      >
                        <div className="w-28 h-8 ">
                          <PrimaryBtn
                            text="تغییر وضعیت"
                            onClick={() => setTreatment(true)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                {statusPayment === 1 && (
                  <div className=" w-full h-80 flex items-center justify-center">
                    <PageLoading />
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="2xl:col-span-4 col-span-10 relative rounded-cs shadow-cs p-6 flex flex-col gap-6">
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <span>چک های داخلی روز </span>
                {todayCheck && (
                  <div className="w-6 h-6 rounded-cs bg-red-50 text-red-700 text-center">
                    {checkTab === 0
                      ? todayCheck &&
                        todayCheck.today &&
                        todayCheck.today.length
                      : todayCheck &&
                        todayCheck.tomorrow &&
                        todayCheck.tomorrow.length}
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center justify-center bg-primary-50 rounded-cs w-fit min-w-fit p-1 ">
                {checkTabs.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-cs min-w-fit w-16 px-3 py-2 text-gray-900 lg:text-base text-sm md:text-base h-9 flex items-center justify-center cursor-pointer ${
                      checkTab === item.id ? "bg-white " : " "
                    } `}
                    onClick={() => setCheckTab(item.id)}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            {statusCheck === 0 ? (
              <div>
                {todayCheck && todayCheck.today ? (
                  <div>
                    {checkTab === 0
                      ? todayCheck.today.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-row items-start justify-between gap-2 py-4 border-b border-primary-400"
                          >
                            <div className="text-2xl flex  relative text-primary-900">
                              <MdOutlineFeaturedPlayList />
                              <span className="text-base absolute top-1 -right-0.5">
                                <MdAttachMoney />
                              </span>
                            </div>
                            <div className="w-full flex flex-col items-center gap-2">
                              <div className="flex flex-row items-center text-sm justify-between w-full">
                                <span>سریال چک : {item.serial}</span>
                                <span className="text-primary-900">
                                  {CurrencyNum.format(item.price)} تومان
                                </span>
                              </div>
                              <div className="flex flex-row items-center text-xs justify-between w-full">
                                <span>
                                  در وجه : {item.name_receiver}(
                                  {item.national_id})
                                </span>
                                <span>
                                  {moment(item.date)
                                    .locale("fa")
                                    .format("YYYY/MM/DD")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      : todayCheck.tomorrow.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-row items-center justify-between gap-2 py-4 border-b border-primary-400"
                          >
                            <div className="text-2xl relative text-primary-900">
                              <MdOutlineFeaturedPlayList />
                              <span className="text-base absolute top-1 -right-0.5">
                                <MdAttachMoney />
                              </span>
                            </div>
                            <div className="w-full flex flex-col items-center gap-2">
                              <div className="flex flex-row items-center text-sm justify-between w-full">
                                <span>سریال چک : {item.serial}</span>
                                <span className="text-primary-900">
                                  {CurrencyNum.format(item.price)} تومان
                                </span>
                              </div>
                              <div className="flex flex-row items-center text-xs justify-between w-full">
                                <span>
                                  در وجه : {item.name_receiver}(
                                  {item.national_id})
                                </span>
                                <span>
                                  {moment(item.date)
                                    .locale("fa")
                                    .format("YYYY/MM/DD")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                ) : (
                  <div className="w-full max-w-full border  min-h-[380px] flex items-center justify-center text-primary-600">
                    داده ای وجود ندارد
                  </div>
                )}
              </div>
            ) : (
              <PageLoading />
            )}
          </div> */}
        {/* </div> */}
        {/* <div className="w-full flex flex-col items-center gap-4 p-6 shadow-cs rounded-cs">
          <div className="w-full flex items-center justify-start gap-2">
            <span>بیماران </span>
            <Tabs options={tabs} setTab={setTab} tab={tab} />
          </div>
          <div className="w-full max-w-full border min-h-[700px] max-h-[800px] overflow-y-auto">
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
              <tbody className="overflow-y-auto w-full min-h-[700px] ">
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
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-6 flex flex-col items-center gap-4 p-6 shadow-cs rounded-cs">
            <div className="w-full flex items-center justify-between">
              <span>عودت های امروز</span>
            </div>
            <div className="w-full max-w-full border min-h-[380px] max-h-[400px] overflow-y-auto">
              <table className="w-full relative min-w-full md:min-w-fit  max-w-full  ">
                <thead className="bg-gray-50 h-[42px] min-w-full md:min-w-fit  sticky top-0">
                  <tr className="text-right text-sm ">
                    <th className="w-20 text-center border-l border-b shadow-border  border-gray-200 ">
                      ردیف
                    </th>

                    {tableThreeHead.map((item) => (
                      <th
                        key={item.id}
                        className=" text-right border-l border-b px-3 shadow-border  border-gray-200 "
                        // onClick={() => setSort("date")}
                      >
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="overflow-y-auto w-full min-h-[400px] ">
                  {todayRollback &&
                    statusRollback === 0 &&
                    todayRollback.record &&
                    todayRollback.record.map((item, index) => (
                      <tr
                        key={index}
                        className={`h-12  text-xs  hover:bg-primary-50 duration-100 `}
                      >
                        <td className="w-6  text-right px-3 border-x border-gray-200">
                          {index + 1}
                        </td>

                        <td className=" text-right px-3 border-x border-gray-200">
                          {item.document && item.document.name}
                        </td>
                        <td className=" text-right px-3 border-x border-gray-200">
                          {CurrencyNum.format(item.amount)}
                        </td>
                        <td className=" text-right px-3 border-x border-gray-200">
                          {item.account_number}
                        </td>

                        <td className=" text-right px-3 border-x border-gray-200">
                          {item.account_name}
                        </td>

                        <td
                          onClick={(e) => e.stopPropagation()}
                          className=" text-right items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-r border-gray-200"
                        >
                          <div className="w-28 h-8 ">
                            <PrimaryBtn
                              text="تغییر وضعیت"
                              onClick={() => setTreatment(true)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  {statusRollback === 1 && (
                    <div className=" w-full h-80 flex items-center justify-center">
                      <PageLoading />
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-span-4 relative rounded-cs shadow-cs p-6 flex flex-col gap-6">
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <span>چک های داخلی روز </span>
                {todayCheck && (
                  <div className="w-6 h-6 rounded-cs bg-red-50 text-red-700 text-center">
                    {checkTab === 0
                      ? todayCheck &&
                        todayCheck.today &&
                        todayCheck.today.length
                      : todayCheck &&
                        todayCheck.tomorrow &&
                        todayCheck.tomorrow.length}
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center justify-center bg-primary-50 rounded-cs w-fit min-w-fit p-1 ">
                {checkTabs.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-cs min-w-fit w-16 px-3 py-2 text-gray-900 lg:text-base text-sm md:text-base h-9 flex items-center justify-center cursor-pointer ${
                      checkTab === item.id ? "bg-white " : " "
                    } `}
                    onClick={() => setCheckTab(item.id)}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            {statusCheck === 0 ? (
              <div>
                {todayCheck && todayCheck.today ? (
                  <div>
                    {checkTab === 0
                      ? todayCheck.today.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-row items-start justify-between gap-2 py-4 border-b border-primary-400"
                          >
                            <div className="text-2xl flex  relative text-primary-900">
                              <MdOutlineFeaturedPlayList />
                              <span className="text-base absolute top-1 -right-0.5">
                                <MdAttachMoney />
                              </span>
                            </div>
                            <div className="w-full flex flex-col items-center gap-2">
                              <div className="flex flex-row items-center text-sm justify-between w-full">
                                <span>سریال چک : {item.serial}</span>
                                <span className="text-primary-900">
                                  {CurrencyNum.format(item.price)} تومان
                                </span>
                              </div>
                              <div className="flex flex-row items-center text-xs justify-between w-full">
                                <span>
                                  در وجه : {item.name_receiver}(
                                  {item.national_id})
                                </span>
                                <span>
                                  {moment(item.date)
                                    .locale("fa")
                                    .format("YYYY/MM/DD")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      : todayCheck.tomorrow.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-row items-center justify-between gap-2 py-4 border-b border-primary-400"
                          >
                            <div className="text-2xl relative text-primary-900">
                              <MdOutlineFeaturedPlayList />
                              <span className="text-base absolute top-1 -right-0.5">
                                <MdAttachMoney />
                              </span>
                            </div>
                            <div className="w-full flex flex-col items-center gap-2">
                              <div className="flex flex-row items-center text-sm justify-between w-full">
                                <span>سریال چک : {item.serial}</span>
                                <span className="text-primary-900">
                                  {CurrencyNum.format(item.price)} تومان
                                </span>
                              </div>
                              <div className="flex flex-row items-center text-xs justify-between w-full">
                                <span>
                                  در وجه : {item.name_receiver}(
                                  {item.national_id})
                                </span>
                                <span>
                                  {moment(item.date)
                                    .locale("fa")
                                    .format("YYYY/MM/DD")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                ) : (
                  <div className="w-full max-w-full border  min-h-[380px] flex items-center justify-center text-primary-600">
                    داده ای وجود ندارد
                  </div>
                )}
              </div>
            ) : (
              <PageLoading />
            )}
          </div>
        </div>
        <div></div>
        {/* <div className="flex flex-row gap-4">
          <div className="w-1/2 flex flex-col flex-wrap  gap-6">
            {Menu.slice(0, 3).map((item) => (
              <Disclosure defaultOpen={true} key={item.id}>
                {({ open }) => (
                  <div
                    className={`p-6 shadow-cs  ${open ? "" : "max-h-[88px]"}`}
                  >
                    <>
                      <Disclosure.Button
                        className={`py-2  w-full ${open ? "" : "max-h-[88px]"}`}
                      >
                        <div className="flex flex-row items-center justify-between w-full">
                          <div className="flex flex-row items-center gap-2 text-2xl">
                            {item.icon}
                            <span className="text-base text-gray-900">{item.label}</span>
                          </div>
                          <span className={open ? "rotate-180" : ""}>
                            <MdArrowDropDown />
                          </span>
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-gray-500 mt-4">
                        <div className="flex flex-row items-center gap-5 ">
                          {item.child.map((c) => (
                            <IconBox
                              key={c.id}
                              icon={<Image src={c.icon} alt={c.label} />}
                              text={c.label}
                              link={c.link}
                              onClick={() => null}
                            />
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
          <div className="w-1/2 flex flex-col flex-wrap gap-6">
            {Menu.slice(3, 9).map((item) => (
              <Disclosure defaultOpen={true} key={item.id}>
                {({ open }) => (
                  <div
                    className={`p-6 shadow-cs  ${open ? "" : "max-h-[88px]"}`}
                  >
                    <>
                      <Disclosure.Button
                        className={`py-2 w-full ${open ? "" : "max-h-[88px]"}`}
                      >
                        <div className="flex flex-row items-center justify-between w-full">
                          <div className="flex flex-row items-center gap-2 text-2xl">
                            {item.icon}
                            <span className="text-base text-gray-900">{item.label}</span>
                          </div>
                          <span className={open ? "rotate-180" : ""}>
                            <MdArrowDropDown />
                          </span>
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-gray-500 mt-4">
                        <div className="flex flex-row items-center gap-5 ">
                          {item.child.map((c) => (
                            <IconBox
                              key={c.id}
                              icon={<Image src={c.icon} alt={c.label} />}
                              text={c.label}
                              link={c.link}
                              onClick={() => null}
                            />
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div> */}
      </div>
      {isTreatment ? (
        <Modal>
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded-cs p-4 w-96 flex flex-col gap-6"
          >
            <span>عملیات </span>
            <div className="flex flex-col gap-6">
              <SelectInput
                label="وضعیت"
                name="status"
                selectOption={statusOption}
                labelOption="label"
                valueOption="id"
                formik={formik}
              />
              {formik.values.status === "3" ? (
                <Input
                  name="title"
                  type="text"
                  label="نام گیرنده چک"
                  formik={formik}
                />
              ) : null}
            </div>
            <div className="w-full flex flex-row items-center gap-3">
              <div className="w-1/2 h-12">
                <OutlineBtn text="انصراف" onClick={() => setTreatment(false)} />
              </div>
              <div className="w-1/2 h-12">
                <PrimaryBtn text="ثبت" type="submit" />
              </div>
            </div>
            <CloseBtn onClick={() => setTreatment(false)} />
          </form>
        </Modal>
      ) : null}
      {showExcell ? (
        <Modal>
          <form
            onSubmit={paymentFormik.handleSubmit}
            className="bg-white rounded-cs p-4 w-96 flex flex-col gap-6"
          >
            <span>تعداد را وارد کنید </span>
            <div className="flex flex-col gap-6">
              <Input
                name="count"
                type="text"
                label="تعداد"
                formik={paymentFormik}
                onChange={paymentFormik.handleChange}
                value={paymentFormik.values.count}
                // value={excellinitialValuse}
              />
            </div>
            <div className="w-full flex flex-row items-center gap-3">
              <div className="w-1/2 h-12">
                <OutlineBtn
                  text="انصراف"
                  onClick={() => setShowExcell(false)}
                />
              </div>
              {final ? (
                <div className="w-1/2 h-12">
                  <PrimaryBtn
                    text="  ارسال"
                    type="submit"
                    disabled={disable}
                  ></PrimaryBtn>
                </div>
              ) : (
                // <LoadingBtn white={true} />
                <div
                  className="flex flex-row items-center justify-center rounded-cs   min-w-fit text-primary-900 text-s w-1/2 h-12"
                  onClick={() => {
                    setShowExcell(false); //modal
                  }}
                >
                  <ExcelDownloder
                    data={data1}
                    filename={"موعد های پرداختی"}
                    type={Type.Button}
                  >
                    دانلود
                  </ExcelDownloder>
                </div>
              )}
            </div>
            <CloseBtn onClick={() => setShowExcell(false)} />
          </form>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Panel;
