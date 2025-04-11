import { useRouter } from "next/router";
import {
  MdArrowDropDown,
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
import {
  getFinanceRecordService,
  rollbackPriceService,
} from "../../../Services/recordServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import Link from "next/link";
import Input from "../../../common/Input";
import OutlineBtn from "../../../common/OutlineBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import { Disclosure, Menu, Popover } from "@headlessui/react";
import moment from "jalali-moment";
import {
  getChecksService,
  getInternalCheckService,
  getReturnChecksService,
  getStatusChecksService,
  getTodayChecksService,
  searchChecksService,
  searchInternalCheckService,
} from "../../../Services/financeServices";
import SearchBox from "../../../Components/SearchBox";
import Tabs from "../../../Components/Tabs";
import SelectInput from "../../../common/SelectInput";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
const Finance = () => {
  const [records, setRecords] = useState(null);
  const [searchStatus, setSearchStatus] = useState(0);
  const [filterData, setFilteredData] = useState(null);

  const [isTreatment, setTreatment] = useState(false);
  const [treatmentItem, setTreatmentItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const head = [
    { id: 2, title: "سریال چک" },
    { id: 8, title: "تاریخ صدورچک" },
    { id: 9, title: "تاریخ سررسید چک" },
    { id: 3, title: "مبلغ چک" },
    { id: 1, title: "نام گیرنده " },
    { id: 0, title: "شماره تماس" },
    { id: 10, title: "شرح چک" },
    { id: 11, title: "وضعیت" },
    { id: 7, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    getInternalCheckService(
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

  const statusOption = [
    { id: 0, label: "اسناد پرداختی" },
    { id: 1, label: "وصول شده" },
    { id: 2, label: "برگشتی" },
    { id: 3, label: "خرج شده" },
    { id: 4, label: "عودت شده" },
  ];
  const searchHandler = (e) => {
    setSearchStatus(1);
    searchInternalCheckService(
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
      <div className="z-0">
        <div className="bg-gray-50 h-[70px] px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <h1 className="text-xl text-gray-900">چک های داخلی</h1>
            </div>
          </div>
        </div>
        <div className="w-full h-20 flex flex-row items-center justify-between px-6 py-4">
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
            <div className="w-48 h-12">
              <PrimaryBtn
                text="ثبت چک جدید"
                onClick={() => router.push("/accounting/finance/add-check")}
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-scroll z-10 h-[calc(100vh-295px)]">
          <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  sticky top-0 z-30">
              <tr className="text-right text-sm">
                <th className="w-20 text-center border border-gray-200  shadow-border ">
                  ردیف
                </th>
                {head.map((item) => (
                  <th
                    key={item.id}
                    className=" text-right border px-3 border-gray-200  shadow-border "
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
                filterData.map((item, index) => (
                  <>
                    <tr className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100">
                      <td className="w-20 text-right px-3 border-x border-gray-200">
                        {index + 1}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {item.serial}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {moment(item.date).locale("fa").format("YYYY/MM/DD")}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {moment(item.issuing_date)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                      </td>

                      <td className="text-right px-3 border-x border-gray-200">
                        {CurrencyNum.format(item.price)}
                      </td>
                      <td className="cursor-pointer text-right px-3 border-x border-gray-200">
                        {item.name_receiver}
                      </td>
                      <td className="cursor-pointer text-right px-3 border-x border-gray-200">
                        {item.tell_receiver}
                      </td>
                      <td className="cursor-pointer text-right px-3 border-x border-gray-200">
                        {item.description}
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
                          ? "اسناد پرداختی"
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
                          onClick={() => {
                            setTreatment(true);
                            setTreatmentItem(item.id);
                          }}
                        />
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination
          records={records && records}
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
