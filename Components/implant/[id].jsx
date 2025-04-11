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
  editImplantTypeService,
  getImplantTypeService,
} from "../../../Services/ImplantTypeServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";
const EditImplant = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const validationSchema = yup.object({
    title: yup.string().required("برند را وارد کنید"),
    country: yup.string().required("کشور سازنده را وارد کنید"),
    warranty: yup.string().required("مدت زمان ضمانت را وارد کنید"),
  });
  const initialValues = {
    title: data && data.title,
    country: data && data.country,
    warranty: data && data.warranty,
  };

  useEffect(() => {
    if (user && !loading && id) {
      getImplantTypeService(id, {
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
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editImplantTypeService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("برند ایمپلنت با موفقیت ویرایش شد");
            router.push("/admin/implant");
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
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/implant/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش برند ایمپلنت</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input name="title" type="text" label="برند جدید" formik={formik} />
          <Input
            name="country"
            type="text"
            label="کشور سازنده"
            formik={formik}
          />
          <Input
            name="warranty"
            type="text"
            label="مدت زمان ضمانت"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("warranty", toEnDigit(e.target.value));
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
              disabled={formik.status === 1}
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default EditImplant;
