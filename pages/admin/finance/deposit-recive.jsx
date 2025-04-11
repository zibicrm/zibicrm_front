import { useRouter } from "next/router";
import {
  MdArrowDropDown,
  MdArrowForward,
  MdArrowRightAlt,
  MdCalendarToday,
  MdLoop,
  MdMoreHoriz,
} from "react-icons/md";
import IconBtn from "../../../common/IconBtn";
import * as yup from "yup";
import { useFormik } from "formik";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import RangePicker from "../../../Components/RangePicker";
import Error from "next/error";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import OutlineBtn from "../../../common/OutlineBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import { Disclosure } from "@headlessui/react";
import moment from "jalali-moment";
import {
  getAllFinanceService,
  getUnseenFinanceService,
  setStatusFinanceService,
} from "../../../Services/financeServices";
import Tabs from "../../../Components/Tabs";
import SelectInput from "../../../common/SelectInput";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import { useRef } from "react";
const Finance = () => {
  const [records, setRecords] = useState(null);
  const pageRef = useRef(null);
  const [isTreatment, setTreatment] = useState(false);
  const [treatmentItem, setTreatmentItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [calendar, setCalendar] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [filterData, setFilteredData] = useState(null);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const head = [
    { id: 1, title: "تاریخ" },
    { id: 2, title: "مبلغ پرداختی" },
    { id: 3, title: "نوع پرداخت" },
    { id: 4, title: "توضیحات" },
    { id: 0, title: "نام بیمار" },
    { id: 8, title: "شماره تلفن" },
    { id: 10, title: "کارشناس" },
    { id: 5, title: "وضعیت" },
    { id: 7, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    if (tab === 0) {
      getAllFinanceService(
        {
          count: count,
          page: page,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setRecords(data.result);
            setFilteredData(data.result);
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
      getUnseenFinanceService(
        {
          count: count,
          page: page,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setRecords(data.result);
            setFilteredData(data.result);
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
  };

  const validationSchema = yup.object({
    status: yup.string().required("وضعیت را وارد کنید"),
  });
  const initialValues = {
    treatment_id: "",
    status: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setStatusFinanceService(
        { ...values, treatment_id: treatmentItem },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("با موفقیت ثبت شد");
            getData();
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
  useEffect(() => {
    if (user && !loading) {
      getData();
    }
  }, [page, count, tab]);
  useEffect(() => {
    pageRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [page]);
  const tabsOption = [
    { id: 0, text: "همه" },
    { id: 1, text: "در انتظار تایید" },
  ];
  const statusOption = [
    { id: 0, label: "در انتظار ثبت" },
    { id: 1, label: "ثبت شده در نرم افزار حسابداری" },
  ];

  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  //   if (!records) return <PageLoading />;
  return (
    <Layout>
      <div ref={pageRef}>
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">بیعانه های دریافتی</h1>
            </div>
            <div>
              <Tabs options={tabsOption} setTab={setTab} tab={tab} />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 && "animate-spin"}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  getData(), setStatus(1);
                }}
              />
            </div>
            <CountSelect setCount={setCount} />
            <div
              className="h-12 w-36 "
              onClick={() => {
                setCalendar(true);
              }}
            >
              <PrimaryBtn text="تقویم">
                <span className="block mr-1  mb-1 ">
                  <MdCalendarToday />
                </span>
              </PrimaryBtn>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll ">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border border-gray-200 relative text-gray-900"></th>

                <th className="w-20 text-center border border-gray-200 relative text-gray-900">
                  ردیف
                </th>
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right border px-3 border-gray-200 relative text-gray-900"
                  >
                    {item.title}
                    <div className="rotate-[270deg] absolute left-1 top-3">
                      <MdArrowRightAlt />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto ">
              {filterData &&
                filterData.record &&
                filterData.record.map((item, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <>
                        <tr className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100">
                          <td className="w-full h-full py-3 flex items-center justify-center">
                            <Disclosure.Button className="w-full h-full py-3 flex items-center justify-center">
                              <MdArrowDropDown />
                            </Disclosure.Button>
                          </td>
                          <td className="w-20 h-full text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {(page - 1) * count + index + 1}
                            </Disclosure.Button>
                          </td>
                          <td className=" h-full text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {moment(item.created_at)
                                .locale("fa")
                                .format("YYYY/MM/DD")}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {CurrencyNum.format(item.receive_price)}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.payment_type === 1
                                ? "نقدی"
                                : item.payment_type === 2
                                ? "اقساطی"
                                : "چکی"}
                            </Disclosure.Button>
                          </td>

                          <td className=" h-full text-right max-w-[200px] border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.description ? item.description : "-"}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.document && item.document.name}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full cursor-pointer text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.document && item.document.tell}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full cursor-pointer text-right  border-x border-gray-200">
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.user &&
                                item.user.first_name +
                                  " " +
                                  item.user.last_name}
                            </Disclosure.Button>
                          </td>
                          <td
                            className={` h-full text-right  border-x border-gray-200 ${
                              item.finance_view === 0
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            <Disclosure.Button className="w-full h-full px-3">
                              {item.finance_view === 0
                                ? "در انتظار ثبت"
                                : "ثبت شده در نرم افزار حسابداری"}
                            </Disclosure.Button>
                          </td>
                          <td className="h-full text-primary-900 cursor-pointer text-right px-3 border-x border-gray-200">
                            <IconBtn
                              icon={<MdMoreHoriz />}
                              onClick={() => {
                                setTreatment(!isTreatment);
                                setTreatmentItem(item.id);
                              }}
                            />
                          </td>
                        </tr>
                        {open && (
                          <>
                            {item.checks.map((item, i) => {
                              return (
                                <tr
                                  key={item.id}
                                  className="h-12 bg-primary-50  bg-opacity-50 text-sm text-gray-600 hover:bg-primary-50 duration-100"
                                >
                                  <td></td>
                                  <td className="w-20 text-right px-3 border-x border-gray-200">
                                    قسط {i + 1}
                                  </td>
                                  <td
                                    colSpan={2}
                                    className="  text-right px-3 border-x border-gray-200"
                                  >
                                    {item.serial}
                                  </td>
                                  <td className=" text-right px-3 border-x border-gray-200">
                                    {CurrencyNum.format(item.amount)}
                                  </td>
                                  <td
                                    colSpan={3}
                                    className=" text-right px-3 border-x border-gray-200"
                                  >
                                    {moment(item.date)
                                      .locale("fa")
                                      .format("YYYY/MM/DD")}
                                  </td>
                                  <td className=" text-right px-3 border-x border-gray-200">
                                    {item.status === 0
                                      ? "دریافت"
                                      : item.status === 1
                                      ? "نقد شده"
                                      : item.status === 2
                                      ? "برگشت خورده"
                                      : item.status === 3
                                      ? "خرج شده"
                                      : "عودت شده"}
                                  </td>
                                  <td></td>
                                </tr>
                              );
                            })}
                          </>
                        )}
                      </>
                    )}
                  </Disclosure>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          records={records && records.record}
          count={records && records.count}
          setPage={setPage}
          page={page}
        />
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

export default Finance;
