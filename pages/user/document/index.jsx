import React from "react";
import LayoutUser from "../../../Layout/LayoutUser";
import RadioInput from "../../../common/RadioBtn";
import Input from "../../../common/Input";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import DatePickerComponent from "../../../common/DatePicker";
import PrimaryBtn from "../../../common/PrimaryBtn";
import toEnDigit from "../../../hooks/ToEnDigit";
import {
  usePatientAuth,
  usePatientAuthActions,
} from "../../../Provider/PatientAuthProvider";
import moment from "jalali-moment";
import PageLoading from "../../../utils/LoadingPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { editPatientDocument } from "../../../Services/patientDocumentService";
import { toast } from "react-toastify";


const UserDocumentPage = () => {
  const [success, setSuccess] = useState(false);
  const { user, loading } = usePatientAuth();
  const patientDispatcher = usePatientAuthActions();
  const router = useRouter();

  const genderOption = [
    { id: "1", label: "آقا", value: "1" },
    { id: "2", label: "خانم", value: "2" },
  ];

  const maritalOption = [
    { id: "1", label: "مجرد", value: "1" },
    { id: "2", label: "متاهل", value: "2" },
  ];

  // ** FORMIK **
  const validationSchema = yup.object({
    tell: yup
      .string()
      .typeError("فرمت شماره تلفن صحیح نمی باشد")
      .required("شماره تلفن مراجعه کننده را وارد کنید"),
    name: yup.string().required("نام مراجعه کننده را وارد کنید"),
    gender: yup.string().required("جنسیت را وارد کنید"),
    // homeTell: yup.number().typeError("فرمت شماره تلفن صحیح نمی باشد"),
    homeTell: yup.string().matches(/[0-9]{11}$/,"فرمت شماره تلفن صحیح نمی باشد"),
    // nationalId: yup.number().min(10).typeError("فرمت کد ملی صحیح نمی باشد"),
    nationalId: yup.string().matches(/[0-9]{10}$/,"فرمت کد ملی صحیح نمی باشد"),
  });
  const initialValues = {
    tell: user ? user.user.tell : "",
    name: user && user.user.name,
    homeTell: user && user.user.homeTell ? user.user.homeTell : "",
    job: user && user.user.job,
    nationalId: user && user.user.nationalId ? user.user.nationalId : "",
    degree: user && user.user.degree,
    birthDay:
      (user && user.user.birthDay === "0000-00-00 00:00:00") ||
      (user && !user.user.birthDay)
        ? null
        : user && user.user.birthDay,
    reasonReferral: user && user.user.reasonReferral,
    // reagent: user && user.user.reagent,
    marital: user && user.user.marital, // 1=>single    2=>married
    // otherSickness: user && user.user.otherSickness,
    // useMedicine: user && user.user.useMedicine,
    // allergyMedicine: user && user.user.allergyMedicine,
    // hospitalization: user && user.user.hospitalization,
    // did: user && user.user.id,
    document_id: user ? user.user.document_id : "",
    // referred_name: user && user.user.referred_name,
    address: user && user.user.address,
    // money_status: user && user.user.money_status,
    // sickness: "",
    // allergyM: user && user.user.allergyMedicine ? "0" : "1",
    // sicknesss: user && user.user.otherSickness ? "0" : "1",
    // medicine: user && user.user.useMedicine ? "0" : "1",
    // hospitali: user && user.user.hospitalization ? "0" : "1",
    gender: user && String(user.user.gender),
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      // delete values["allergyM"];
      // delete values["sicknesss"];
      // delete values["medicine"];
      // delete values["hospitali"];
      // values["sickness"] = diseasesFilter;
      editPatientDocument(
        {
          name: values.name,
          gender: values.gender,
          homeTell: values.homeTell,
          job: values.job,
          nationalId: values.nationalId,
          degree: values.degree,
          birthDay: values.birthDay,
          address: values.address,
        },
        {
          token: user?.token,
        }
      )
        .then(({ data }) => {
          // new device
          if (data.status === false && data.statusCode === 403) {
            patientDispatcher({
              type: "LOGOUTNOTTOKEN",
            });
          }
          if (data.status === false && data.statusCode !== 403) {
            toast.error(data.message[0],{
              position: "top-right",
            });
          } else {
            toast.success("پرونده با موفقیت ثبت شد",{
              position: "top-right",
            });
            setSuccess(true);
            localStorage.setItem(
              "patient_login_token",
              JSON.stringify({ token: data.result.token, user: data.result })
            );
            patientDispatcher({ type: "LOAD_USER" });
            router.push("/user/document");
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
            toast.error(err.response.data.message,{
              position: "top-right",
            });
          }
          formik.setStatus(0);
        });
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

  if (loading || !user) {
    return <PageLoading />;
  }

  return (
    <LayoutUser>
      <h1 className="hidden md:mt-8 text-gray-900 font-bold md:block">
        پرونده
      </h1>
      <div className="flex flex-col gap-y-8 mt-8 md:bg-white md:p-8 rounded-lg md:shadow-card">
        <h1 className="text-gray-900">پرونده پزشکی</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            <div className="col-span-2  flex flex-row items-center gap-3 md:col-span-1 ">
              <span className="text-sm text-gray-900">جنسیت:</span>
              <RadioInput
                formik={formik}
                radioOptions={genderOption}
                name="gender"
                disabled
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name="document_id"
                type="text"
                label="شماره پرونده پزشکی"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue(
                    "document_id",
                    toEnDigit(e.target.value)
                  );
                }}
                disable
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name="name"
                type="text"
                label="نام و نام خانوادگی"
                formik={formik}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name="tell"
                type="text"
                label=" تلفن همراه"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("tell", toEnDigit(e.target.value));
                }}
                disable
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <DatePickerComponent
                name="birthDay"
                formik={formik}
                // label={
                //   (user && user.user.birthDay === "0000-00-00 00:00:00") ||
                //   (user && !user.birthDay)
                //     ? null
                //     : user &&
                //       moment(user.user.birthDay).locale("fa").format("YYYY/MM/DD")
                // }
                label={
                  user && user.user.birthDay
                    ? moment(user.user.birthDay)
                        .locale("fa")
                        .format("YYYY/MM/DD")
                    : ""
                }
                text="تاریخ تولد"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input name="job" type="text" label="شغل" formik={formik} />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input name="address" type="text" label="آدرس" formik={formik} />
            </div>
            {/* <div className="col-span-2 md:col-span-1">
              <Input
                name="reasonReferral"
                type="text"
                label="علت مراجعه"
                formik={formik}
              />
            </div> */}
            <div className="col-span-2 md:col-span-1">
              <Input
                name="homeTell"
                type="text"
                label=" تلفن ثابت"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("homeTell", toEnDigit(e.target.value));
                }}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name="nationalId"
                type="text"
                label="کد ملی"
                formik={formik}
                onChange={(e) => {
                  formik.setFieldValue("nationalId", toEnDigit(e.target.value));
                }}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name="degree"
                type="text"
                label="تحصیلات"
                formik={formik}
              />
            </div>
            {/* <div className="col-span-2 flex flex-row items-center gap-3 md:col-span-1 ">
              <span className="text-sm text-gray-900">وضعیت تاهل</span>
              <RadioInput
                formik={formik}
                radioOptions={maritalOption}
                name="marital"
              />
            </div> */}
          </div>
          <div className="w-full flex justify-end mt-8 md:mt-28">
            <div className="w-full md:w-1/2 h-12 self-end ">
              <PrimaryBtn
                text="ثبت تغییرات"
                type="submit"
                status={formik.status}
                //   disabled={formik.status === 1 || !formik.isValid || success}
              />
            </div>
          </div>
        </form>
      </div>
    </LayoutUser>
  );
};

export default UserDocumentPage;
