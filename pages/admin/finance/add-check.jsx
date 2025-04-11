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
import { internalCheckStoreService } from "../../../Services/financeServices";

const AddService = () => {
  const [clinic, setClinic] = useState(false);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const validationSchema = yup.object({
    description: yup.string().required("شرح چک را وارد کنید"),
    serial: yup.string().required("سریال چک را وارد کنید"),
    price: yup.string().required("مبلغ چک را وارد کنید"),
    issuing_date: yup.string().required("تاریخ صدور چک را وارد کنید"),
    date: yup.string().required("تاریخ سر رسید چک را وارد کنید"),
    name_receiver: yup.string().required("نام گیرنده را وارد کنید"),
    tell_receiver: yup.string().required("شماره تلفن گیرنده را وارد کنید"),
    national_id: yup.string().required("شماره ملی گیرنده را وارد کنید"),
  });
  const initialValues = {
    serial: "",
    description: "",
    price: "",
    issuing_date: "",
    date: "",
    name_receiver: "",
    national_id: "",
    tell_receiver: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      internalCheckStoreService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("چک با موفقیت ثبت شد");
            router.push("/admin/finance/internal-checks/");
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
            onClick={() => router.push("/admin/finance/internal-checks/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">چک جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="serial"
            type="text"
            label="شماره سریال چک"
            formik={formik}
          />

          <CurrencyInputComponent
            formik={formik}
            label="مبلغ چک"
            name="price"
          />
          <DatePickerComponent
            name="issuing_date"
            formik={formik}
            label="تاریخ صدور چک"
            text="تاریخ صدور چک"
          />
          <DatePickerComponent
            name="date"
            formik={formik}
            label="تاریخ سر رسید چک"
            text="تاریخ سر رسید چک"
          />
          <div className="col-span-2">
            <Input
              name="description"
              type="text"
              label="شرح چک(بابت)"
              formik={formik}
            />
          </div>
          <Input
            name="name_receiver"
            type="text"
            label="نام گیرنده"
            formik={formik}
          />
          <Input
            name="tell_receiver"
            type="text"
            label="شماره تلفن گیرنده"
            formik={formik}
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
            <PrimaryBtn
              text="ثبت چک"
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

export default AddService;
