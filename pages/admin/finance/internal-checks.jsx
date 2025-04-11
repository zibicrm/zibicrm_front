import { useRouter } from "next/router";
import { MdArrowRightAlt, MdLoop, MdMoreHoriz } from "react-icons/md";
import IconBtn from "../../../common/IconBtn";
import * as yup from "yup";
import { useFormik } from "formik";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import CountSelect from "../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../Components/Pagination";
import Select from "react-select";
import Error from "next/error";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Modal from "../../../Components/Modal";
import Link from "next/link";
import Input from "../../../common/Input";
import OutlineBtn from "../../../common/OutlineBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import { Popover } from "@headlessui/react";
import moment from "jalali-moment";
import {
  filterInternalCheckService,
  getInternalCheckService,
  searchInternalCheckService,
  setInternalCheckStatusService,
} from "../../../Services/financeServices";
import SearchBox from "../../../Components/SearchBox";
import SelectInput from "../../../common/SelectInput";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
import PageLoading from "../../../utils/LoadingPage";
const Finance = () => {
  const [ckecks, setChecks] = useState(null);
  const [searchStatus, setSearchStatus] = useState(0);
  const [filterData, setFilteredData] = useState(null);
  const [isTreatment, setTreatment] = useState(false);
  const [treatmentItem, setTreatmentItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState(0);
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
    setStatus(1);
    if (value.id) {
      filterInternalCheckService(
        {
          count: count,
          page: page,
          status: value.id,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setChecks(data.result);
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
            setChecks(data.result);
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
      setInternalCheckStatusService(
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
  }, [value]);
  const statusOption = [
    { id: 0, label: "اسناد پرداختی" },
    { id: 1, label: "وصول شده" },
    { id: 2, label: "برگشتی" },
    { id: 3, label: "خرج شده" },
    { id: 4, label: "عودت شده" },
  ];
  const searchHandler = (e) => {
    if (e.length) {
      setSearchStatus(1);
      searchInternalCheckService(
        { statement: e },
        {
          Authorization: "Bearer " + user.token,
        }
      ).then(({ data }) => {
        setFilteredData(data.result);
        setSearchStatus(0);
      });
    }
  };
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      border: "none",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      padding: 0,
      color: "#fff",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      border: "none",
      color: "#fff",
    }),

    option: (provided, state) => ({
      ...provided,
      color: "#111827",
      boxShadow: "none",
      backgroundColor: "#fff",
      height: "48px",
      width: "112px",

      "&:hover": {
        backgroundColor: "#EDF0F8",
        boxShadow: "none",
        color: "#4267B3",
      },
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "#4267B3",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#fff",
      width: "112px",
      height: "48px",
      "&:hover": {
        border: "none",
        borderColor: "#F5FAFB",
        boxShadow: "none",
      },
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#fff", // Custom colour
    }),
  };
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  //   if (!ckecks) return <PageLoading />;
  return (
    <Layout>
      <div className="z-0">
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <h1 className="text-xl text-gray-900">چک های داخلی</h1>
            </div>
          </div>
        </div>
        <div className="w-full z-50 flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%] flex flex-row items-center justify-start">
            <SearchBox
              allData={ckecks}
              changeHandler={searchHandler}
              isState={false}
              setFilteredData={setFilteredData}
              status={searchStatus}
              tab={tab}
            />
            <div className="flex flex-col items-start h-12 relative">
              <div
                className={`w-full z-30 bg-[#4267B3] rounded-l-cs relative h-12 md:h-12 text-xs md:text-base border border-primary-500 pr-2 flex items-center justify-center`}
              >
                <Select
                  className="w-full text-white text-sm"
                  options={statusOption}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  defaultValue={{ id: -2, label: "همه" }}
                  onChange={(e) => {
                    setValue(e);
                  }}
                  id={"select-filter234"}
                  styles={customStyles}
                />
              </div>
            </div>
          </div>
          <div className="flex z-30 flex-row items-center gap-3">
            <div className={status === 1 ? "animate-spin" : ""}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  // getData(), setStatus(1);
                }}
              />
            </div>
            <CountSelect setCount={setCount} />
            <Link href={"/admin/finance/add-check"}>
              <div className="w-48 h-12">
                <PrimaryBtn text="ثبت چک جدید" />
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full relative min-h-[100px] max-w-full overflow-x-scroll z-10">
          {status === 0 ? (
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
                  filterData.map((item, index) => (
                    <>
                      <tr className="h-12  text-sm text-gray-600 hover:bg-primary-50 duration-100">
                        <td className="w-20 text-right px-3 border-x border-gray-200">
                          {index + 1}
                        </td>
                        <td className="  text-right px-3 border-x border-gray-200">
                          {item.serial}
                        </td>
                        <td className=" text-right px-3 border-x border-gray-200">
                          {moment(item.issuing_date)
                            .locale("fa")
                            .format("YYYY/MM/DD")}
                        </td>
                        <td className=" text-right px-3 border-x border-gray-200">
                          {moment(item.date).locale("fa").format("YYYY/MM/DD")}
                        </td>

                        <td className="text-right px-3 border-x border-gray-200">
                          {CurrencyNum.format(item.price)} تومان
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
                          className={`cursor-pointer text-right px-3 border-x border-gray-200 ${
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
                          {
                            statusOption.filter(
                              (e) => String(e.id) === String(item.status)
                            )[0].label
                          }
                        </td>
                        <td className="text-primary-900 relative z-0 text-right px-3 border-x border-gray-200">
                          <Popover className=" z-50">
                            <Popover.Button>
                              <IconBtn icon={<MdMoreHoriz />} />
                            </Popover.Button>
                            <Popover.Panel className="absolute  bg-white  rounded-cs -right-24 shadow-btn w-fit  top-5 z-50">
                              <div className=" flex flex-col items-center ">
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
                            </Popover.Panel>
                          </Popover>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          ) : (
            <PageLoading />
          )}
        </div>
        <Pagination
          // records={ckecks && ckecks.record}
          // count={ckecks && ckecks.count}
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
