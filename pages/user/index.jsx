import React from "react";
import LayoutUser from "../../Layout/LayoutUser";
import {
  MdArrowDropDown,
  MdOutlineAttachMoney,
  MdOutlineSyncProblem,
  MdOutlineTrendingUp,
} from "react-icons/md";
import Modal from "../../Components/Modal";
import AddEvent from "../../Components/AddEvent";
import { useState } from "react";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../../Provider/PatientAuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLoading from "../../utils/LoadingPage";
import { toast } from "react-toastify";
import {
  getAllAppointments,
  getAllChecks,
  patientDocumentAll,
  patientDocumentAllTransaction,
} from "../../Services/patientRecordService";
import { CurrencyNum } from "../../hooks/CurrencyNum";
import moment from "jalali-moment";
import { CloseBtn } from "../../common/CloseBtn";
import { FaMoneyCheck } from "react-icons/fa";
import Image from "next/future/image";
import FilterBtn from "../../common/FilterBtn";

const Panel = () => {
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const router = useRouter();
  const [newReserveModal, setNewReserveModal] = useState(false);
  const [patientAccount, setPatientAccount] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [checks, setChecks] = useState(null);
  const [showCheckImage, setShowCheckImage] = useState(null);
  const [showCheckTab, setShowCheckTab] = useState(1);
  const [reserveDropdown, setReserveDropdown] = useState(false);
  const [filterTitle, setFilterTitle] = useState(1);

  // const array = [
  //   {
  //     id: 805,
  //     treatment_id: 3950,
  //     document_id: 70945,
  //     user_id: 1,
  //     serial: "1",
  //     uuid: null,
  //     amount: "400000",
  //     date: "2023-07-20 00:00:00",
  //     status: 0,
  //     sayad: 0,
  //     buyer: null,
  //     created_at: "2023-05-20T08:55:03.000000Z",
  //     updated_at: "2023-05-20T08:55:03.000000Z",
  //     images: [],
  //   },
  //   {
  //     id: 803,
  //     treatment_id: 3949,
  //     document_id: 70945,
  //     user_id: 1,
  //     serial: "1",
  //     uuid: "94bb1730-f6eb-11ed-b03f-c31d2cc2823e",
  //     amount: "5700000",
  //     date: "2023-06-20 00:00:00",
  //     status: 0,
  //     sayad: 0,
  //     buyer: null,
  //     created_at: "2023-05-20T08:53:27.000000Z",
  //     updated_at: "2023-05-20T08:53:27.000000Z",
  //     images: [
  //       {
  //         id: 438,
  //         user_id: 3,
  //         document_id: 70945,
  //         name: "94bb1730-f6eb-11ed-b03f-c31d2cc2823e_f_202305200853.png",
  //         uuid: "94bb1730-f6eb-11ed-b03f-c31d2cc2823e",
  //         fb: "f",
  //         created_at: "2023-05-20T08:53:18.000000Z",
  //         updated_at: "2023-05-20T08:53:18.000000Z",
  //       },
  //       {
  //         id: 439,
  //         user_id: 3,
  //         document_id: 70945,
  //         name: "94bb1730-f6eb-11ed-b03f-c31d2cc2823e_b_202305200853.png",
  //         uuid: "94bb1730-f6eb-11ed-b03f-c31d2cc2823e",
  //         fb: "b",
  //         created_at: "2023-05-20T08:53:18.000000Z",
  //         updated_at: "2023-05-20T08:53:18.000000Z",
  //       },
  //     ],
  //   },
  //   {
  //     id: 804,
  //     treatment_id: 3950,
  //     document_id: 70945,
  //     user_id: 1,
  //     serial: "1",
  //     uuid: null,
  //     amount: "11000000",
  //     date: "2023-06-20 00:00:00",
  //     status: 0,
  //     sayad: 0,
  //     buyer: null,
  //     created_at: "2023-05-20T08:55:03.000000Z",
  //     updated_at: "2023-05-20T08:55:03.000000Z",
  //     images: [],
  //   },
  // ];

  const head = [
    { id: 0, title: "زمان مراجعه" },
    { id: 1, title: "نوع نوبت" },
    { id: 2, title: "مطب ها" },
    { id: 3, title: "دکتر" },
    { id: 4, title: "وضعیت" },
  ];

  const head2 = [
    { id: 0, title: "تعداد" },
    { id: 1, title: "سریال چک" },
    { id: 2, title: "قیمت" },
    { id: 3, title: "تاریخ" },
    { id: 4, title: "وضعیت" },
    { id: 5, title: "اسناد" },
  ];

  const filterOption = [
    { id: "0", name: "همه" },
    { id: "1", name: "در حال انتظار" },
    { id: "2", name: "کنسل شده" },
    { id: "3", name: "ویزیت شده" },
  ];

  const paymentTypeChek = (type) => {
    switch (type) {
      case 1:
        return "نقد";
      case 2:
        return "بیعانه";
      case 3:
        return "پوز";
      case 4:
        return "کارت به کارت ";
      case 5:
        return "آنلاین";
      case 6:
        return "چک";

        break;

      default:
        break;
    }
  };

  const convertDay = (day) => {
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

  const getCheckImage = () => {
    let fb = showCheckTab === 0 ? "b" : "f";
    let res = showCheckImage.filter((i) => String(i.fb) === String(fb));
    return res[0];
  };

  const patientTransaction = () => {
    patientDocumentAllTransaction(user?.user.id, {
      token: user.user.token,
    })
      .then(({ data }) => {
        // new device
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0],{
            position: "top-right",
          });
        } else {
          setTransaction(data.result);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message,{
            position: "top-right",
          });
        }
      });
  };
  const patientList = () => {
    patientDocumentAll(user?.user.id, {
      token: user.user.token,
    })
      .then(({ data }) => {
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0],{
            position: "top-right",
          });
        } else {
          setPatientAccount(data.result);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message,{
            position: "top-right",
          });
        }
      });
  };

  const getAppointments = () => {
    getAllAppointments({
      token: user.user.token,
    })
      .then(({ data }) => {
        // new device
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0],{
            position: "top-right",
          });
        } else {
          setAppointments(data.result);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message,{
            position: "top-right",
          });
        }
      });
  };

  const getChecks = () => {
    getAllChecks({
      token: user.user.token,
    })
      .then(({ data }) => {
        // new device
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0],{
            position: "top-right",
          });
        } else {
          setChecks(data.result);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message,{
            position: "top-right",
          });
        }
      });
  };

  useEffect(() => {
    if (user && user?.token) {
      patientList();
      patientTransaction();
      getAppointments();
      getChecks();
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  if (!checks || !appointments || !transaction || !patientAccount) {
    return <PageLoading />;
  }

  return (
    <LayoutUser>
      <div className="hidden items-center justify-between px-2 mt-8 md:flex lg:mt-0 lg:px-0">
        <h1 className="text-gray-900 font-bold text-xl">خانه</h1>
        <button
          className="hidden bg-zibiPrimary text-white p-2 rounded-lg"
          onClick={() => setNewReserveModal(true)}
        >
          دریافت نوبت
        </button>
      </div>
      <div className="flex flex-col gap-y-4 mt-6 md:flex-row md:items-center md:justify-between md:gap-x-6 md:bg-white md:p-6 md:rounded-lg md:shadow-card desktop:w-full">
        <div className="flex flex-col justify-center items-center text-gray-900 bg-white rounded-cs py-4 gap-4 shadow-card md:shadow-none md:flex-1 md:bg-gray-50 w-full">
          <MdOutlineTrendingUp className="text-2xl" />
          <h2 className="whitespace-nowrap">کل هزینه ها</h2>
          <span className="text-center">
            {patientAccount &&
              patientAccount.AllAmount &&
              CurrencyNum.format(Number(patientAccount.AllAmount.All))}
            <p className="text-[#FF9900] text-xs ">
              {" "}
              با احتساب{" "}
              {patientAccount &&
                patientAccount.AllAmount &&
                CurrencyNum.format(
                  Number(patientAccount.AllAmount.discount)
                )}{" "}
              تخفیف
            </p>
          </span>
        </div>
        <tr className="w-full h-[1px] bg-gray-200 md:hidden" />
        <div className="flex flex-col justify-center items-center text-gray-900 bg-white rounded-cs py-4 gap-4 shadow-card md:shadow-none md:flex-1 md:bg-gray-50 w-full">
          <MdOutlineAttachMoney className="text-2xl" />
          <h2 className="whitespace-nowrap">پرداختی ها</h2>
          <span className="text-center">
            {patientAccount &&
              patientAccount.AllPayment &&
              CurrencyNum.format(Number(patientAccount.AllPayment.All))}
            <p className="text-[#FF9900] text-xs">
              {" "}
              با احتساب{" "}
              {patientAccount &&
                patientAccount.AllPayment &&
                CurrencyNum.format(patientAccount.AllPayment.checks)}{" "}
              چک
            </p>
          </span>
        </div>
        <tr className="w-full h-[1px] bg-gray-200 md:hidden" />
        <div
          className={`flex flex-col justify-center items-center text-red-700 bg-red-50 rounded-cs py-4 gap-4 shadow-card md:shadow-none md:flex-1 w-full`}
        >
          <MdOutlineSyncProblem className="text-2xl" />
          <h2 className="whitespace-nowrap">باقی مانده</h2>
          <span className="text-center">
            {patientAccount &&
              patientAccount.AllMod &&
              CurrencyNum.format(Number(patientAccount.AllMod.All))}
            {patientAccount &&
            patientAccount.AllMod &&
            patientAccount.AllMod.All > 0 ? (
              <p className="text-[#FF9900] text-xs">بدهکار</p>
            ) : (
              <p className="text-[#FF9900] text-xs">بستانکار</p>
            )}
          </span>
        </div>
      </div>
      {/* Mobile نوبت های شما */}
      <div className="flex justify-between items-center mt-12 md:hidden">
        <h1 className="text-gray-900">نوبت های شما</h1>
        <div>
          <FilterBtn
            label={
              filterTitle === 0
                ? "همه"
                : filterTitle === 1
                ? "در حال انتظار"
                : filterTitle === 2
                ? "کنسل شده"
                : "ویزیت شده"
            }
            name="user"
            selectOption={filterOption}
            labelOption="name"
            valueOption="id"
            onChange={(e) => setFilterTitle(e.id)}
          />
        </div>
      </div>
      <div className="mt-3 md:hidden">
        {appointments &&
          appointments
            .filter((item) =>
              Number(filterTitle) !== 0
                ? item.status === Number(filterTitle)
                : item
            )
            .map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="mt-3 text-gray-600 bg-white rounded-lg shadow-card"
                >
                  <div
                    className={`flex justify-between p-4`}
                    onClick={() => setReserveDropdown(item.id)}
                  >
                    <div className="flex gap-x-4">
                      <span className="w-24">{convertDay(item.day)}</span>
                      <span className="">
                        {" "}
                        {moment(item.dateOfDay, "YYYY/MM/DD")
                          .locale("fa")
                          .format("YYYY/MM/DD")}{" "}
                        |{" "}
                        {`${item.VisitTime.split(":")[0]}:${
                          item.VisitTime.split(":")[1]
                        }`}
                      </span>
                    </div>
                    <MdArrowDropDown
                      className={`text-2xl ${
                        reserveDropdown &&
                        reserveDropdown === item.id &&
                        "rotate-180"
                      }`}
                      onClick={(e) => {
                        setReserveDropdown(reserveDropdown ? null : item.id);
                        e.stopPropagation();
                      }}
                    />
                  </div>
                  {reserveDropdown === item.id && (
                    <div className="text-xs bg-white rounded-b-lg py-4 px-4">
                      <hr />
                      <div className="border border-primary-50 mt-4 flex justify-between p-3 rounded-lg">
                        <div className="flex flex-col justify-between py-2 w-1/2">
                          <span className="text-center">دکتر</span>
                          <span className="text-center">مطب ها</span>
                          <span className="text-center">وضعیت</span>
                        </div>
                        <hr className="h-[100px] bg-primary-50 w-[1px]" />
                        <div className="flex flex-col justify-between py-2 w-1/2">
                          <span className="text-center">
                            {item.doctor ? item.doctor.name : ""}
                          </span>
                          <span className="text-center">
                            {item.clinic ? item.clinic.title : ""}
                          </span>
                          <span
                            className={`text-center ${
                              item.status === 1
                                ? ""
                                : item.status === 2
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            {item.status === 1
                              ? "در حال انتظار"
                              : item.status === 2
                              ? "کنسل شده"
                              : "ویزیت شده"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
      </div>
      <div className="desktop:flex  w-full justify-between gap-x-4">
        <div className="hidden flex-col gap-6 mt-8 md:flex md:bg-white md:p-6 md:rounded-lg  md:mt-5 desktop:w-7/12 md:shadow-card">
          <h1>نوبت های شما</h1>
          <div className="w-full overflow-x-auto max-h-[403px] bg-white border rounded-lg shadow-card md:shadow-none">
            <table className="w-full rounded-lg ">
              <thead className="">
                <tr className="">
                  {head.map((item, index) => (
                    <th
                      key={item.id}
                      className={`font-light text-xs md:text-sm border-b border-l border-gray-200 text-gray-900 py-4 md:bg-gray-50 ${
                        index === head.length - 1 && "border-l-transparent"
                      } `}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {appointments &&
                  appointments.map((item, index) => {
                    return (
                      <tr className="" key={item.id}>
                        <td className="font-light text-[10px] md:text-xs border-l   border-gray-200  text-center whitespace-nowrap px-4 py-4">
                          {moment(item.dateOfDay, "YYYY/MM/DD")
                            .locale("fa")
                            .format("YYYY/MM/DD")}{" "}
                          |{" "}
                          {`${item.VisitTime.split(":")[0]}:${
                            item.VisitTime.split(":")[1]
                          }`}
                        </td>
                        <td className="font-light text-[10px] md:text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                          <span>
                            {item.type && item.type === 2 ? "جراحی" : "ویزیت"}
                          </span>
                          {item.vip ? "-" : ""}
                          <span>{item.vip ? "ویژه" : ""}</span>
                        </td>
                        <td className="font-light text-[10px] md:text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                          {item.clinic.title}
                        </td>
                        <td className="font-light text-[10px] md:text-xs border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                          {item.doctor ? item.doctor.name : ""}
                        </td>
                        <td
                          className={`font-light text-[10px] md:text-xs ${
                            item.status === 1
                              ? ""
                              : item.status === 2
                              ? "text-red-700"
                              : "text-green-700"
                          }  border-gray-200 text-center whitespace-nowrap px-4 py-4`}
                        >
                          {item.status === 1
                            ? "در حال انتظار"
                            : item.status === 2
                            ? "کنسل شده"
                            : "ویزیت شده"}
                        </td>
                      </tr>
                    );
                  })}
                {/* <tr className="">
                  <td className="font-light text-sm border-l   border-gray-200  text-center whitespace-nowrap px-4 py-4">
                  {moment(dateOfDay, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')} | {`${VisitTime.split(':')[0]}:${VisitTime.split(':')[1]}`}
                  </td>
                  <td className="font-light text-sm border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                  <span>ویزیت</span>-<span>ویژه</span>
                  </td>
                  <td className="font-light text-sm border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                    ایمپلنت
                  </td>
                  <td className="font-light text-sm border-l  border-gray-200 text-center whitespace-nowrap px-4 py-4">
                    مریم اکبری
                  </td>
                  <td className="font-light text-sm   border-gray-200 text-center whitespace-nowrap px-4 py-4">
                    کنسل شده
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-y-6 mt-8 md:bg-white md:p-6 md:rounded-lg desktop:w-5/12 desktop:mt-5 md:shadow-card ">
          <h1>تراکنش های شما</h1>
          <div className="min-h-[200px] max-h-[403px] overflow-x-auto overflow-y-auto bg-white rounded-lg px-4 py-4 shadow-card md:shadow-none ">
            {transaction &&
              transaction.map((item, index) => {
                return (
                  <div
                    className="flex justify-between border-b border-gray-200 py-4"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-2 text-green-700 md:flex-row md:items-center md:justify-between md:w-full desktop:gap-x-8">
                      <div className="flex items-center gap-3 md:bg-green-50 p-1 rounded-md">
                        <MdOutlineTrendingUp className="text-2xl" />
                        <span className="whitespace-nowrap text-xs">
                          پرداخت شد
                        </span>
                      </div>
                      <div className="whitespace-nowrap text-xs">
                        تومان {CurrencyNum.format(item.price)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-gray-400 md:flex-row-reverse md:items-center md:justify-around md:w-full desktop:mr-10 desktop:gap-x-8">
                      <span className="py-1">
                        {moment(item.created_at)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                      </span>
                      <span className="h-full flex items-center justify-end text-left text-xs">
                        {paymentTypeChek(item.payment_type)}
                      </span>
                    </div>
                  </div>
                );
              })}
            {transaction && transaction.length === 0 && (
              <div className="w-full h-[200px]  border rounded-lg">
                <p className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  تراکنشی وجود ندارد.
                </p>
              </div>
            )}
            {/* <div className="flex justify-between border-b border-gray-200 py-4">
              <div className="flex flex-col gap-2 text-green-700 md:flex-row md:items-center md:justify-between md:w-full desktop:gap-x-8">
                <div className="flex items-center gap-3 md:bg-green-50 p-1 rounded-md">
                  <MdOutlineTrendingUp className="text-2xl" />
                  <span className="whitespace-nowrap text-sm">پرداخت شد</span>
                </div>
                <div className="whitespace-nowrap text-sm">
                  {" "}
                  تومان 20,000,000
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-400 md:flex-row-reverse md:items-center md:justify-around md:w-full desktop:mr-10 desktop:gap-x-8">
                <span className="py-1">1401/01/02</span>
                <span className="h-full flex items-center justify-end text-left text-sm">نقد</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* mobile اقساط شما */}
      <div className="mt-12 text-gray-900 text-xs pb-10  md:hidden">
        <h1 className="text-base">اقساط شما</h1>
        {checks && checks.length === 0 && (
          <div className="p-4 h-[200px] shadow-card rounded-lg mt-4">
            <div className="h-full text-center border rounded-lg">
            <div className="h-full flex items-center justify-center">اقساطی وجود ندارد</div>
            </div>
          </div>
        )}
        {checks &&
          checks.map((item, index) => {
            return (
              <div
                className="relative flex flex-col justify-between bg-white w-full h-[176px] p-4  mt-4 rounded-lg shadow-card"
                key={item.id}
              >
                <div className="absolute bg-gray-50 half-circle top-[30%] -right-[10px]"></div>
                <div className="absolute bg-gray-50 half-circle top-[30%] -left-[10px] rotate-180"></div>
                {/* top */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    <span className="border p-1 border-zibiPrimary rounded-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{item.serial === '1' ? "اقساطی" : "چک"}</span>
                  </div>
                  <div>{CurrencyNum.format(item.amount)} تومان</div>
                  <div>
                    {item.status === 0
                      ? "اسناد(دریافتی)"
                      : item.status === 1
                      ? "وصولی"
                      : "برگشتی"}
                  </div>
                </div>
                {/* middle */}
                <div className="flex items-center  gap-x-4 mt-2">
                  <span className="h-[1px] w-full border-t-2 border-primary-50 border-dashed"></span>
                  <span className="whitespace-nowrap">
                    {item.serial === '1'
                      ? "اقساط بدون چک"
                      : `شماره سریال ${item.serial}`}
                  </span>
                  <span className="h-[1px] w-full border-t-2 border-primary-50 border-dashed"></span>
                </div>
                {/* bottom */}
                <div className="flex justify-between px-4 items-center">
                  <div>
                    تاریخ قسط{" "}
                    {moment(item.date).locale("fa").format("YYYY/MM/DD")}
                  </div>
                  <span
                    className="bg-zibiPrimary text-white text-[10px] whitespace-nowrap p-2 rounded-lg cursor-pointer"
                    onClick={() => setShowCheckImage(item.images)}
                  >
                    مشاهده چک
                  </span>
                </div>
              </div>
            );
          })}
        {/* <div className="relative flex flex-col justify-between bg-white w-full h-[176px] p-4  mt-4 rounded-lg shadow-card">
          <div className="absolute bg-gray-50 half-circle top-[30%] -right-[10px]"></div>
          <div className="absolute bg-gray-50 half-circle top-[30%] -left-[10px] rotate-180"></div>
         
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
              <span className="border p-1 border-zibiPrimary rounded-sm flex items-center justify-center">
                1
              </span>
              <span>چک</span>
            </div>
            <div>2000000 تومان</div>
            <div>وصولی</div>
          </div>
        
          <div className="flex items-center  gap-x-4 mt-2">
            <span className="h-[1px] w-full border-t-2 border-primary-50 border-dashed"></span>
            <span className="whitespace-nowrap"> شماره سریال 1415161718192021 </span>
            <span className="h-[1px] w-full border-t-2 border-primary-50 border-dashed"></span>
          </div>
         
          <div className="flex justify-between px-4 items-center">
            <div>تاریخ قسط ۴/۳/۱۴۰۲</div>
            <span
              className="bg-zibiPrimary text-white text-[10px] whitespace-nowrap p-2 rounded-lg cursor-pointer"
              onClick={() => setShowCheckImage(item.images)}
            >
              مشاهده چک
            </span>
          </div>
        </div> */}
      </div>
      {/* mobile اقساط شما */}
      <div className="desktop:flex flex-row-reverse desktop:gap-x-4">
        <div className="hidden flex-col gap-y-6 mt-8 md:flex md:bg-white md:p-6 md:rounded-lg desktop:w-full md:shadow-card">
          <h1>اقساط شما</h1>
          <div className="overflow-x-auto  max-h-[403px] bg-white border rounded-lg  shadow-card md:shadow-none">
            <table className="w-full border-gray-200 rounded-lg">
              <thead>
                <tr>
                  {head2.map((item, index) => (
                    <th
                      key={item.id}
                      className={`font-light text-sm md:text-sm whitespace-nowrap border-l border-b border-gray-200 text-gray-900 py-4 px-6 md:bg-gray-50 ${
                        index === head2.length - 1 && "border-l-transparent"
                      }`}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checks &&
                  checks
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((item, index) => {
                      return (
                        <tr className="" key={item.id}>
                          <td className="font-light text-[10px] md:text-xs  border-l border-gray-200 text-center py-4 px-2 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="font-light text-[10px] md:text-xs  border-l border-gray-200 text-center py-4 px-2">
                            {item.serial === '1' ? "اقساط بدون چک" : item.serial}
                          </td>
                          <td className="font-light text-[10px] md:text-xs  border-l border-gray-200 text-center py-4 px-2">
                            {CurrencyNum.format(item.amount)}
                          </td>
                          <td className="font-light text-[10px] md:text-xs  border-l border-gray-200 text-center py-4 px-2">
                            {moment(item.date)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </td>
                          <td className="font-light text-[10px] md:text-xs  border-l border-gray-200 text-center py-4 px-2">
                            {item.status === 0
                              ? "اسناد(دریافتی)"
                              : item.status === 1
                              ? "وصولی"
                              : "برگشتی"}
                          </td>
                          <td className="font-light text-[10px] md:text-xs   border-gray-200 text-center py-4 px-2">
                            <span
                              className="bg-zibiPrimary text-white whitespace-nowrap p-2 rounded-lg cursor-pointer"
                              onClick={() => setShowCheckImage(item.images)}
                            >
                              مشاهده چک
                            </span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {newReserveModal && (
        <Modal>
          <AddEvent event_type={"3"} setOpen={setNewReserveModal} />
        </Modal>
      )}
      {showCheckImage && showCheckImage.length ? (
        <Modal>
          <div className="relative rounded-cs bg-white w-fit h-fit overflow-auto p-4 flex flex-col gap-6">
            <CloseBtn onClick={() => setShowCheckImage(null)} />
            {/* <div className="flex flex-col gap-4 ">
              <h1 className="text-base text-gray-900">پرونده مطب</h1>
              <p className="text-sm text-gray-900">
                لطفا تصویر پشت و روی پرونده مطب را بارگذاری کنید
              </p>
            </div> */}
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={() => setShowCheckTab(1)}
                className={` border rounded-cs text-primary-900 border-primary-300  flex flex-row items-center gap-3 p-2 ${
                  showCheckTab === 1 ? "bg-primary-50" : ""
                }`}
              >
                <FaMoneyCheck />
                <span className="text-sm">عکس روی چک</span>
              </button>
              <button
                onClick={() => setShowCheckTab(0)}
                className={` border rounded-cs text-primary-900 flex border-primary-300  flex-row items-center gap-3 p-2 ${
                  showCheckTab === 0 ? "bg-primary-50" : " "
                }`}
              >
                <FaMoneyCheck />
                <span className="text-sm">عکس پشت چک</span>
              </button>
            </div>
            {getCheckImage().name ? (
              <div className="relative w-full h-full ">
                <Image
                  src={`https://radmanit.ir/images/${getCheckImage().name}`}
                  alt="receipt"
                  className="w-full h-full max-h-[calc(90vh-200px)] object-scale-down rounded-cs"
                  width={100}
                  height={100}
                />
              </div>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </LayoutUser>
  );
};

export default Panel;
