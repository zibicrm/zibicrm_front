import React from "react";
import Image from "next/image";
import { FaFileMedical, FaMoneyCheckAlt, FaReceipt } from "react-icons/fa";
import Link from "next/link";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { ImageLogo, ImageLogoWhite } from "../../assets/Images";
import { useAuth, useAuthActions } from "../../Provider/AuthProvider";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../../common/Input";
import PrimaryBtn from "../../common/PrimaryBtn";
const UploadPage = () => {
  const { user, loading } = useAuth();
  const menuOption = [
    {
      id: 1,
      title: "تصویر چک",
      icon: <FaMoneyCheckAlt />,
      link: "upload/check",
    },
    {
      id: 0,
      title: "تصویر رسید دریافتی",
      icon: <FaReceipt />,
      link: "upload/receipt",
    },
    {
      id: 2,
      title: "تصویر پرونده بیمار‌",
      icon: <BsFillPersonBadgeFill />,
      link: "upload/record",
    },
    // {
    //   id: 3,
    //   title: "تصویر اسناد پزشکی",
    //   icon: <FaFileMedical />,
    //   link: "upload/file",
    // },
  ];
  const userDispatcher = useAuthActions();
  const validationSchema = yup.object({
    tell: yup
      .string()
      .required("نام کاربری خود را وارد کنید")
      .min(11, "حداقل 11 کاراکتر")
      .max(11, "حداکثر 11 کاراکتر"),
    password: yup.string().required("رمز عبور خود را وارد کنید"),
  });
  const initialValues = {
    tell: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      userDispatcher({
        type: "LOGIN",
        payload: values,
        formik: formik,
        redirectDahsboard: false,
      });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });
  if (user)
    return (
      <main
        className={`w-full md:max-w-[400px] bg-white mx-auto shadow-cs max-h-[99vh] pt-8 h-full min-h-screen flex flex-col items-center justify-center`}
      >
        <header className="h-12 flex items-center justify-center  bg-white w-full">
          <div className="w-36 h-14 relative">
            <Image src={ImageLogo} alt="zibident" objectFit="" layout="fill" />
          </div>
        </header>
        <section
          className="flex flex-col  min-h-[92vh] pb-10 pt-10 items-center px-6 bg-white
   gap-12 w-full  rounded-cs md:max-w-[400px] h-full "
        >
          {" "}
          <div className="h-fit w-full grid grid-cols-2 gap-4 auto-fit-grid justify-between justify-items-center">
            {menuOption.map((item) => (
              <Link href={item.link} key={item.id}>
                <button className=" w-[150px] py-5 border iconBox  border-none bg-white primary-svg shadow-cs rounded-cs  hover:shadow-btn  cursor-pointer flex flex-col items-center gap-4  hoverSvg-svg text-primary-900">
                  <div className=" bg-primary-50 rounded-full w-12 h-12 text-primary-900 text-2xl flex items-center justify-center duration-300 ">
                    {item.icon}
                  </div>
                  <span className=" text-xs ">{item.title}</span>
                </button>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  if (!user)
    return (
      <main
        className={`w-full h-full min-h-screen flex items-center justify-center   ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <section className="flex flex-col min-h-[99vh] items-center bg-primary-900 justify-between w-full  rounded-cs md:max-w-[400px] h-full shadow-cs">
          <div className="py-24  ">
            <Image src={ImageLogoWhite} alt="login" width={170} height={60} />
          </div>
          <form
            className="  w-full bg-primary-50 h-full  relative px-6 py-6 rounded-t-[48px] rounded-b-cs  shadow-cs"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full flex flex-col items-center gap-3 text-gray-900 mb-6">
              <h1 className="text-xl text-gray-900">
                به سامانه زیبدنت خوش آمدید{" "}
              </h1>
              <p className="text-xs ">
                لطفا نام کاربری و پسورد خود را وارد کنید
              </p>
            </div>
            <div className="flex flex-col items-start gap-[30px] relative ">
              <div className="w-full h-12">
                <Input
                  name="tell"
                  type="text"
                  label="نام کاربری"
                  formik={formik}
                />
              </div>
              <div className="w-full h-12">
                <Input
                  name="password"
                  type="password"
                  label="کلمه عبور"
                  formik={formik}
                  show={true}
                />
              </div>
            </div>
            <div className="h-12 mt-8">
              <PrimaryBtn
                text="ورود"
                status={formik.status}
                type={"submit"}
                disabled={!formik.isValid || formik.status === 1}
              />
            </div>
          </form>
        </section>
      </main>
    );
};

export default UploadPage;
