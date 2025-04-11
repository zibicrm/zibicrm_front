import React, { useEffect, useState } from "react";
import LayoutUser from "../../../Layout/LayoutUser";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../../../Provider/PatientAuthProvider";
import { Router } from "next/router";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowForward,
  MdCheck,
  MdOutlineDeleteSweep,
  MdOutlineEditCalendar,
} from "react-icons/md";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import {
  TeethsBL1,
  TeethsBL2,
  TeethsBL3,
  TeethsBL4,
  TeethsBL5,
  TeethsBL6,
  TeethsBL7,
  TeethsBL8,
  TeethsBR1,
  TeethsBR2,
  TeethsBR3,
  TeethsBR4,
  TeethsBR5,
  TeethsBR6,
  TeethsBR7,
  TeethsBR8,
  TeethsTL1,
  TeethsTL2,
  TeethsTL3,
  TeethsTL4,
  TeethsTL5,
  TeethsTL6,
  TeethsTL7,
  TeethsTL8,
  TeethsTR1,
  TeethsTR2,
  TeethsTR3,
  TeethsTR4,
  TeethsTR5,
  TeethsTR6,
  TeethsTR7,
  TeethsTR8,
} from "../../../assets/teeths";
import Modal from "../../../Components/Modal";
import { getAllService } from "../../../Services/serviceRequest";
import { CloseBtn } from "../../../common/CloseBtn";
import PrimaryBtn from "../../../common/PrimaryBtn";
import IconBtn from "../../../common/IconBtn";
import SelectInput from "../../../common/SelectInput";
import { useFormik } from "formik";
import * as yup from "yup";
import AddEvent from "../../../Components/AddEvent";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import { getAllDoctorService } from "../../../Services/doctorServices";
import CurrencyInputComponent from "../../../common/CurrencyInput";
import Tabs from "../../../Components/Tabs";
import { getRecordService } from "../../../Services/recordServices";
import {
  getTreatmentByIdService,
  storeTreatmentPlanService,
} from "../../../Services/treatmentService";
import convertDay from "../../../hooks/ConvertDayToPersian";
import moment from "jalali-moment";
import { ImageBuilding, ImageCheck } from "../../../assets/Images";

const TreatmentPlanPage = () => {
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const [teeths, setTeeths] = useState([]);
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dents, setDents] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [tab, setTab] = useState(0);
  const [select, setSelect] = useState(false);
  const [selectAppointment, setSelectAppointment] = useState(null);
  const [selectAppointmentS, setSelectAppointmentS] = useState(null);
  const [treatment, setTreatment] = useState([]);
  const router = useRouter();
  const id = router.query.id;
  //   const getData = async () => {
  //     if (id) {
  //       await getRecordService(id, {
  //         Authorization: "Bearer " + user.token,
  //       })
  //         .then(({ data }) => {
  //           if (data.status === false) {
  //             toast.error(data.message[0]);
  //           } else {
  //             setData(data.result[0]);
  //           }
  //         })
  //         .catch((err) => {
  //           if (err.response && err.response.status === 401) {
  //             patientDispatcher({
  //               type: "LOGOUTNOTTOKEN",
  //             });
  //           }
  //           if (err.response) {
  //             toast.error(err.response.data.message);
  //           }
  //         });
  //       getTreatmentByIdService(
  //         { document_id: id },
  //         {
  //           Authorization: "Bearer " + user.token,
  //         }
  //       )
  //         .then(({ data }) => {
  //           if (data.status === false) {
  //             toast.error(data.message[0]);
  //           } else {
  //             setTreatment(data.result);
  //           }
  //         })
  //         .catch((err) => {
  //           if (err.response && err.response.status === 401) {
  //             patientDispatcher({
  //               type: "LOGOUTNOTTOKEN",
  //             });
  //           }
  //           if (err.response) {
  //             toast.error(err.response.data.message);
  //           }
  //         });
  //     }
  //   };
  // const head = [
  //   { id: 0, title: "دندان" },
  //   { id: 1, title: "خدمات" },
  //   { id: 5, title: "تعداد" },
  //   { id: 2, title: "قیمت (تومان)" },
  //   { id: 3, title: "وضعیت" },
  //   { id: 4, title: "عملیات" },
  // ];
  // const validationSchema = yup.object({
  //   first_time_id: yup.string().required("انتخاب نوبت اجباری است"),
  //   discount: yup
  //     .string()
  //     .test(
  //       "bigger than sum",
  //       "مبلغ تخفیف نمی تواند بیشتر از مبلغ کل باشد",
  //       (value) => {
  //         if (Number(value) <= renderSum() || !value) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     ),
  //   first_time_type: yup.string().required("نوع نوبت را انتخاب کنید"),
  //   description: yup.string(),
  //   doctor_id: yup.string().required("دکتر تشخیص دهنده را انتخاب کنید"),
  //   document_id: yup.string(),
  // });
  // const initialValues = {
  //   // appointment_surgery_id: "",
  //   // appointment_id: "",
  //   first_time_type: "",
  //   first_time_id: "",
  //   discount: "",
  //   sumPrice: "",
  //   description: "",
  //   final_price: "",
  //   doctor_id: "",
  //   document_id: id,
  // };
  // const formik = useFormik({
  //   initialValues,
  //   onSubmit: (values) => {
  //     formik.setStatus("1");
  //     storeTreatmentPlanService(
  //       { ...values, dents },
  //       {
  //         Authorization: "Bearer " + user.token,
  //       }
  //     )
  //       .then(({ data }) => {
  //         if (data.status === false) {
  //           toast.error(data.message[0]);
  //         } else {
  //           toast.success(data.result[0]);
  //           router.push(`/admin/record/detail/?id=${id}`);
  //         }
  //         formik.setStatus("0");
  //       })
  //       .catch((err) => {
  //         if (err.response && err.response.status === 401) {
  //           patientDispatcher({
  //             type: "LOGOUTNOTTOKEN",
  //           });
  //         }
  //         if (err.response) {
  //           toast.error(err.response.data.message);
  //         }
  //         formik.setStatus("0");
  //       });
  //   },
  //   validationSchema,
  //   validateOnMount: true,
  //   enableReinitialize: true,
  // });
  // const clickHandler = (e) => {
  //   let check = teeths.includes(e);
  //   if (!check) {
  //     setOpen(e);
  //   } else {
  //     let filter = teeths.filter((item) => item !== e);
  //     setTeeths(filter);
  //   }
  // };
  // const checkInclude = (id) => {
  //   let r = dents.find((d) => d.dent === id);
  //   return r;
  // };
  // const renderSum = () => {
  //   let sum = 0;
  //   dents.map((e) => (sum = Number(sum) + Number(e.sum_cost)));
  //   return String(sum);
  // };
  // const tabOptions = [
  //   { text: "ویزیت", id: 0 },
  //   { text: "جراحی", id: 1 },
  // ];
  // const getService = () => {
  //   getAllService({
  //     Authorization: "Bearer " + user.token,
  //   })
  //     .then(({ data }) => {
  //       if (data.status === false) {
  //         toast.error(data.message[0]);
  //         setServices([]);
  //       } else {
  //         setServices(data.result);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response && err.response.status === 401) {
  //         patientDispatcher({
  //           type: "LOGOUTNOTTOKEN",
  //         });
  //       }
  //       if (err.response) {
  //         toast.error(err.response.data.message);
  //       }
  //     });
  // };
  // const getDoctor = async () => {
  //   await getAllDoctorService({
  //     Authorization: "Bearer " + user.token,
  //   })
  //     .then(({ data }) => {
  //       if (data.status === false) {
  //         toast.error(data.message[0]);
  //       } else {
  //         setDoctor(data.result);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.response && err.response.status === 401) {
  //         patientDispatcher({
  //           type: "LOGOUTNOTTOKEN",
  //         });
  //       }
  //       if (err.response) {
  //         toast.error(err.response.data.message);
  //       }
  //     });
  // };
  // const submitHandler = () => {
  //   let res = [];
  //   let lastId = 0;
  //   selectedServices.map((s) => {
  //     res.push({
  //       id: `${Date.now()}${lastId}`,
  //       dent: isOpen,
  //       service_id: s.id,
  //       service_name: s.title,
  //       sum_cost: s.sum_cost,
  //       count: 1,
  //     });
  //     lastId++;
  //   });
  //   setDents([...dents, ...res]);
  //   setSelectedServices([]);
  //   setOpen(false);
  // };
  // const countDent = () => {
  //   let dentListUnique = [];
  //   for (let index = 0; index < dents.length; index++) {
  //     const element = dents[index];
  //     let filter = dentListUnique.find((d) => d === element.dent);
  //     if (!filter) {
  //       dentListUnique.push(element.dent);
  //     }
  //   }
  //   return Number(dentListUnique.length);
  // };
  // const deleteHandler = (id) => {
  //   // deleteTreatmentPlanService(id, {
  //   //   Authorization: "Bearer " + user.token,
  //   // })
  //   //   .then(({ data }) => {
  //   //     if (data.status === false) {
  //   //       toast.error(data.message[0]);
  //   //     } else {
  //   //       toast.error(data.result[0]);
  //   //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     if (err.response && err.response.status === 401) {
  //   //       userDispatch({
  //   //         type: "LOGOUTNOTTOKEN",
  //   //       });
  //   //     }
  //   //     if (err.response) {
  //   //       toast.error(err.response.data.message);
  //   //     }
  //   //   });
  //   let filter = dents.filter((d) => d.id !== id);
  //   setDents(filter);
  // };
  // const incrementHandler = (id) => {
  //   let dent = dents.find((d) => d.id === id);
  //   let res = dents.filter((d) => d.id !== id);
  //   dent.count++;
  //   let temp = [...res, dent];
  //   setDents(temp.sort((a, b) => a.id - b.id));
  // };
  // const decrementHandler = (id) => {
  //   let dent = dents.find((d) => d.id === id);
  //   let res = dents.filter((d) => d.id !== id);
  //   dent.count !== 0 && dent.count--;
  //   let temp = [...res, dent];
  //   setDents(temp.sort((a, b) => a.id - b.id));
  // };
  //   useEffect(() => {
  //     if (user && !loading) {
  //       getService();
  //       getDoctor();
  //     }
  //   }, [loading]);
  //   useEffect(() => {
  //     if (user && !loading) {
  //       getData();
  //     }
  //   }, [loading, id]);
  //   useEffect(() => {
  //     let sum = 0;
  //     dents.map((e) => (sum = Number(sum) + Number(e.sum_cost)));
  //     formik.setFieldValue("sumPrice", sum);
  //   }, [dents]);
  //   useEffect(() => {
  //     if (
  //       !formik.errors.sumPrice &&
  //       !formik.errors.discount &&
  //       renderSum() >= Number(formik.values.discount)
  //     ) {
  //       formik.setFieldValue(
  //         "final_price",
  //         Number(formik.values.sumPrice) - Number(formik.values.discount)
  //       );
  //     } else {
  //       formik.setFieldError(
  //         "final_price",
  //         "تخفیف نمی تواند بیشتر از مبلغ کل باشد"
  //       );
  //     }
  //   }, [formik.values.sumPrice, formik.values.discount]);

  //   useEffect(() => {
  //     if (!user) {
  //       Router.push("/user/user-login");
  //     }
  //   }, []);

  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  return (
    <LayoutUser>
      <div className=" md:mt-8">
        <h1 className="text-gray-900 md:font-bold md:text-xl md:mt-8 ">طرح درمان</h1>
        <div className="mt-24 flex flex-col items-center justify-center ">
          <div className="relative items-center justify-center w-[196px] h-[108px] md:w-[457px] md:h-[257px] ">
            <Image src={ImageBuilding} alt=""  layout="fill"/>
          </div>
          <p className="text-sm md:text-base text-gray-500 text-center mt-6 md:mt-8">
            این صفحه در دست طراحی می باشد
          </p>
        </div>
      </div>
    </LayoutUser>
  );

  return (
    <LayoutUser>
      <div>
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">طرح درمان</h1>
          </div>
          <div className="text-sm text-gray-900">نام بیمار : مهدی بهشتی</div>
        </div>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full p-6 flex flex-col gap-12 "
      >
        <div className="w-full flex flex-col md:flex-row gap-20">
          <div className=" bg-gray-900 min-h-[736px]  md:min-h-[336px] relative w-full md:min-w-[240px] rounded-cs flex flex-col items-center">
            <div className="relative w-[50%]  md:w-full h-1/2">
              {/* top right */}
              {/* <button
                onClick={() => clickHandler("TL1")}
                className={`scale-[1.1] absolute top-[5rem] right-[35%] max-h-fit max-w-fit ${
                  checkInclude("TL1") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL1} alt="teeth" />
                  {checkInclude("TL1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL2")}
                className={`scale-[1.1] absolute top-[5.3rem] right-[29%] ${
                  checkInclude("TL2") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL2} alt="teeth" />
                  {checkInclude("TL2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL3")}
                className={`scale-[1.1] absolute top-[6rem] right-[24%] ${
                  checkInclude("TL3") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL3} alt="teeth" />
                  {checkInclude("TL3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL4")}
                className={`scale-[1.1] absolute top-[7rem] right-[21%] ${
                  checkInclude("TL4") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL4} alt="teeth" />
                  {checkInclude("TL4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL5")}
                className={`scale-[1.1] absolute top-[8.2rem] right-[20%] ${
                  checkInclude("TL5") ? "green-filter" : ""
                }  `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL5} alt="teeth" />
                  {checkInclude("TL5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL6")}
                className={`scale-[1.1] absolute top-[9.7rem]  right-[18%] ${
                  checkInclude("TL6") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL6} alt="teeth" />
                  {checkInclude("TL6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL7")}
                className={`scale-[1.1] absolute top-[13rem] right-[11.5rem] ${
                  checkInclude("TL7") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL7} alt="teeth" />
                  {checkInclude("TL7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TL8")}
                className={`scale-[1.1] absolute top-[14.7rem] right-[10.8rem] ${
                  checkInclude("TL8") ? "green-filter" : ""
                }  `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTL8} alt="teeth" />
                  {checkInclude("TL8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-2">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button> */}
              {/* top left */}
              <button
                onClick={() => clickHandler("TR1")}
                className={`scale-[1.1] absolute top-[5rem] left-[6.5rem] max-h-fit max-w-fit ${
                  checkInclude("TR1") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR1} alt="teeth" />
                  {checkInclude("TR1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR2")}
                className={`scale-[1.1] absolute top-[5.4rem] left-[5.4rem] ${
                  checkInclude("TR2") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR2} alt="teeth" />
                  {checkInclude("TR2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR3")}
                className={`scale-[1.1] absolute top-[6.2rem] left-[4.5rem] ${
                  checkInclude("TR3") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR3} alt="teeth" />
                  {checkInclude("TR3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR4")}
                className={`scale-[1.1] absolute top-[7.3rem] left-[4.2rem] ${
                  checkInclude("TR4") ? "green-filter" : ""
                }  `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR4} alt="teeth" />
                  {checkInclude("TR4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR5")}
                className={`scale-[1.1] absolute top-[8.5rem] left-[4rem] ${
                  checkInclude("TR5") ? "green-filter" : ""
                }  `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR5} alt="teeth" />
                  {checkInclude("TR5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR6")}
                className={`scale-[1.1] absolute top-[10rem] left-[3.5rem] ${
                  checkInclude("TR6") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR6} alt="teeth" />
                  {checkInclude("TR6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button>
              <button
                onClick={() => clickHandler("TR7")}
                className={`scale-[1.1] absolute top-[12rem] left-[3.3rem] ${
                  checkInclude("TR7") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR7} alt="teeth" />
                  {checkInclude("TR7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("TR8")}
                className={`scale-[1.1] absolute top-[14.5rem] left-[3rem] ${
                  checkInclude("TR8") ? "green-filter" : ""
                }  `}
                type="button"
              >
                <div className="relative">
                  <Image src={TeethsTR8} alt="teeth" />
                  {checkInclude("TR8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-3">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
            </div>
            <div className="relative w-[50%]  md:w-full h-1/2">
              {/* bottom right */}
              {/* <button
                onClick={() => clickHandler("BL1")}
                className={`scale-[1.1] absolute bottom-[10.55rem] right-[16.5rem] ${
                  checkInclude("BL1") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL1} alt="teeth" />
                  {checkInclude("BL1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2.5 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL2")}
                className={`scale-[1.1] absolute top-[8.65rem] right-[14.5rem] ${
                  checkInclude("BL2") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL2} alt="teeth" />
                  {checkInclude("BL2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL3")}
                className={`scale-[1.1] absolute top-[7.65rem] right-52 ${
                  checkInclude("BL3") ? "green-filter" : ""
                }`}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL3} alt="teeth" />
                  {checkInclude("BL3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL4")}
                className={`scale-[1.1] absolute top-[6.2rem] right-[11.75rem] ${
                  checkInclude("BL4") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL4} alt="teeth" />
                  {checkInclude("BL4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL5")}
                className={`scale-[1.1] absolute top-[4.7rem] right-[11.5rem] ${
                  checkInclude("BL5") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL5} alt="teeth" />
                  {checkInclude("BL5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL6")}
                className={`scale-[1.1] absolute top-[2.6rem] right-[10.7rem] ${
                  checkInclude("BL6") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL6} alt="teeth" />
                  {checkInclude("BL6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-2 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button> */}
              {/* <button
                onClick={() => clickHandler("BL7")}
                className={`scale-[1.1] absolute top-[1.2rem] right-[10.5rem] ${
                  checkInclude("BL7") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL7} alt="teeth" />
                  {checkInclude("BL7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button> */}
              {/* Bottom Left */}
              <button
                onClick={() => clickHandler("BL8")}
                className={`scale-[1.1] absolute top-[-1rem] right-[10.25rem] ${
                  checkInclude("BL8") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBL8} alt="teeth" />
                  {checkInclude("BL8") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-3 right-3">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR1")}
                className={`scale-[1.1] absolute bottom-[10.5rem] left-[17rem] ${
                  checkInclude("BR1") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR1} alt="teeth" />
                  {checkInclude("BR1") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-3 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR2")}
                className={`scale-[1.1] absolute bottom-[10.9rem] left-[16rem] ${
                  checkInclude("BR2") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR2} alt="teeth" />
                  {checkInclude("BR2") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR3")}
                className={`scale-[1.1] absolute bottom-[11.75rem] left-[15rem] ${
                  checkInclude("BR3") ? "green-filter" : ""
                }`}
              >
                <div className="relative h-0">
                  <Image src={TeethsBR3} alt="teeth" />
                  {checkInclude("BR3") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR4")}
                className={`scale-[1.1] absolute bottom-[13rem] left-[14.75rem] ${
                  checkInclude("BR4") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBR4} alt="teeth" />
                  {checkInclude("BR4") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-0.5 right-0">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR5")}
                className={`scale-[1.1] absolute bottom-[14.25rem] left-[14rem] ${
                  checkInclude("BR5") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBR5} alt="teeth" />
                  {checkInclude("BR5") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-0.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR6")}
                className={`scale-[1.1] absolute bottom-[16rem] left-[13.75rem] ${
                  checkInclude("BR6") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0">
                  <Image src={TeethsBR6} alt="teeth" />
                  {checkInclude("BR6") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1.5 right-1.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR7")}
                className={`scale-[1.1] absolute bottom-[17.5rem] left-[13.5rem] ${
                  checkInclude("BR7") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0  ">
                  <Image src={TeethsBR7} alt="teeth" />
                  {checkInclude("BR7") ? (
                    <div className="w-full h-full absolute text-red-500 bg-opacity-30 top-1 right-1">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
              <button
                onClick={() => clickHandler("BR8")}
                className={`scale-[.8]  absolute bottom-[19.25rem] left-[13rem] ${
                  checkInclude("BR8") ? "green-filter" : ""
                } `}
                type="button"
              >
                <div className="relative h-0 ">
                  <Image
                    src={TeethsBR8}
                    alt="teeth"
                    className="rotate-[155deg]"
                  />
                  {checkInclude("BR8") ? (
                    <div className=" absolute text-2xl text-red-500 bg-opacity-30 top-1 right-1.5">
                      <MdCheck />
                    </div>
                  ) : null}
                </div>{" "}
              </button>
            </div>
            <div className="absolute right-5 top-5 flex flex-col items-center gap-3">
              <div
                className={`text-white flex items-center justify-center bg-primary-900 rounded-cs w-32 h-10 text-xs `}
              >
                تعداد دندان ها : {countDent()}
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full md:w-[calc(100%-680px)] grid grid-cols-2 grid-rows-2 gap-6 pl-8">
            <div className="w-full   h-full border border-primary-900 rounded-cs shadow-[-4px_4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r   flex items-center justify-center">
                  {checkInclude("TL1") ? "L1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r flex items-center justify-center">
                  {checkInclude("TL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r flex items-center justify-center">
                  {checkInclude("TL5") ? "L5" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TL7") ? "L7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL4") ? "L4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center">
                  {checkInclude("TL6") ? "L6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TL8") ? "L8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[4px_4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center ">
                  {checkInclude("TR1") ? "R1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("TR3") ? "R3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("TR5") ? "R5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("TR7") ? "R7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center ">
                  {checkInclude("TR2") ? "R2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("TR4") ? "R4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("TR6") ? "R6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("TR8") ? "R8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[-4px_-4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r   flex items-center justify-center">
                  {checkInclude("BL1") ? "L1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BL3") ? "L3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BL5") ? "L5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BL7") ? "L7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr   flex items-center justify-center">
                  {checkInclude("BL2") ? "L2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("BL4") ? "L4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("BL6") ? "L6" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BL8") ? "L8" : ""}
                </li>
              </ul>
            </div>
            <div className="w-full h-full border border-primary-900 rounded-cs shadow-[4px_-4px_0_rgba(66,103,179,1)] flex flex-row items-center">
              <ul className=" h-full  w-1/2 border-l-gr ">
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center ">
                  {checkInclude("BR1") ? "R1" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BR3") ? "R3" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr-r  flex items-center justify-center">
                  {checkInclude("BR5") ? "R5" : ""}
                </li>
                <li className="h-1/4 w-full  flex items-center justify-center">
                  {checkInclude("BR7") ? "R7" : ""}
                </li>
              </ul>
              <ul className=" h-full w-1/2 ">
                <li className="h-1/4 w-full border-b-gr   flex items-center justify-center">
                  {checkInclude("BR2") ? "R2" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr  flex items-center justify-center">
                  {checkInclude("BR4") ? "R4" : ""}
                </li>
                <li className="h-1/4 w-full border-b-gr flex items-center justify-center ">
                  {checkInclude("BR6") ? "R6" : ""}
                </li>
                <li className="h-1/4 w-full flex items-center justify-center">
                  {checkInclude("BR8") ? "R8" : ""}
                </li>
              </ul>
            </div>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 right-[calc(50%-24px)] w-6 h-6 ">
              All
            </span>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 align-middle -right-12 bg-primary-50 w-10 h-6 text-center rounded ">
              L
            </span>
            <span className="absolute top-[calc(50%-8px)] text-primary-900 -left-4 align-middle text-center w-10 h-6 rounded bg-primary-50">
              R
            </span>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll border ">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right border px-3 border-gray-200 relative text-gray-900"
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {dents.map((d, index) => (
                <tr
                  key={index}
                  className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100"
                >
                  <td
                    className={`w-20 text-right px-3 border-x border-gray-200 `}
                  >
                    <span
                      className={`px-1  border-gray-900 ${
                        d.dent.includes("T") ? "border-b" : "border-t"
                      } ${d.dent.includes("R") ? "border-r" : "border-l"} `}
                    >
                      {d.dent.slice(2, 3)}
                    </span>
                  </td>
                  <td className="  text-right px-3 border-x border-gray-200">
                    {d.service_name}
                  </td>
                  <td className="  text-right px-3 border-x border-gray-200">
                    <div className="h-9 bg-white w-16 border  border-gray-200 rounded-cs relative flex items-center justify-start px-4">
                      {d.count}
                      <button
                        className="absolute left-1 top-0.5 text-base text-gray-600 hover:bg-primary-50 hover:text-gray-900 "
                        type="button"
                        onClick={() => incrementHandler(d.id)}
                      >
                        <MdArrowDropUp />
                      </button>
                      <button
                        className="absolute bottom-0.5 left-1 text-base text-gray-600 hover:bg-primary-50 hover:text-gray-900"
                        type="button"
                        onClick={() => decrementHandler(d.id)}
                      >
                        <MdArrowDropDown />
                      </button>
                    </div>
                  </td>
                  <td className="  text-right px-3 border-x border-gray-200">
                    {CurrencyNum.format(d.sum_cost)}
                  </td>
                  <td className="  text-right px-3 border-x border-gray-200">
                    انجام نشده
                  </td>
                  <td className="  text-right px-3 border-x border-gray-200">
                    <IconBtn
                      icon={<MdOutlineDeleteSweep />}
                      onClick={() => deleteHandler(d.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid max-h-fit grid-rows-1 grid-cols-2 gap-4">
          <div className="flex flex-col  items-center gap-8">
            <SelectInput
              formik={formik}
              label="پزشک تشخیص دهنده"
              name="doctor_id"
              selectOption={doctor}
              labelOption="name"
              valueOption="id"
            />

            <CurrencyInputComponent
              name="sumPrice"
              type="text"
              label="مبلغ کل خدمات"
              formik={formik}
            />
            <CurrencyInputComponent
              name="discount"
              type="text"
              label="تخفیف"
              formik={formik}
            />
            {/* <button className="flex flex-row items-center text-2xl justify-between w-full px-4 py-3 border border-primary-500 rounded-cs">
              <span className="text-sm text-gray-900">ثبت نوبت اولین مراجعه</span>
              <MdOutlineCalendarToday />
            </button> */}
            <div className="w-full h-12">
              <button
                type="button"
                onClick={() => {
                  setSelect(true);
                  formik.setFieldTouched("first_time_id", true);
                }}
                className="rounded-cs relative cursor-pointer w-full h-full px-2 flex items-center justify-start border border-primary-500  text-xs xl:text-sm text-gray-900 disabled:border-gray-100 disabled:text-gray-100 hover:shadow-btn"
              >
                {selectAppointment
                  ? convertDay(selectAppointment.day) +
                    "| " +
                    selectAppointment.VisitTime.slice(0, 5) +
                    " " +
                    moment(selectAppointment.dateOfDay)
                      .locale("fa")
                      .format("YYYY/MM/DD")
                  : selectAppointmentS
                  ? convertDay(selectAppointmentS.day) +
                    "| " +
                    selectAppointmentS.VisitTime.slice(0, 5) +
                    " " +
                    moment(selectAppointmentS.dateOfDay)
                      .locale("fa")
                      .format("YYYY/MM/DD")
                  : "انتخاب نوبت"}

                <span className="text-2xl absolute left-2">
                  <MdOutlineEditCalendar />
                </span>
              </button>
              {formik.errors.first_time_id && formik.touched.first_time_id && (
                <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                  {formik.errors.first_time_id}
                </div>
              )}
            </div>
            <div className="w-full bg-primary-300 rounded-cs h-12 flex flex-row items-center justify-between">
              <p className=" text-center border-l w-1/2 border-gray-900">
                هزینه کل
              </p>
              <p className="w-1/2 text-center">
                {CurrencyNum.format(formik.values.final_price)}تومان
              </p>
            </div>
          </div>
          <div className="h-full  bg-red-100 ">
            <textarea
              placeholder="شرح درمان"
              {...formik.getFieldProps("description")}
              className={`p-2 border border-primary-400 w-full h-full rounded-cs text-sm outline-none col-span-1 row-span-5 `}
            />
          </div>
        </div>
        <div className="grid grid-cols-3  w-full">
          <div className="col-span-2"></div>
          <div className="h-12 ">
            <PrimaryBtn text="ثبت" type={"submit"} status={formik.status} />
          </div>
        </div>
      </form>
      {isOpen ? (
        <Modal>
          <div className="w-96 h-fit bg-white p-6 rounded-cs flex flex-col gap-6">
            <h2 className="text-xl ">نوع خدمت</h2>
            <p className="text-sm text-gray-900">
              لطفا نوع خدمت خود را برای دندان انتخابی تعیین کنید
            </p>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={null}
              isMulti
              options={services}
              getOptionLabel={(option) => option.title}
              getOptionValue={(option) => option.id}
              onChange={(e) => setSelectedServices(e)}
            />
            <div className="w-full h-12">
              <PrimaryBtn
                text="تایید"
                type="button"
                onClick={() => submitHandler()}
              />
            </div>
            <CloseBtn onClick={() => setOpen(false)} />
          </div>
        </Modal>
      ) : null}
      {select === true ? (
        <Modal>
          <div className="w-[560px] relative pt-4 h-96 bg-white rounded-cs p-6 flex flex-col items-start justify-start gap-6 ">
            <div className="flex max-w-[90%] flex-row items-center justify-between w-full">
              <span className="">نوبت های فعال بیمار</span>
              <div>
                <Tabs options={tabOptions} setTab={setTab} tab={tab} />
              </div>
            </div>
            <div className="border-t border-primary-900 w-full">
              {tab === 0 ? (
                treatment.appointment && treatment.appointment.length ? (
                  treatment.appointment.map((item) => (
                    <button
                      key={item.id}
                      className="py-3 w-full text-right text-sm border-b border-primary-100"
                      onClick={() => {
                        setSelectAppointmentS(null);
                        setSelectAppointment(item);
                        setSelect(false);
                        formik.setFieldValue("first_time_type", "0");
                        formik.setFieldValue("first_time_id", item.id);
                      }}
                    >
                      {convertDay(item.day)} |‌{" "}
                      {item.VisitTime.slice(0, 5) +
                        " " +
                        moment(item.dateOfDay)
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                      | دکتر {item.doctor && item.doctor.name}
                    </button>
                  ))
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <div className="h-12 w-36">
                      <PrimaryBtn
                        text="ثبت وقایع"
                        onClick={() => setAdd(true)}
                      />
                    </div>
                  </div>
                )
              ) : treatment.appointmentSurgery &&
                treatment.appointmentSurgery.length ? (
                treatment.appointmentSurgery.map((item) => (
                  <button
                    key={item.id}
                    className="py-3 w-full text-right text-sm border-b border-primary-100"
                    onClick={() => {
                      setSelectAppointmentS(item);
                      setSelectAppointment(null);
                      setSelect(false);

                      formik.setFieldValue("first_time_id", item.id);
                      formik.setFieldValue("first_time_type", "1");
                    }}
                  >
                    {convertDay(item.day)} |‌{" "}
                    {item.VisitTime.slice(0, 5) +
                      " " +
                      moment(item.dateOfDay)
                        .locale("fa")
                        .format("YYYY/MM/DD")}{" "}
                    | دکتر {item.doctor && item.doctor.name}
                  </button>
                ))
              ) : (
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="h-12 w-36">
                    <PrimaryBtn
                      type="button"
                      text="ثبت وقایع"
                      onClick={() => setAdd(true)}
                    />
                  </div>
                </div>
              )}
            </div>
            <CloseBtn onClick={() => setSelect(false)} />
          </div>
        </Modal>
      ) : null}
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} userInfo={data} />
        </Modal>
      ) : null}
    </LayoutUser>
  );
};

export default TreatmentPlanPage;
