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
  editClinicService,
  getClinicService,
} from "../../../Services/clinicServices";
import { getParaclinicTypeService } from "../../../Services/paraclinicServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";

const EditClinic = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const [types, setTypes] = useState([]);

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
  useEffect(() => {
    if (user && !loading && id) {
      getClinicService(id, {
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
    if (user && !loading) {
      getParaclinicTypeService({
        Authorization: "Bearer " + user.token,
      }).then(({ data }) => setTypes(data.result));
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);

  const initialValues = {
    title: data && data.title,
    tell1: data && data.tell1,
    tell2: data && data.tell2 ? data.tell2 : "",
    address: data && data.address,
    location: data && data.location,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editClinicService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success(" کلینیک با موفقیت ویرایش شد");
            router.push("/admin/clinic");
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
            onClick={() => router.push("/admin/clinic/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش مطب</h1>
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

export default EditClinic;
