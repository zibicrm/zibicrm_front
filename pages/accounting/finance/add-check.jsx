import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import SelectInput from "../../../common/SelectInput";
import { toast } from "react-toastify";
import { getAllClinicService } from "../../../Services/clinicServices";
import { newService } from "../../../Services/serviceRequest";
import Error from "next/error";
import toEnDigit from "../../../hooks/ToEnDigit";
import DatePickerComponent from "../../../common/DatePicker";
import CurrencyInputComponent from "../../../common/CurrencyInput";

const AddService = () => {
  const [clinic, setClinic] = useState(false);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const validationSchema = yup.object({
    description: yup.string().required("شرح خدمت را وارد کنید"),
    title: yup.string().required("عنوان خدمت را وارد کنید"),
    service_cost: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("هزینه خدمت را وارد کنید"),
    supplier_commission: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("کمیسیون کارشناس را وارد کنید"),
    material_cost: yup
      .number()
      .typeError("عدد وارد کنید")
      .required("هزینه مواد مصرفی را وارد کنید"),
    clinic_id: yup.string().required("کلینیک را انتخاب کنید"),
    national_id: yup.string().required("شماره ملی گیرنده را وارد کنید"),
  });
  const initialValues = {
    title: "",
    description: "",
    service_cost: "",
    material_cost: "",
    supplier_commission: "",
    clinic_id: "",
    national_id: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      newService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("خدمت با موفقیت ثبت شد");
            router.push("/accounting/service");
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
    if (user && !loading) {
      getAllClinicService({
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setClinic(data.result);
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
    if (!user && !loading) {
      router.push("/");
    }
    // if (user && user.user.rule !== 2) {
    //   router.push("/");
    // }
  }, [loading]);
  // if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.back()}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">چک جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="title"
            type="text"
            label="شماره سریال چک"
            formik={formik}
          />

          <CurrencyInputComponent
            formik={formik}
            label="مبلغ چک"
            name="discount"
          />
          <DatePickerComponent
            name="follow_up_date"
            formik={formik}
            label="تاریخ صدور چک"
            text="تاریخ صدور چک"
          />
          <DatePickerComponent
            name="follow_up_date"
            formik={formik}
            label="تاریخ صدور چک"
            text="تاریخ صدور چک"
          />
          <div className="col-span-2">
            <Input
              name="supplier_commission"
              type="text"
              label="شرح چک(بابت)"
              formik={formik}
              onChange={(e) => {
                formik.setFieldValue(
                  "supplier_commission",
                  toEnDigit(e.target.value)
                );
              }}
            />
          </div>
          <Input
            name="material_cost"
            type="text"
            label="تاریخ سر رسید چک"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("material_cost", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="material_cost"
            type="text"
            label="تاریخ سر رسید چک"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("material_cost", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="national_id"
            type="text"
            label="کد ملی گیرنده"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("national_id", toEnDigit(e.target.value));
            }}
          />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn text="ثبت خدمت" type="submit" status={formik.status} />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AddService;
