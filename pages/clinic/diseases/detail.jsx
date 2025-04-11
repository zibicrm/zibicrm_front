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
import {
  editSystemicService,
  getSystemicService,
} from "../../../Services/systemicServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
const EditDiseas = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const validationSchema = yup.object({
    detail: yup.string().required("ملاحظات بیماری را وارد کنید"),
    title: yup.string().required("عنوان بیماری را وارد کنید"),
    description: yup.string().required("شرح بیماری را وارد کنید"),
  });
  useEffect(() => {
    if (user && !loading && id) {
      getSystemicService(id, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            setData(data.result[0]);
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
    if (user && user.user.rule !== 3) {
      router.push("/");
    }
  }, [user, loading, id]);
  const initialValues = {
    title: data && data.title,
    description: data && data.description,
    detail: data && data.detail,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editSystemicService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("بیماری با موفقیت ویرایش شد");
            router.push("/clinic/diseases");
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
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/clinic/diseases/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش بیماری سیستماتیک</h1>
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
              text="ثبت تغییرات"
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

export default EditDiseas;
