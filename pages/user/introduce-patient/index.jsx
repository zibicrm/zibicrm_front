import React from "react";
import LayoutUser from "../../../Layout/LayoutUser";
import Input from "../../../common/Input";
import * as yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import PrimaryBtn from "../../../common/PrimaryBtn";
import PageLoading from "../../../utils/LoadingPage";
import { useEffect } from "react";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../../../Provider/PatientAuthProvider";
import { useRouter } from "next/router";
import {
  getPatientIntroductionList,
  patientIntroduction,
} from "../../../Services/patientDocumentService";
import toEnDigit from "../../../hooks/ToEnDigit";
import { toast } from "react-toastify";
import moment from "jalali-moment";

const IntroducePatientPage = () => {
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const router = useRouter();
  const [introductionList, setIntroductionList] = useState(null);
  const [reload, setReload] = useState(false);

  const head = [
    { id: 0, title: "نام بیمار" },
    { id: 1, title: "تلفن همراه" },
    { id: 2, title: "تاریخ" },
    { id: 3, title: "وضعیت" },
  ];

  const patientIntroductionList = async () => {
    getPatientIntroductionList({
      token: user.token,
    })
      .then(({ data }) => {
        // new device
        if (data.status === false && data.statusCode === 403) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (data.status === false && data.statusCode !== 403) {
          toast.error(data.message[0], {
            position: "top-right",
          });
        } else {
          setIntroductionList(data.result);
        }
        formik.setStatus(0);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          patientDispatcher({
            type: "LOGOUTNOTTOKEN",
          });
        }
        if (err.response) {
          toast.error(err.response.data.message, {
            position: "top-right",
          });
        }
        formik.setStatus(0);
      });
  };

  const validationSchema = yup.object({
    tell: yup
      .string()
      .required("شماره تلفن مراجعه کننده را وارد کنید")
      .matches(/^[0][9][0-9]{9}$/, "فرمت شماره تلفن صحیح نمی باشد"),
    name: yup.string().required("نام مراجعه کننده را وارد کنید").nullable(),
  });
  const initialValues = {
    tell: "",
    name: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      patientIntroduction(values, {
        token: user.token,
      })
        .then(({ data }) => {
          // new device
          if (data.status === false && data.statusCode === 403) {
            patientDispatcher({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (data.status === false && data.statusCode !== 403) {
            toast.error(data.message[0], {
              position: "top-right",
            });
          } else {
            router.push({ pathname: window.location.href }, undefined, {
              scroll: false,
            });
            setReload(!reload);

            toast.success("بیمار با موفقیت اضافه شد", {
              position: "top-right",
            });
            setSuccess(true);
          }
          formik.setStatus(0);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            patientDispatcher({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (err.response) {
            toast.error(err.response.data.message, {
              position: "top-right",
            });
          }
          formik.setStatus(0);
        });
      formik.resetForm();
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  useEffect(() => {
    if (user && user?.token) {
      patientIntroductionList();
    }
  }, [loading, reload]);

  if (!introductionList) {
    return <PageLoading />;
  }

  return (
    <LayoutUser>
      <h1 className="text-gray-900 md:font-bold md:text-xl md:mt-8 ">
        معرفی بیمار
      </h1>
      <div className="md:bg-white md:shadow-card md:p-6 md:mt-6 rounded-lg  ">
        <p className="text-gray-900 text-xs mt-4 md:text-sm">
          کاربر گرامی، شما می توانید با معرفی بیماران دیگر به زیبیدنت از کد
          تخفیف برای انجام کارهای خود در زیبیدنت برخوردار شوید.
        </p>
        <div className="mt-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-3">
              <div className="col-span-2 md:w-1/3">
                <Input
                  name="name"
                  type="text"
                  label="نام بیمار"
                  formik={formik}
                />
              </div>
              <div className="col-span-2 md:w-1/3">
                <Input
                  name="tell"
                  type="text"
                  label=" تلفن همراه"
                  formik={formik}
                  onChange={(e) => {
                    formik.setFieldValue("tell", toEnDigit(e.target.value));
                  }}
                />
              </div>
              <div className="w-full flex justify-end md:w-1/3">
                <div className="w-full h-12 ">
                  <PrimaryBtn
                    text="ثبت"
                    type="submit"
                    status={formik.status}
                    //   disabled={formik.status === 1 || !formik.isValid || success}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-6 mt-8 md:bg-white md:p-6 md:rounded-lg  md:mt-5">
          <h1>بیماران معرفی شده</h1>
          <div className="w-full overflow-x-auto max-h-[403px] bg-white border rounded-lg shadow-card md:shadow-none">
            <table className="w-full rounded-lg ">
              <thead className="">
                <tr className="">
                  {head.map((item, index) => (
                    <th
                      key={item.id}
                      className={`font-light text-sm border-b border-l border-gray-200 text-gray-900 px-2 py-4 md:bg-gray-50 ${
                        index === head.length - 1 && "border-l-transparent"
                      } `}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {introductionList &&
                  introductionList.map((item) => {
                    return (
                      <tr className="" key={item.id}>
                        <td className="font-light text-[10px] md:text-xs border-l   border-gray-200  text-center whitespace-nowrap px-2 py-4">
                          {item.name}
                        </td>
                        <td className="font-light text-[10px] md:text-xs border-l  border-gray-200 text-center whitespace-nowrap px-2 py-4">
                          {item.tell}
                        </td>
                        <td className="font-light text-[10px] md:text-xs border-l  border-gray-200 text-center whitespace-nowrap px-2 py-4">
                          {moment(item.created_at, "YYYY/MM/DD")
                            .locale("fa")
                            .format("YYYY/MM/DD")}{" "}
                        </td>
                        <td
                          className={`font-light text-[10px] md:text-xs ${
                            item.status === 0 ? "" : "text-green-700"
                          }  border-gray-200 text-center whitespace-nowrap px-2 py-4`}
                        >
                          {item.status === 0
                            ? "در انتظار مراجعه"
                            : "مراجعه کرده"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutUser>
  );
};

export default IntroducePatientPage;
