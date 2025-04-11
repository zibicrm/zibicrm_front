import * as yup from "yup";
import { useFormik } from "formik";
import Image from "next/image";
import PrimaryBtn from "../../common/PrimaryBtn";
import { useAuth, useAuthActions } from "../../Provider/AuthProvider";
import { ImageLogoBlack } from "../../assets/Images";
import { IoEyeSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import Router from "next/router";
import {
  patientGetOTPCode,
  patientLogin,
} from "../../Services/patientLoginService";
import { toast } from "react-toastify";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../../Provider/PatientAuthProvider";
import { CgSpinner } from "react-icons/cg";
export default function Home() {
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const [status, setStatus] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  useEffect(() => {
    if (user && user.token && !loading) {
      setStatus(1);

      Router.push("/user");
    }
  }, [loading]);

  const validationSchema = yup.object({
    tell: yup
      .string()
      .typeError("فرمت شماره تلفن صحیح نمی باشد")
      .required("شماره تلفن مراجعه کننده را وارد کنید"),
    otpCode: yup.number().required("کد خود را وارد کنید"),
  });
  const initialValues = {
    tell: "",
    otpCode: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      let finalValues = {
        tell: values.tell,
        otp: values.otpCode,
      };
      patientDispatcher({
        type: "LOGIN",
        payload: finalValues,
        formik: formik,
        redirectDahsboard: true,
      });
    },
    // onSubmit: (values) => {
    //   formik.setStatus(1);

    //   patientLogin({ tell: formik.values.tell, otp: formik.values.otpCode })
    //     .then(({ data }) => {
    //       if (data.status === false) {
    //         toast.error(data.message[0]);
    //       } else {
    //         Router.push("/user");
    //       }
    //       setTimeStatus(0);
    //     })
    //     .catch((err) => {
    //       if (err.response && err.response.status === 401) {
    //           userDispatch({
    //             type: "LOGOUTNOTTOKEN",
    //           });
    //       }
    //       if (err.response) {
    //         toast.error(err.response.data.message);
    //       }
    //       setTimeStatus(0);
    //     });
    //     let finalValues = {
    //       tell: values.username,
    //       password: values.password,
    //     };
    //     userDispatcher({
    //       type: "LOGIN",
    //       payload: finalValues,
    //       formik: formik,
    //       redirectDahsboard: true,
    //     });
    // },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  async function getCodeHandler(e) {
    e.preventDefault();
    setCodeLoading(true);
    if (formik.values.tell) {
      await patientGetOTPCode({ tell: formik.values.tell })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
            setCodeLoading(false);
          } else {
            setCodeLoading(false);
          }
          // setTimeStatus(0);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            //   userDispatch({
            //     type: "LOGOUTNOTTOKEN",
            //   });
            setCodeLoading(false);
          }
          if (err.response) {
            toast.error(err.response.data.message);
            setCodeLoading(false);
          }
          // setTimeStatus(0);
        });
    }
  }

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
              لطفا تلفن همراه خود را وارد نمایید
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
                    id="tell"
                    type="text"
                    placeholder="شماره موبایل"
                    {...formik.getFieldProps("tell")}
                    className={`pt-3 pb-2 block w-full px-6 mt-0 text-sm text-white border rounded-cs md:max-h-[46px] max-h-[42px] bg-transparent autofill:bg-transparent appearance-none focus:outline-none focus:ring-0 focus:bg-transparent  placeholder:text-white ${
                      formik.errors.password && formik.touched.password
                        ? "shadow-err border-red-300 hover:shadow-err"
                        : "hover:shadow-btn border-white hover:border-white focus:border-white"
                    }`}
                  />
                </div>
              </div>

              <div className="w-full flex gap-x-2">
                <div className="relative z-0 w-3/5 md:max-h-[46px] max-h-[42px] input-controll">
                  <input
                    id="otpCode"
                    type="text"
                    placeholder="کد را وارد کنید"
                    {...formik.getFieldProps("otpCode")}
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
                <div className=" w-2/5">
                  <PrimaryBtn
                    disabled={formik.errors.tell}
                    onClick={(e) => getCodeHandler(e)}
                    // status={formik.status}
                    // type={"submit"}
                    // disabled={!formik.isValid || formik.status === 1}
                  >
                    <div className={`${codeLoading && "animate-spin"}`}>
                      {!codeLoading ? (
                        <h1 className="text-sm">دریافت کد</h1>
                      ) : (
                        <CgSpinner className="w-6 h-6" />
                      )}
                    </div>
                  </PrimaryBtn>
                </div>
              </div>
            </div>

            <div className="h-12 mt-5">
              <PrimaryBtn
                text="ورود"
                status={formik.status}
                type={"submit"}
                disabled={!formik.isValid || formik.status === 1}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
