import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import dynamic from "next/dynamic";
import { IoLocationSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { newClinicService } from "../../../Services/clinicServices";
import Error from "next/error";
import toEnDigit from "../../../hooks/ToEnDigit";

const AddClinic = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const [map, setMap] = useState();
  const [location, setLocation] = useState([]);
  const router = useRouter();

  const validationSchema = yup.object({
    tell1: yup
      .number()
      .typeError("فرمت شماره تلفن صحیح نمی باشد")
      .required("شماره تلفن مطب را وارد کنید"),
    tell2: yup.string().typeError("فرمت شماره تلفن صحیح نمی باشد"),
    title: yup.string().required("نام مطب را وارد کنید"),
    location: yup.string().required("موقعیت مکانی را وارد کنید"),
    address: yup.string().required("آدرس مطب را وارد کنید"),
  });
  const initialValues = {
    tell1: "",
    title: "",
    tell2: "",
    location: "",
    address: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      newClinicService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("پرونده با موفقیت ثبت شد");
            router.push("/admin/clinic/");
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
    formik.setFieldValue("location", location);
  }, [location]);
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/clinic/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">مطب جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input name="title" type="text" label="نام مطب" formik={formik} />
          <Input
            name="tell1"
            type="text"
            label="شماره اول"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("tell1", toEnDigit(e.target.value));
            }}
          />
          <Input
            name="tell2"
            type="text"
            label="شماره دوم"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("tell2", toEnDigit(e.target.value));
            }}
          />
          <div className="col-span-2">
            <Input name="address" type="text" label="آدرس" formik={formik} />
          </div>
          <Input
            name="location"
            type="text"
            label="موقعیت مکانی"
            formik={formik}
          />
        </div>

        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت مطب"
              type="submit"
              status={formik.status}
              disabled={formik.status === 1}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default AddClinic;
