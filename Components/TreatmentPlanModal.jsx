import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdCheck, MdOutlineDeleteSweep } from "react-icons/md";
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
} from "../../../../assets/teeths";
import { useAuth } from "../../../../Provider/AuthProvider";
import { getAllService } from "../../../../Services/serviceRequest";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import IconBtn from "../../../../common/IconBtn";
import { useFormik } from "formik";
import * as yup from "yup";
import { CurrencyNum } from "../../../../hooks/CurrencyNum";
import { storeTreatmentPlanService } from "../../../../Services/treatmentService";
import Select from "react-select/dist/declarations/src/Select";
import { CloseBtn } from "../common/CloseBtn";
import Modal from "./Modal";

const TreatmentPlanModal = ({}) => {
  const { user, loading } = useAuth();
  const [teeths, setTeeths] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dents, setDents] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const router = useRouter();
  const id = router.query.id;
  const head = [
    { id: 0, title: "دندان" },
    { id: 1, title: "خدمات" },
    { id: 2, title: "قیمت (تومان)" },
    { id: 3, title: "وضعیت" },
    { id: 4, title: "عملیات" },
  ];
  const validationSchema = yup.object({
    first_time_id: yup.string().required("انتخاب نوبت اجباری است"),
    discount: yup
      .string()
      .test(
        "bigger than sum",
        "مبلغ تخفیف نمی تواند بیشتر از مبلغ کل باشد",
        (value) => {
          if (Number(value) <= renderSum() || !value) {
            return true;
          } else {
            return false;
          }
        }
      ),
    first_time_type: yup.string().required("نوع نوبت را انتخاب کنید"),
    description: yup.string(),
    doctor_id: yup.string().required("دکتر تشخیص دهنده را انتخاب کنید"),
    document_id: yup.string(),
  });
  const initialValues = {

    first_time_type: "",
    first_time_id: "",
    discount: "",
    sumPrice: "",
    description: "",
    final_price: "",
    doctor_id: "",
    document_id: id,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus("1");
      storeTreatmentPlanService(
        { ...values, dents },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            router.push(`/admin/record/detail/?id=${id}`);
          }
          formik.setStatus("0");
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
          formik.setStatus("0");
        });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  const clickHandler = (e) => {
    let check = teeths.includes(e);
    if (!check) {
      setOpen(e);
    } else {
      let filter = teeths.filter((item) => item !== e);
      setTeeths(filter);
    }
  };
  const checkInclude = (id) => {
    let r = dents.find((d) => d.dent === id);
    return r;
  };
  const renderSum = () => {
    let sum = 0;
    dents.map((e) => (sum = Number(sum) + Number(e.sum_cost)));
    return String(sum);
  };

  const submitHandler = () => {
    let res = [];
    let lastId = 0;
    selectedServices.map((s) => {
      res.push({
        id: `${Date.now()}${lastId}`,
        dent: isOpen,
        service_id: s.id,
        service_name: s.title,
        sum_cost: s.sum_cost,
        count: 1,
      });
      lastId++;
    });
    setDents([...dents, ...res]);
    setSelectedServices([]);
    setOpen(false);
  };
  const countDent = () => {
    let dentListUnique = [];
    for (let index = 0; index < dents.length; index++) {
      const element = dents[index];
      let filter = dentListUnique.find((d) => d === element.dent);
      if (!filter) {
        dentListUnique.push(element.dent);
      }
    }
    return Number(dentListUnique.length);
  };
  const deleteHandler = (id) => {
    // deleteTreatmentPlanService(id, {
    //   Authorization: "Bearer " + user.token,
    // })
    //   .then(({ data }) => {
    //     if (data.status === false) {
    //       toast.error(data.message[0]);
    //     } else {
    //       toast.error(data.result[0]);
    //     }
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
    //   });
    let filter = dents.filter((d) => d.id !== id);
    setDents(filter);
  };
  const getService = () => {
    getAllService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setServices([]);
        } else {
          setServices(data.result);
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
      getService();
      getDoctor();
    }
  }, [loading]);
  useEffect(() => {
    if (user && !loading) {
      getData();
    }
  }, [loading, id]);
  useEffect(() => {
    let sum = 0;
    dents.map((e) => (sum = Number(sum) + Number(e.sum_cost)));
    formik.setFieldValue("sumPrice", sum);
  }, [dents]);
  useEffect(() => {
    if (
      !formik.errors.sumPrice &&
      !formik.errors.discount &&
      renderSum() >= Number(formik.values.discount)
    ) {
      formik.setFieldValue(
        "final_price",
        Number(formik.values.sumPrice) - Number(formik.values.discount)
      );
    } else {
      formik.setFieldError(
        "final_price",
        "تخفیف نمی تواند بیشتر از مبلغ کل باشد"
      );
    }
  }, [formik.values.sumPrice, formik.values.discount]);
  const animatedComponents = makeAnimated();

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full p-6 flex flex-col gap-12 "
      >
        <div className="w-full flex flex-row gap-20">
          <div className=" bg-gray-900 min-h-[600px] relative min-w-[600px] rounded-cs flex flex-col items-center">
            <div className="relative  w-full h-1/2">
              <button
                onClick={() => clickHandler("TL1")}
                className={`scale-[1.55] absolute top-12 right-64 max-h-fit max-w-fit ${
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
                className={`scale-[1.55] absolute top-[3.55rem] right-[14.5rem] ${
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
                className={`scale-[1.55] absolute top-[4.5rem] right-[13rem] ${
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
                className={`scale-[1.55] absolute top-[6rem] right-[12rem] ${
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
                className={`scale-[1.55] absolute top-[7.75rem] right-[11.5rem] ${
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
                className={`scale-[1.55] absolute top-[10rem]  right-[10.5rem] ${
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
                className={`scale-[1.55] absolute top-[13rem] right-[10rem] ${
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
                className={`scale-[1.55] absolute top-[15.75rem] right-[9.5rem] ${
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
              </button>
              <button
                onClick={() => clickHandler("TR1")}
                className={`scale-[1.55] absolute top-12 left-[18.5rem] max-h-fit max-w-fit ${
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
                className={`scale-[1.55] absolute top-[3.5rem] left-[16.75rem] ${
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
                className={`scale-[1.55] absolute top-[4.5rem] left-[15.25rem] ${
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
                className={`scale-[1.55] absolute top-[6rem] left-[14rem] ${
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
                className={`scale-[1.55] absolute top-[7.75rem] left-[13.15rem] ${
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
                className={`scale-[1.55] absolute top-[9.97rem] left-[12.25rem] ${
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
                className={`scale-[1.55] absolute top-[12.85rem] left-[11.25rem] ${
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
                className={`scale-[1.55] absolute top-[15.65rem] left-[10.65rem] ${
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
            <div className="relative  w-full h-1/2">
              <button
                onClick={() => clickHandler("BL1")}
                className={`scale-[1.55] absolute bottom-[5.55rem] right-[16.5rem] ${
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
              </button>
              <button
                onClick={() => clickHandler("BL2")}
                className={`scale-[1.55] absolute top-[13.65rem] right-[14.5rem] ${
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
              </button>
              <button
                onClick={() => clickHandler("BL3")}
                className={`scale-[1.55] absolute top-[12.65rem] right-52 ${
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
              </button>
              <button
                onClick={() => clickHandler("BL4")}
                className={`scale-[1.55] absolute top-[10.75rem] right-[11.75rem] ${
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
              </button>
              <button
                onClick={() => clickHandler("BL5")}
                className={`scale-[1.55] absolute top-[8.75rem] right-44 ${
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
              </button>
              <button
                onClick={() => clickHandler("BL6")}
                className={`scale-[1.55] absolute top-[5.85rem] right-40 ${
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
              </button>
              <button
                onClick={() => clickHandler("BL7")}
                className={`scale-[1.55] absolute top-[3.65rem] right-[9.75rem] ${
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
              </button>
              <button
                onClick={() => clickHandler("BL8")}
                className={`scale-[1.55] absolute top-1.5 right-[9.25rem] ${
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
                className={`scale-[1.55] absolute bottom-[5.75rem] left-[17rem] ${
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
                className={`scale-[1.55] absolute bottom-[5.5rem] left-[15rem] ${
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
                className={`scale-[1.55] absolute bottom-[6.5rem] left-[13.5rem] ${
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
                className={`scale-[1.55] absolute bottom-[8.25rem] left-[12.75rem] ${
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
                className={`scale-[1.55] absolute bottom-[10.25rem] left-[12rem] ${
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
                className={`scale-[1.55] absolute bottom-[12.75rem] left-[11.5rem] ${
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
                className={`scale-[1.55] absolute bottom-[14.95rem] left-[11rem] ${
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
                className={`scale-[1]  absolute bottom-[17.25rem] left-[10.25rem] ${
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
          <div className="relative w-[calc(100%-680px)] grid grid-cols-2 grid-rows-2 gap-6 pl-8">
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
    </div>
  );
};

export default TreatmentPlanModal;
