import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import PrimaryBtn from "../../../common/PrimaryBtn";

import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";
import { changePasswordUserService } from "../../../Services/userServies";
const ChangePassword = (props) => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const validationSchema = yup.object({
    password: yup.string().required("رمز عبور را وارد کنید"),
    confirmPassword: yup
      .string()
      .required("رمز عبور را مجدد کنید")
      .oneOf([yup.ref("password"), null], "رمز عبور همخوانی ندارد"),
  });
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
  }, [user, loading]);
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      changePasswordUserService(
        { password: values.password },
        {
          Authorization: "Bearer " + user.token,
        }
      )
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("رمز عبور با موفقیت تغییر کرد");
            userDispatch({
              type: "LOGOUT",
              payload: { Authorization: "Bearer " + user.token },
            });
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
  if (user && user.user.rule !== 3) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/clinic")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">تغییر رمز عبور</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="password"
            type="password"
            label="رمز عبور"
            formik={formik}
            show={true}
            onChange={(e) => {
              formik.setFieldValue("password", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="confirmPassword"
            type="password"
            label="تکرار رمز عبور"
            show={true}
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue(
                "confirmPassword",
                toEnDigit(e.target.value)
              );
            }}
          />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>
          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت تغییرات"
              type="submit"
              status={formik.status}
              disabled={formik.status === 1 || !formik.isValid}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default ChangePassword;
