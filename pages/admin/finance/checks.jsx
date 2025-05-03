import { useRouter } from "next/router";
import {
  MdArrowForward,
  MdArrowRightAlt,
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
import Error from "next/error";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import Link from "next/link";
import Input from "../../../common/Input";
import OutlineBtn from "../../../common/OutlineBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import moment from "jalali-moment";
import {
  getChecksService,
  getReturnChecksService,
  getStatusChecksService,
  getTodayChecksService,
  searchChecksService,
} from "../../../Services/financeServices";
import SearchBox from "../../../Components/SearchBox";
import Tabs from "../../../Components/Tabs";
import SelectInput from "../../../common/SelectInput";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import { useRef } from "react";
import { useExcelDownloder } from "react-xls";
const Finance = () => {
  const [records, setRecords] = useState(null);
  const [searchStatus, setSearchStatus] = useState(0);
  const [filterData, setFilteredData] = useState(null);
  const pageRef = useRef(null);
  const [isTreatment, setTreatment] = useState(false);
  const [treatmentItem, setTreatmentItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [popover, setPopover] = useState(false);

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [excelData, setExcelData] = useState([]);

  const data1 = {
    files: excelData,
  };

  const head = [
    { id: 2, title: "سریال چک" },
    { id: 3, title: "مبلغ چک" },
    { id: 1, title: "تاریخ چک" },
    { id: 4, title: "نام بیمار" },
    { id: 0, title: "شماره تماس" },
    { id: 5, title: "وضعیت" },
    { id: 7, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    if (tab === 0) {
      getChecksService(
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

            let result = data.result.record;

            const formattedData = result?.map((item) => ({
              "سریال چک": item?.serial,
              مبلغ: CurrencyNum.format(item.amount),
              تاریخ: moment(item.date).locale("fa").format("YYYY/MM/DD"),
              "نام بیمار": item?.document?.name,
              "شماره تماس": item?.document?.tell,
              وضعیت:
                item.status === 0
                  ? "اسناد دریافتی"
                  : item.status === 1
                  ? "وصول شده"
                  : item.status === 2
                  ? "برگشتی"
                  : item.status === 3
                  ? "خرج شده"
                  : "عودت شده",
            }));

            setExcelData(formattedData);
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
    } else if (tab === 1) {
      getTodayChecksService(
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
      getReturnChecksService(
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
    { id: 1, text: "امروز" },
    { id: 2, text: "برگشتی" },
  ];

  const statusOption = [
    { id: 0, label: "اسناد دریافتی" },
    { id: 1, label: "وصول شده" },
    { id: 2, label: "برگشتی" },
    { id: 3, label: "خرج شده" },
    { id: 4, label: "عودت شده" },
  ];
  const searchHandler = (e) => {
    setSearchStatus(1);
    searchChecksService(
      { serial_id: e },
      {
        Authorization: "Bearer " + user.token,
      }
    ).then(({ data }) => {
      setFilteredData(data.result);
      setSearchStatus(0);
    });
  };
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  //   if (!records) return <PageLoading />;

  return (
    <Layout>
      <div ref={pageRef} className="z-0">
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
              <h1 className="text-xl text-gray-900">مدیریت چک</h1>
            </div>
            <div>
              <Tabs options={tabsOption} setTab={setTab} tab={tab} />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={records}
              changeHandler={searchHandler}
              isState={false}
              setFilteredData={setFilteredData}
              status={searchStatus}
              tab={tab}
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 ? "animate-spin" : ""}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  getData(), setStatus(1);
                }}
              />
            </div>
            <CountSelect setCount={setCount} />
            <div className="flex flex-row items-center justify-center rounded-cs   min-w-fit text-primary-900 text-xs h-12">
              <ExcelDownloder
                key={JSON.stringify(excelData)}
                data={data1}
                filename={"چک ها"}
                type={Type.Button}
              >
                دانلود اکسل
              </ExcelDownloder>
            </div>
            {/* <div className="w-24 h-12 ">
              <PrimaryBtn text="ثبت پرداختی" onClick={() => setShow(!show)} />
            </div> */}
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll z-10">
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
                    <div className="rotate-[270deg] absolute left-1 top-3">
                      <MdArrowRightAlt />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-y-auto z-0">
              {filterData &&
                filterData.record &&
                filterData.record.map((item, index) => (
                  <>
                    <tr className="h-12 relative text-sm text-gray-600 hover:bg-primary-50 duration-100">
                      <td className="w-20 text-right px-3 border-x border-gray-200">
                        {(page - 1) * count + index + 1}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {item.serial}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {CurrencyNum.format(item.amount)}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {moment(item.date).locale("fa").format("YYYY/MM/DD")}
                      </td>

                      <td className="text-right px-3 border-x border-gray-200">
                        {item.document && item.document.name}
                      </td>
                      <td className="cursor-pointer text-right px-3 border-x border-gray-200">
                        {item.document && item.document.tell}
                      </td>
                      <td
                        className={`  text-right px-3 border-x border-gray-200 ${
                          item.status === 0
                            ? ""
                            : item.status === 1
                            ? "text-green-700"
                            : item.status === 2
                            ? "text-red-700"
                            : item.status === 3
                            ? "text-primary-900"
                            : "text-warning"
                        }`}
                      >
                        {item.status === 0
                          ? "اسناد دریافتی"
                          : item.status === 1
                          ? "وصول شده"
                          : item.status === 2
                          ? "برگشتی"
                          : item.status === 3
                          ? "خرج شده"
                          : "عودت شده"}
                      </td>
                      <td className="text-primary-900 relative z-0 text-right px-3 border-x border-gray-200">
                        <IconBtn
                          icon={<MdMoreHoriz />}
                          onClick={() =>
                            popover === item.id
                              ? setPopover(false)
                              : setPopover(item.id)
                          }
                        />
                      </td>
                      {popover === item.id ? (
                        <div className=" flex flex-col items-center  absolute  bg-white rounded-cs shadow-btn w-fit left-16 top-5 z-50">
                          <Link
                            href={`/admin/record/detail/?id=${item.document.id}`}
                            className="py-2 px-3 w-full block hover:bg-primary-50 hover:text-primary-900"
                          >
                            <a
                              className="py-2 px-3 w-full block hover:bg-primary-50 hover:text-primary-900"
                              target="_blank"
                              rel="noreferrer"
                            >
                              پرونده بیمار
                            </a>
                          </Link>
                          <button
                            className="py-2 px-3 hover:bg-primary-50 hover:text-primary-900"
                            onClick={() => {
                              setTreatment(!isTreatment);
                              setTreatmentItem(item.id);
                            }}
                          >
                            تغییر وضعیت
                          </button>
                        </div>
                      ) : null}
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          recordsCount={
            records &&
            records.record &&
            Number(page - 1) * Number(count) + records.record.length
          }
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
    </Layout>
  );
};

export default Finance;
