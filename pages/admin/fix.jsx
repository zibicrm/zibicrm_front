import { useRouter } from "next/router";
import { MdArrowRightAlt, MdMoreHoriz } from "react-icons/md";
import Select from "react-select";

import IconBtn from "../../common/IconBtn";
import Layout from "../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";

import Error from "next/error";
import PageLoading from "../../utils/LoadingPage";
import PrimaryBtn from "../../common/PrimaryBtn";
import {
  getPhoneNumberService,
  recivePhoneNumberService,
  setStatusPhoneNumberService,
} from "../../Services/phoneNumberServices";
import moment from "jalali-moment";
import Modal from "../../Components/Modal";
import { CloseBtn } from "../../common/CloseBtn";
import OutlineBtn from "../../common/OutlineBtn";
import Tabs from "../../Components/Tabs";
import axios from "axios";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import convertDay from "../../hooks/ConvertDayToPersian";
import Link from "next/link";
const GetPhoneNumber = () => {
  const [phoneNumbers, setPhoneNumbers] = useState(null);
  const [tr, setTr] = useState(0);
  const [statusBtn, setStatusBtn] = useState(0);
  const [selectAppointment, setSelectAppointment] = useState(null);
  const [selectAppointmentS, setSelectAppointmentS] = useState(null);
  const [cell, setCell] = useState(null);
  const [cell1, setCell1] = useState(null);
  const [tab, setTab] = useState(0);
  const head = [
    { id: 0, title: "نام بیمار ", arrow: false },
    { id: 1, title: "شماره تلفن بیمار ", arrow: false },
    { id: 2, title: "مبلغ دریافتی", arrow: false },
    { id: 3, title: "پزشک", arrow: false },
    { id: 4, title: "مطب", arrow: false },
    { id: 6, title: "توضیحات", arrow: false },
    { id: 5, title: "انتقال", arrow: false },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#6B7280",
      height: "48px",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#6B7280",
      height: "42px",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#6B7280",
      borderRadius: "5px",
      boxShadow: "none",
      backgroundColor: "#fff",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#6B7280",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#6B7280",

      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
  };
  const getData = () => {
    axios
      .get("http://89.42.211.92/api/tr", {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setPhoneNumbers(data.result);
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
  const setStatus = () => {
    axios
      .post(
        "http://89.42.211.92/api/tr/set",
        {
          appointment_id: selectAppointment && selectAppointment.id,
          appointment_surgery_id: selectAppointmentS && selectAppointmentS.id,
          treatment_id: tr,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          //   setPhoneNumbers(data.result);
          toast.success(data.result[0]);
          setCell(null);
          setCell1(null);
          getData();
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
    if (user && user.token) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  const tabOptions = [
    { text: "ویزیت", id: 0 },
    { text: "جراحی", id: 1 },
  ];
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!phoneNumbers) return <PageLoading />;

  return (
    <Layout>
      <div>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <h1 className="text-xl text-gray-900"> اتصال ثبت درمان به نوبت ها</h1>
        </div>
     
        <div className="w-full max-w-full overflow-x-scroll ">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border border-gray-200 relative text-gray-900">
                  ردیف
                </th>
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right border px-3 border-gray-200 relative text-gray-900"
                  >
                    {item.title}
                    {item.arrow ? (
                      <div className="rotate-[270deg] absolute left-1 top-3">
                        <MdArrowRightAlt />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {phoneNumbers &&
                phoneNumbers.map((item, index) => (
                  <tr
                    key={index}
                    className={`h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100 ${
                      item.appointment.length > 0
                        ? "bg-warning bg-opacity-40"
                        : ""
                    } ${
                      item.appointmentsurgery.length > 0 ? "bg-red-200" : ""
                    }`}
                  >
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel={"nofollow"}
                        className="table-cell align-middle  w-20 cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {index + 1}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel={"nofollow"}
                        className="table-cell align-middle cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {/* <td className=" "> */}
                        {item.document && item.document.name}
                        {/* </td> */}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        className="table-cell align-middle cursor-pointer  text-right px-3 border-x border-gray-200"
                      >
                        {item.document && item.document.tell}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        className=" table-cell align-middle cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {CurrencyNum.format(item.receive_price)}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        className="table-cell align-middle cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {item.doctor && item.doctor[0] && item.doctor[0].name}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        className="table-cell align-middle cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        {item.clinic && item.clinic.title}
                      </a>
                    </Link>
                    <Link href={`/admin/record/detail/?id=${item.document_id}`}>
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        className="table-cell h-full align-middle cursor-pointer text-right px-3 border-x border-gray-200"
                      >
                        <p>{item.description}</p>
                      </a>
                    </Link>
                    <td className=" text-right px-3 border-x border-gray-200">
                      <IconBtn
                        icon={<MdMoreHoriz />}
                        onClick={() => {
                          setTr(item.id);
                          setCell(item.appointment);
                          setCell1(item.appointmentsurgery);
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {cell ? (
        <Modal>
          <div className="w-[560px] relative pt-4 h-[420px] bg-white rounded-cs p-6 flex flex-col items-start justify-start gap-6 ">
            <div className="flex max-w-[90%] flex-row items-center justify-between w-full">
              <span className="">نوبت های فعال بیمار</span>
              <div>
                <Tabs options={tabOptions} setTab={setTab} tab={tab} />
              </div>
            </div>
            <div className="border-t flex flex-col items-center justify-start h-96 border-primary-900 w-full max-h-96 overflow-y-auto">
              {tab === 0
                ? cell &&
                  cell.map((item) => (
                    <button
                      key={item.id}
                      className={`py-3 w-full text-right rounded-cs p-2 text-sm border-b border-primary-100 ${
                        selectAppointment && selectAppointment.id === item.id
                          ? "bg-primary-100"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectAppointment(item);
                        setSelectAppointmentS(null);
                      }}
                    >
                      {convertDay(item.day)} |‌{" "}
                      {item.VisitTime.slice(0, 5) +
                        " " +
                        moment(item.dateOfDay)
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                    </button>
                  ))
                : cell1 &&
                  cell1.map((item) => (
                    <button
                      key={item.id}
                      className={`py-3 w-full text-right rounded-cs p-2 text-sm border-b border-primary-100 ${
                        selectAppointmentS && selectAppointmentS.id === item.id
                          ? "bg-primary-100"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectAppointmentS(item);
                        setSelectAppointment(null);
                      }}
                    >
                      {convertDay(item.day)} |‌{" "}
                      {item.VisitTime.slice(0, 5) +
                        " " +
                        moment(item.dateOfDay)
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                    </button>
                  ))}
            </div>
            <CloseBtn
              onClick={() => {
                setCell(false), setTab(0);
              }}
            />
            <div className="w-full h-12">
              <PrimaryBtn
                text="ثبت"
                onClick={() => {
                  setStatus(), setTab(0);
                }}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default GetPhoneNumber;
