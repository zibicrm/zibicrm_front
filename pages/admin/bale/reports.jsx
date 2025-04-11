import React from "react";
import Layout from "../../../Layout/Layout";
import Select from "react-select";
import { useAuth } from "../../../Provider/AuthProvider";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect } from "react";
import { getAllUsersService } from "../../../Services/userServies";
import SelectInput from "../../../common/SelectInput";
import Pagination from "../../../Components/Pagination";
import { baleGetSupplierReports } from "../../../Services/bale";
import { toast } from "react-toastify";
import jmoment from "jalali-moment";
import Modal from "../../../Components/Modal";
import { CloseBtn } from "../../../common/CloseBtn";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    border: "#2C6DD1",
    boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
    padding: 0,

    "&:hover": {
      border: "none",
      borderColor: "#F5FAFB",
      boxShadow: "0px 0px 20px rgba(203, 225, 255, 0.4)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    border: "none",
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    border: "none !important",
    boxShadow: "none !important",

    outline: "none",
    "&:hover": {
      border: "none",
      borderColor: "#F5FAFB",
      boxShadow: "none",
    },
  }),
  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#1A1D20",
    borderRadius: "5px",
    boxShadow: "none",
    backgroundColor: "#fff",

    "&:hover": {
      backgroundColor: "#F5FAFB",
      boxShadow: "none",
    },
  }),
};

const ReportsPage = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [allData, setAllData] = useState(0);
  const [showSupplierReports, setShowSupplierReports] = useState(-20);



  const validationSchema = yup.object({
    user_id: yup.string().required("کارشناس را انتخاب کنید"),
  });
  const initialValues = {
    user_id: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      baleGetSupplierReports(
        { supplier_id: values.user_id, count: 20, page: 1 },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setPage(1)
            setData(data.result.users);
            setStatistics(data.result.statistics);
            setAllData(data.result.all);
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
    if (formik && formik.values.user_id) {
      baleGetSupplierReports(
        { supplier_id: formik.values.user_id, count: 20, page: page },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setData(data.result.users);
            setStatistics(data.result.statistics);
            setAllData(data.result.all);
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
    }
  }, [loading, page]);

  const getData = () => {
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
        // setStatus(0);
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

        // setStatus(0);
      });
  };


 

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && !loading) {
      getData();
    }
  }, [loading]);

  return (
    <Layout>
      <div className="flex flex-col max-h-[calc(100vh-120px)]">
        <div className="bg-gray-50 px-6 py-6 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <h1 className="text-xl text-gray-900">گزارشات</h1>
        </div>
        <div className="p-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center gap-x-4">
              <h2>کارشناس مورد نظر خود را انتخاب نمایید</h2>
              <div>
                <div className="w-[373px]">
                  <SelectInput
                    formik={formik}
                    label="کارشناس"
                    name="user_id"
                    selectOption={users}
                    labelOption="name"
                    valueOption="id"
                  />
                </div>
              </div>
              <div className="">
                <div className="w-[169px] h-12">
                  <PrimaryBtn
                    text={"مشاهده نتیجه"}
                    disabled={!formik.values.user_id}
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </form>
          <div className="grid grid-cols-10 gap-x-4 bg-gray-50 rounded-cs p-6 mt-8">
            <div className="col-span-2 flex flex-col items-center justify-center gap-y-3 bg-white rounded-cs p-4">
              <h2>کل کاربران کارشناس</h2>
              <span className="flex items-center justify-center bg-primary-50 text-primary-900 w-[80px] py-2">
                {allData ? allData : 0} نفر
              </span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center gap-y-3 bg-white rounded-cs p-4">
              <h2>کاربران پاسخ داده شده</h2>
              <span className="flex items-center justify-center bg-green-50 text-green-700 w-[80px] py-2">
                {statistics.length > 0 &&
                statistics.find((s) => s.latest_status === 2)
                  ? statistics.find((s) => s.latest_status === 2).count
                  : 0}{" "}
                نفر
              </span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center gap-y-3 bg-white rounded-cs p-4">
              <h2>کاربران پاسخ داده نشده</h2>
              <span className="flex items-center justify-center bg-red-50 text-red-700 w-[80px] py-2">
                {statistics.length > 0 &&
                statistics.find((s) => s.latest_status === 1)
                  ? statistics.find((s) => s.latest_status === 1).count
                  : 0}{" "}
                نفر
              </span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center gap-y-3 bg-white rounded-cs p-4">
              <h2>کاربران در انتظار پاسخ</h2>
              <span className="flex items-center justify-center bg-[#F6ECDD] text-warning w-[80px] py-2">
                {statistics.length > 0 &&
                statistics.find((s) => s.latest_status === 3)
                  ? statistics.find((s) => s.latest_status === 3).count
                  : 0}{" "}
                نفر
              </span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center gap-y-3 bg-white rounded-cs p-4">
              <h2>اتمام گفت وگو</h2>
              <span className="flex items-center justify-center bg-gray-50 text-gray-900 w-[80px] py-2">
                {statistics.length > 0 &&
                statistics.find((s) => s.latest_status === 4)
                  ? statistics.find((s) => s.latest_status === 4).count
                  : 0}{" "}
                نفر
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full max-w-full min-h-[400px] overflow-x-scroll border mt-6">
            <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
              <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                <tr className="text-right text-sm">
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    ردیف
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900 whitespace-nowrap">
                    نام بیمار
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    شماره تلفن
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    تاریخ انتقال بیمار
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    وضعیت پیگیری
                  </th>
                  <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                    گزارشات کارشناس
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {data.length > 0 &&
                  data.map((d, index) => (
                    <tr
                      key={index}
                      className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100"
                    >
                      <td
                        className={`w-20 text-right px-3 border-x border-gray-200 `}
                      >
                        {index + 1 +  ((page - 1) * 20)}
                      </td>
                      <td className="text-right px-3 border-x border-gray-200">
                        {!d.name && !d.sname
                          ? "کاربر ناشناس"
                          : `${d.sname ? d.sname : d.name}`}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {d.tell ? d.tell : "-"}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        {d.transfer_at
                          ? jmoment(d.transfer_at)
                              .locale("fa")
                              .format("YYYY/MM/DD")
                          : "-"}
                      </td>

                      <td
                        className={`items-center  text-right px-3 border-x h-full border-gray-200 ${
                          d.latest_status === 2
                            ? "text-green-700"
                            : d.latest_status === 1
                            ? "text-red-700"
                            : d.latest_status === 3
                            ? "text-[#FF9900]"
                            : "text-gray-600"
                        }`}
                      >
                        {d.latest_status === 2
                          ? "پاسخ داده شده"
                          : d.latest_status === 1
                          ? "پاسخ داده نشده"
                          : d.latest_status === 3
                          ? "درانتظار پاسخ"
                          : "اتمام گفت و گو"}
                      </td>
                      <td className="  text-right px-3 border-x border-gray-200">
                        <div className="max-w-[72px] h-8">
                          {d.bale_event.length > 0 && (
                            <PrimaryBtn
                              text={"مشاهده"}
                              onClick={() => setShowSupplierReports(d.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              
            </table>
            {data.length === 0 && <div className="flex items-center justify-center min-h-[300px]">گزارشی موجود نیست</div>}
          </div>

          <div>
            <Pagination setPage={setPage} page={page} />
          </div>
        </div>
      </div>
      {showSupplierReports > 0 && (
        <Modal setModal={() => setShowSupplierReports(-20)}>
          <div className="overflow-hidden p-6 bg-white rounded-cs">
            <div className=" w-[438px]">
              <h1>گزارشات کارشناس</h1>
              <div className="">
                <div className="w-full max-w-full min-h-[250px] max-h-[250px]   overflow-y-auto overflow-x-scroll border mt-6  ">
                  <table className="w-full  min-w-[600px] md:min-w-fit  max-w-full overflow-x-scroll  ">
                    <thead className="bg-gray-50 h-[42px] min-w-[800px] md:min-w-fit  ">
                      <tr className="text-right text-sm">
                        <th className=" text-right border px-3 border-gray-200 relative text-gray-900">
                          توضیحات
                        </th>
                        <th className=" text-right border px-3 border-gray-200 relative text-gray-900 whitespace-nowrap">
                          تاریخ ثبت
                        </th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                      {data.length > 0 &&
                        data
                          .find((d) => d.id === showSupplierReports)
                          .bale_event.map((b, index) => (
                            <tr
                              key={index}
                              className="h-12 text-sm text-gray-600 border-b hover:bg-primary-50 duration-100"
                            >
                              <td
                                className={`text-right px-3 border-x border-gray-200 w-full`}
                              >
                                {b.message}
                              </td>

                              <td className="  text-right px-3 border-x border-gray-200">
                                {
                                  jmoment(b.updated_at)
                                      .locale("fa")
                                      .format("YYYY/MM/DD")
                                  }
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <CloseBtn onClick={() => setShowSupplierReports(-20)} />
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default ReportsPage;
