import { useRouter } from "next/router";
import {
  MdArrowDropDown,
  MdArrowForward,
  MdArrowRightAlt,
  MdLoop,
} from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import * as yup from "yup";
import { useFormik } from "formik";
import Layout from "../../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import CountSelect from "../../../../Components/CountSelect";
import { toast } from "react-toastify";
import Pagination from "../../../../Components/Pagination";
import {
  getFinanceByIdService,
  getFinanceRecordService,
  rollbackPriceService,
} from "../../../../Services/recordServices";
import Error from "next/error";
import PageLoading from "../../../../utils/LoadingPage";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import Modal from "../../../../Components/Modal";
import Link from "next/link";
import Input from "../../../../common/Input";
import OutlineBtn from "../../../../common/OutlineBtn";
import { CloseBtn } from "../../../../common/CloseBtn";
import { Disclosure } from "@headlessui/react";
import moment from "jalali-moment";
import { CurrencyNum } from "../../../../hooks/CurrencyNum";
const Finance = () => {
  const [records, setRecords] = useState(null);
  const [finance, setFinance] = useState(null);
  const [show, setShow] = useState(false);
  const [isRollback, setRollback] = useState(false);
  const [rollbackItem, setRollbackItem] = useState(null);
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(50);
  const [page, setPage] = useState(1);
  const head = [
    { id: 0, title: "شماره پرونده" },
    { id: 1, title: "تاریخ" },
    { id: 2, title: "مبلغ پرداختی" },
    { id: 3, title: "نوع پرداخت" },
    { id: 4, title: "توضیحات" },
    { id: 5, title: "ثبت درمان" },
    { id: 7, title: "عملیات" },
  ];
  const router = useRouter();
  const id = router.query.id;
  const { user, loading } = useAuth();

  const userDispatch = useAuthActions();

  const getData = () => {
    getFinanceRecordService(
      {
        count: count,
        page: page,
        document_id: id,
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
  const getFinance = (id) => {
    getFinanceByIdService(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          setFinance(data.result[0]);
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
  const validationSchema = yup.object({
    account_number: yup
      .number()
      .typeError("فرمت شماره حساب صحیح نمی باشد")
      .required("شماره حساب را وارد کنید"),
    account_name: yup.string().required("نام دارنده حساب را وارد کنید"),
  });
  const initialValues = {
    account_number: "",
    account_name: "",
    description: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      rollbackPriceService(
        {
          document_id: rollbackItem.document_id,
          treatment_id: rollbackItem.id,
          ...values,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(data.result[0]);
            setRollback(false);
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
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  useEffect(() => {
    if (user && user.token && id) {
      getData();
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);
  useEffect(() => {
    if (user && !loading) {
      getData();
    }
  }, [page, count]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!records) return <PageLoading />;
  return (
    <Layout>
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
            <h1 className="text-xl text-gray-900">مدیریت مالی</h1>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          {/* <div className="w-[40%]">
            <SearchBox />
          </div> */}
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
              {records &&
                records.record &&
                records.record.map((item, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <>
                        <tr className="h-12 text-sm text-gray-600 hover:bg-primary-50 duration-100">
                          <td>
                            <Disclosure.Button className="w-full py-3 flex items-center justify-center">
                              <MdArrowDropDown />
                            </Disclosure.Button>
                          </td>
                          <td className="w-20 text-right px-3 border-x border-gray-200">
                            {index + 1}
                          </td>
                          <td className="  text-right px-3 border-x border-gray-200">
                            {item.document_id}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {moment(item.created_at)
                              .locale("fa")
                              .format("YYYY/MM/DD")}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {CurrencyNum.format(item.receive_price)}
                          </td>
                          <td className=" text-right px-3 border-x border-gray-200">
                            {item.payment_type === 1
                              ? "نقدی"
                              : item.payment_type === 2
                              ? "اقساطی"
                              : "چکی"}
                          </td>

                          <td className="  text-right px-3 border-x border-gray-200">
                            {item.description ? item.description : "-"}
                          </td>
                          <td
                            onClick={() => {
                              setShow(item.id);
                              getFinance(item.id);
                            }}
                            className="text-primary-900 cursor-pointer text-right px-3 border-x border-gray-200"
                          >
                            مشاهده
                          </td>
                          <td className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200">
                            <button
                              onClick={() => {
                                setRollback(!isRollback);
                                setRollbackItem(item);
                              }}
                              className="w-20 h-8 rounded-cs bg-warning text-white text-sm"
                            >
                              عودت وجه
                            </button>
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
                                    {item.treatment_id}
                                  </td>
                                  <td className=" text-right px-3 border-x border-gray-200">
                                    {CurrencyNum.format(item.amount)}
                                  </td>
                                  <td
                                    colSpan={2}
                                    className=" text-right px-3 border-x border-gray-200"
                                  >
                                    {moment(item.date).format("YYYY/MM/DD")}
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
          records={records.record}
          count={records.count}
          setPage={setPage}
          page={page}
        />
      </div>
      {show ? (
        <Modal setModal={() => setShow(false)}>
          {finance && (
            <div className="bg-white p-4 rounded-cs flex relative flex-col gap-4">
              <h1 className="w-full py-3  text-center ">مشاهده ثبت درمان</h1>
              <CloseBtn onClick={() => setShow(!show)} />
              <div className="w-96 max-w-full overflow-x-scroll ">
                <h2 className="w-full border-x border-t rounded-cs py-3 bg-primary-50 border-primary-700 text-center ">
                  اطلاعات
                </h2>
                <table className="w-full  text-center border border-primary-700 rounded-cs p-4 min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                  <tr>
                    <th className="border-l  border-primary-700 py-3 block">
                      مطب
                    </th>
                    <td>{finance.clinic.title}</td>
                  </tr>
                  <tr>
                    <th className="border-l border-primary-700 py-3 block">
                      پزشک
                    </th>
                    <td>
                      {finance &&
                        finance.doctor &&
                        finance.doctor[0] &&
                        finance.doctor[0].name}
                    </td>
                  </tr>
                  <tr className="">
                    <th className="border-l border-primary-700 py-3 block">
                      دستیار
                    </th>
                    <td className="w-1/2">{finance.assistant}</td>
                  </tr>
                </table>
              </div>
              <div className="w-96 max-w-full overflow-x-scroll ">
                <h2 className="w-full border-x rounded-cs border-t py-3 bg-primary-50 border-primary-700 text-center ">
                  خدمات
                </h2>
                <table className="w-full text-center border border-primary-700 rounded-cs p-4 min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                  {finance.treatment_service &&
                    finance.treatment_service.map((item, index) => (
                      <tr key={index} className=" w-full">
                        <th className="border-l  border-primary-700 py-3 block">
                          {item.service_title + " * " + item.count}
                        </th>
                        <td className="w-1/2">
                          {CurrencyNum.format(item.sum_cost * item.count)} تومان
                        </td>
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          )}
        </Modal>
      ) : null}
      {isRollback ? (
        <Modal>
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded-cs p-4 w-96 flex flex-col gap-6"
          >
            <span>عودت وجه</span>
            <div className="flex flex-col gap-6">
              <Input
                name="account_number"
                type="text"
                label="شناسه حساب"
                show={false}
                formik={formik}
              />
              <Input
                name="account_name"
                type="text"
                label="نام دارنده حساب"
                show={false}
                formik={formik}
              />
              <textarea
                placeholder="علت عودت"
                {...formik.getFieldProps("description")}
                className={`p-2 border border-primary-400 rounded-cs text-xs outline-none w-full max-h-72 h-64 col-span-3`}
              />
            </div>
            <div className="w-full flex flex-row items-center gap-3">
              <div className="w-1/2 h-12">
                <OutlineBtn text="انصراف" onClick={() => setRollback(false)} />
              </div>
              <div className="w-1/2 h-12">
                <PrimaryBtn text="ثبت" type="submit" />
              </div>
            </div>
            <CloseBtn onClick={() => setRollback(false)} />
          </form>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Finance;
