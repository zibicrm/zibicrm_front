import { useRouter } from "next/router";
import {
  MdArrowRightAlt,
  MdCompareArrows,
  MdLoop,
  MdOutlineDeleteSweep,
  MdRemoveRedEye,
} from "react-icons/md";

import IconBtn from "../../../common/IconBtn";
import Layout from "../../../Layout/Layout";
import React, { useEffect, useState } from "react";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import {
  ClinicRecordService,
  deleteRecordService,
  transferRecordService,
} from "../../../Services/recordServices";
import Modal from "../../../Components/Modal";
import { CloseBtn } from "../../../common/CloseBtn";
import PrimaryBtn from "../../../common/PrimaryBtn";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import moment from "jalali-moment";

import Link from "next/link";
import SelectInput from "../../../common/SelectInput";
import { getAllUsersService } from "../../../Services/userServies";
import { useFormik } from "formik";
import * as yup from "yup";
import { useExcelDownloder } from "react-xls";

const Appointment = () => {
  const [records, setRecords] = useState(null);
  const [users, setUsers] = useState(null);
  const [transfer, setTarnsfer] = useState(null);
  const [status, setStatus] = useState(0);
  const head = [
    { id: 1, title: "شماره پرونده" },
    { id: 2, title: "نام و نام خانوادگی" },
    { id: 4, title: "تلفن همراه" },
    { id: 10, title: "تاریخ ثبت" },
    { id: 6, title: "کارشناس" },
    { id: 8, title: "عملیات" },
  ];
  const router = useRouter();
  const { user, loading } = useAuth();
  const userDispatch = useAuthActions();

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [excelData, setExcelData] = useState([]);

  const data1 = {
    files: excelData,
  };

  const getData = async () => {
    setStatus(1);
    await ClinicRecordService({
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
          setRecords([]);
        } else {
          setRecords(data.result);
          let result = data.result;

          const formattedData = result?.map((item) => ({
            "شماره پرونده": item?.document_id,
            نام: item?.name,
            تلفن: item?.tell,
            کارشناس:
              item.user && item.user.first_name + " " + item.user.last_name,
            "تاریخ ثبت": moment(item.created_at)
              .locale("fa")
              .format("YYYY/MM/DD"),
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
  };
  const getUser = () => {
    getAllUsersService(
      {
        count: 200,
        page: 1,
      },
      {
        Authorization: "Bearer " + user.token,
      }
    )
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          let userList = data.result.map((item) => {
            return {
              name: item.first_name + " " + item.last_name,
              id: item.id,
            };
          });
          setUsers(userList);
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
  const deleteHandler = (id) => {
    deleteRecordService(id, {
      Authorization: "Bearer " + user.token,
    })
      .then(({ data }) => {
        if (data.status === false) {
          toast.error(data.message[0]);
        } else {
          toast.success("با موفقیت حذف شد");
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
  const validationSchema = yup.object({
    document_id: yup.string().required("نام بیمار را وارد کنید"),
    user_id: yup.string().required("کارشناس را انتخاب کنید"),
  });
  const initialValues = {
    document_id: "",
    user_id: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      transferRecordService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("بیمار با موفقیت انتقال یافت");
            setTarnsfer(null);
            getData();
          }
          formik.setStatus(0);
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
          formik.setStatus(0);
        });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
    if (user && !loading) {
      getData();
      getUser();
    }
  }, [user, loading]);

  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!records) return <PageLoading />;

  return (
    <Layout>
      <div className="h-full w-full ">
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-between border-b border-primary-900">
          <div className="flex flex-row items-center gap-5">
            <h1 className="text-xl text-gray-900">پرونده های مطب</h1>
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-end px-6 py-4">
          <div className="flex flex-row items-center gap-3">
            <div className={status === 1 ? "animate-spin" : ""}>
              <IconBtn
                icon={<MdLoop />}
                onClick={() => {
                  setStatus(1);
                  getData();
                }}
              />
            </div>
            <div className="flex flex-row items-center justify-center rounded-cs   min-w-fit text-primary-900 text-xs h-12">
              <ExcelDownloder
                data={{ files: excelData }}
                filename={"پرونده های مطب"}
                type={Type.Button}
              >
                دانلود اکسل
              </ExcelDownloder>
            </div>
          </div>
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
                    onClick={() => setSort("date")}
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
              {records.map((item, index) => (
                <tr
                  key={item.id}
                  className="h-12 cursor-pointer text-sm text-gray-600 hover:bg-primary-50 duration-100"
                >
                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  w-20 text-right px-3 border-x border-gray-200"
                    >
                      {index + 1}
                    </a>
                  </Link>
                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  text-right px-3 border-x border-gray-200"
                    >
                      {item.document_id ? item.document_id : "-"}
                    </a>
                  </Link>
                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  text-right px-3 border-x border-gray-200"
                    >
                      {item.name}
                    </a>
                  </Link>
                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  text-right px-3 border-x border-gray-200"
                    >
                      {item.tell}
                    </a>
                  </Link>

                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  text-right px-3 border-x border-gray-200"
                    >
                      {moment(item.created_at)
                        .locale("fa")
                        .format("YYYY/MM/DD")}
                    </a>
                  </Link>
                  <Link href={`/admin/record/detail/?id=${item.id}`}>
                    <a
                      target={"_blank"}
                      rel={"nofollow"}
                      className="table-cell align-middle  text-right px-3 border-x border-gray-200"
                    >
                      {item.user &&
                        item.user.first_name + " " + item.user.last_name}
                    </a>
                  </Link>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className=" text-right flex flex-row items-center justify-start text-base px-3 lg:text-xl gap-3 h-12 border-x border-gray-200"
                  >
                    <IconBtn
                      icon={<MdRemoveRedEye />}
                      onClick={() =>
                        router.push(`/admin/record/detail/?id=${item.id}`)
                      }
                    />
                    {user && user.user && user.user.id === 1 ? (
                      <IconBtn
                        icon={<MdOutlineDeleteSweep />}
                        onClick={() => deleteHandler(item.id)}
                      />
                    ) : null}
                    <IconBtn
                      icon={<MdCompareArrows />}
                      onClick={() => {
                        setTarnsfer(item);
                        formik.setFieldValue("document_id", item.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {transfer ? (
        <Modal
          setModal={() => {
            null;
          }}
        >
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-8 relative rounded-cs max-w-sm w-96 gap-4 flex flex-col"
          >
            <CloseBtn onClick={() => setTarnsfer(null)} />
            <h2 className="text-xl">انتقال پرونده {transfer.name}</h2>
            <SelectInput
              label="کارشناس"
              name="user_id"
              selectOption={users}
              labelOption="name"
              valueOption="id"
              formik={formik}
            />

            <div className="w-full mt-4 h-12">
              <PrimaryBtn
                text="ثبت"
                disabled={formik.status === 1}
                status={formik.status}
                type="submit"
              />
            </div>
          </form>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Appointment;
