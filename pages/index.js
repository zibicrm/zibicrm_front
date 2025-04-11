import Header from "../Layout/Header";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import * as yup from "yup";
import { useFormik } from "formik";
import Image from "next/image";
import PrimaryBtn from "../common/PrimaryBtn";
import { useAuth, useAuthActions } from "../Provider/AuthProvider";
import { ImageLogoBlack } from "../assets/Images";
import { IoEyeSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import Router from "next/router";
import Link from "next/link";
export default function Home() {
  const { user, loading } = useAuth();
  const userDispatcher = useAuthActions();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (user && user.token && !loading) {
      setStatus(1);
      let redirectLink;
      user.user.rule === 1
        ? (redirectLink = "/operator")
        : user.user.rule === 2 && user.user.accountant !== 1
        ? (redirectLink = "/admin")
        : user.user.rule === 2 && user.user.accountant === 1
        ? (redirectLink = "/accounting")
        : (user.user.rule === 3 && user.user.doctor !== 1)
        ? (redirectLink = "/clinic")
        : (user.user.rule === 3 && user.user.doctor === 1)
        ? (redirectLink = "/doctor")
        : null
      Router.push(redirectLink);
    }
  }, [loading]);
  const validationSchema = yup.object({
    username: yup.number().required("نام کاربری خود را وارد کنید"),
    password: yup.string().required("رمز عبور خود را وارد کنید"),
  });
  const initialValues = {
    username: "",
    password: "",
  };
  const [passwordShow, setPasswordShow] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      let finalValues = {
        tell: values.username,
        password: values.password,
      };
      userDispatcher({
        type: "LOGIN",
        payload: finalValues,
        formik: formik,
        redirectDahsboard: true,
      });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  return (
    <div
      className={`w-full h-full min-h-screen mx-auto flex flex-row items-center justify-center px-4 bg-login-bg ${
        loading || status === 1 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="bg-white rounded-cs bg-opacity-[0.24] backdrop-blur-md w-full md:w-[35rem] z-20  h-fit   max-h-[90vh]  px-8 py-10 flex flex-col items-center justify-center max-w-lg">
        <div className="w-60">
          <Image alt="zibident" src={ImageLogoBlack} className="object-cover" />
        </div>
        <div className="w-full flex flex-col items-center gap-3 mt-4">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-white font-bold  md:text-3xl">ورود</h1>
            <p className="text-sm text-center md:text-base text-white ">
              لطفا نام کاربری و رمز عبور خود را وارد نمایید
            </p>
          </div>
          <form
            className="max-w-[95vw] md:max-w-xl mx-auto relative px-0 md:px-16 py-8 rounded-cs w-full shadow-cs"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col items-start gap-8 min-w-full w-full">
              <div className="w-full">
                <div className="relative z-0 w-full md:max-h-[46px] max-h-[42px] input-controll">
                  <input
                    id="username"
                    type={"text"}
                    placeholder="نام کاربری"
                    {...formik.getFieldProps("username")}
                    className={`pt-3 pb-2 block w-full px-6 mt-0 text-sm text-white border rounded-cs md:max-h-[46px] max-h-[42px] bg-transparent autofill:bg-transparent  appearance-none focus:outline-none focus:ring-0 focus:bg-transparent placeholder:text-white  ${
                      formik.errors.username && formik.touched.username
                        ? "shadow-err border-red-300 hover:shadow-err"
                        : "hover:shadow-btn border-white hover:border-white focus:border-white"
                    }`}
                  />

                  {formik.errors.username && formik.touched.username && (
                    <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                      {formik.errors.username}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative z-0 w-full md:max-h-[46px] max-h-[42px] input-controll">
                <input
                  id="password"
                  type={passwordShow ? "text" : "password"}
                  placeholder="کلمه عبور"
                  {...formik.getFieldProps("password")}
                  className={`pt-3 pb-2 block w-full px-6 mt-0 text-sm text-white border rounded-cs md:max-h-[46px] max-h-[42px] bg-transparent autofill:bg-transparent appearance-none focus:outline-none focus:ring-0 focus:bg-transparent  placeholder:text-white ${
                    formik.errors.password && formik.touched.password
                      ? "shadow-err border-red-300 hover:shadow-err"
                      : "hover:shadow-btn border-white hover:border-white focus:border-white"
                  }`}
                />

                <button
                  className="text-white absolute md:text-2xl text-lg top-3 left-4"
                  onClick={() => setPasswordShow(!passwordShow)}
                  type={"button"}
                >
                  {<IoEyeSharp />}
                </button>

                {formik.errors.password && formik.touched.password && (
                  <div className="md:text-xs text-[10px] text-red-300 mt-1.5">
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>
            <button type="button" className="text-white text-xs underline mt-5">
              رمز عبور را فراموش کرده ا م
            </button>
            <div className="h-12 mt-5">
              <PrimaryBtn
                text="ورود"
                status={formik.status}
                type={"submit"}
                disabled={!formik.isValid || formik.status === 1}
              />
            </div>
            <div className="mt-4">
              <Link href={'/user/user-login'}>
                  <p className="text-xs text-white underline cursor-pointer">ورود مراجعه کنندگان</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
