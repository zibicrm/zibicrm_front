import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import { newSystemicService } from "../../../Services/systemicServices";
import Error from "next/error";
const AddDiseases = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const validationSchema = yup.object({
    detail: yup.string().required("ملاحظات بیماری را وارد کنید"),
    title: yup.string().required("عنوان بیماری را وارد کنید"),
    description: yup.string().required("شرح بیماری را وارد کنید"),
  });
  const initialValues = {
    title: "",
    description: "",
    detail: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      newSystemicService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("بیماری با موفقیت ثبت شد");
            router.push("/admin/diseases");
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
            onClick={() => router.push("/admin/diseases/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">بیماری سیستماتیک جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="title"
            type="text"
            label="عنوان بیماری"
            formik={formik}
          />
          <Input name="detail" type="text" label="ملاحظات" formik={formik} />
          <Input name="description" type="text" label="شرح" formik={formik} />
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت بیماری سیستماتیک"
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

export default AddDiseases;
