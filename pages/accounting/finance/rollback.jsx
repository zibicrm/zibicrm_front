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
import OutlineBtn from "../../../common/OutlineBtn";
import { CloseBtn } from "../../../common/CloseBtn";
import moment from "jalali-moment";
import {
  getRullbackChecksService,
  getTodayRollbackFinanceService,
  getWaitRollbackFinanceService,
  setRollbackStatusFinanceService,
} from "../../../Services/financeServices";
import SearchBox from "../../../Components/SearchBox";
import Tabs from "../../../Components/Tabs";
import SelectInput from "../../../common/SelectInput";
import { CurrencyNum } from "../../../hooks/CurrencyNum";
const Finance = () => {
  const [records, setRecords] = useState(null);
  const [isTreatment, setTreatment] = useState(false);
  const [treatmentItem, setTreatmentItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [filterData, setFilteredData] = useState(null);
  const head = [
    { id: 1, title: "نام بیمار" },
    { id: 2, title: "تاریخ عودت" },
    { id: 3, title: "مبلغ" },
    { id: 9, title: "دارنده حساب" },
    { id: 4, title: "شناسه حساب" },
    { id: 10, title: "کارشناس" },
    { id: 0, title: "وضعیت" },
    { id: 8, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    if (tab === 0) {
      getRullbackChecksService(
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
    } else if (tab === 1) {
      getTodayRollbackFinanceService({
        Authorization: "Bearer " + user.token,
      })
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
      getWaitRollbackFinanceService(
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
    refund_id: "",
    status: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setRollbackStatusFinanceService(
        { ...values, refund_id: treatmentItem },
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
  const searchHandler = (e) => {
    let searchData =
      filterData &&
      filterData.record &&
      filterData.record.map((item) => {
        delete item.created_at;
        delete item.updated_at;
        delete item.id;
        return item;
      });
    let res =
      searchData &&
      searchData.filter((obj) =>
        JSON.stringify(obj).toLowerCase().includes(e.toLowerCase())
      );
    setFilteredData(res);
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
  useEffect(() => {
    if (user && !loading) {
      getData();
    }
  }, [page, count, tab]);
  const tabsOption = [
    { id: 0, text: "همه" },
    { id: 1, text: "امروز" },
    { id: 2, text: "پرداخت نشده" },
  ];
  const statusOption = [
    { id: "0", label: "در انتظار پرداخت" },
    { id: "1", label: "واریز شد" },
  ];
 
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  //   if (!records) return <PageLoading />;
  return (
    <Layout>
      <div>
        <div className="bg-gray-50 h-[70px] px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl"
                type="button"
              >
                <MdArrowForward />
              </button>
              <h1 className="text-xl text-gray-900">مدیریت عودت</h1>
            </div>
            <div>
              <Tabs options={tabsOption} setTab={setTab} tab={tab} />
            </div>
          </div>
        </div>
        <div className="w-full h-20 flex flex-row items-center justify-between px-6 py-4">
          <div className="w-[40%]">
            <SearchBox
              allData={records}
              changeHandler={searchHandler}
              isState={true}
              setFilteredData={setFilteredData}
            />
          </div>
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
            {/* <div className="w-24 h-12 ">
              <PrimaryBtn text="ثبت پرداختی" onClick={() => setShow(!show)} />
            </div> */}
          </div>
        </div>
        <div className="w-full max-w-full  overflow-x-scroll h-[calc(100vh-295px)]">
          <table className="w-full min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
            <thead className="bg-gray-50 h-[42px]  min-w-[800px] md:min-w-fit sticky top-0 z-30 ">
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
            <tbody className="overflow-y-auto ">
              {filterData &&
                filterData.record &&
                filterData.record.map((item, index) => (
                  <>
                    <tr className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100">
                      <td className="w-20 text-right px-3 border-x border-gray-200">
                        {index + 1}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {item.document && item.document.name}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {moment(item.created_at)
                          .locale("fa")
                          .format("YYYY/MM/DD")}
                      </td>
                      <td className=" text-right px-3 border-x border-gray-200">
                        {CurrencyNum.format(item.amount)}
                      </td>

                      {/* <td className="  text-right px-3 border-x border-gray-200">
                        {item.description ? item.description : "-"}
                      </td> */}
                      <td className="text-right px-3 border-x border-gray-200">
                        {item.account_name}
                      </td>
                      <td className="cursor-pointer text-right px-3 border-x border-gray-200">
                        {item.account_number}
                      </td>
                      <td
                        className={`  text-right px-3 border-x border-gray-200 `}
                      >
                        {item.supplier &&
                          item.supplier.first_name +
                            " " +
                            item.supplier.last_name}
                      </td>
                      <td
                        className={`  text-right px-3 border-x border-gray-200 ${
                          item.status === 1 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {item.status === 1 ? "واریز شد" : "در انتظار پرداخت"}
                      </td>

                      <td className="text-primary-900 cursor-pointer text-right px-3 border-x border-gray-200">
                        <IconBtn
                          icon={<MdMoreHoriz />}
                          onClick={() => {
                            setTreatment(!isTreatment);
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
                defaultV={{}}
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
    </Layout>
  );
};

export default Finance;
