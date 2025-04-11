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
import SelectInput from "../../../common/SelectInput";
import { IoLocationSharp } from "react-icons/io5";
import dynamic from "next/dynamic";
import {
  editParaclinicService,
  getParaclinicService,
  getParaclinicTypeService,
} from "../../../Services/paraclinicServices";
import { editSystemicService } from "../../../Services/systemicServices";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";

const EditParaclinic = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const [types, setTypes] = useState([]);
  const validationSchema = yup.object({
    tell: yup.string().required("شماره تلفن پاراکلینیک را وارد کنید"),
    title: yup.string().required("نام پاراکلینیک را وارد کنید"),
    type_id: yup.string().required("نوع پاراکلینیک را وارد کنید"),
    location: yup.string().required("موقعیت مکانی پاراکلینیک را وارد کنید"),
    address: yup.string().required("آدرس پاراکلینیک را وارد کنید"),
  });
  useEffect(() => {
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
  }, [user, loading]);
  useEffect(() => {
    if (user && !loading && id) {
      getParaclinicService(id, {
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
  }, [id]);
  const initialValues = {
    title: data && data.title,
    tell: data && data.tell,
    type_id: data && data.type_id,
    address: data && data.address,
    location: data && data.location,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editParaclinicService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("پاراکلینیک با موفقیت ویرایش شد");
            router.push("/admin/paraclinic");
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
  let typeTitle =
    types &&
    data &&
    types.length &&
    types.filter((item) => item.id === data.type_id)[0];
  const defualtValue = {
    title: typeTitle ? typeTitle.title : null,
    id: 0,
  };
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/paraclinic/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش پاراکلینیک</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="title"
            type="text"
            label="نام پاراکلینیک"
            formik={formik}
          />
          {defualtValue.value !== null && (
            <SelectInput
              formik={formik}
              label={defualtValue.title}
              name="type_id"
              selectOption={types}
              labelOption="title"
              valueOption="id"
            />
          )}
          <Input
            name="tell"
            type="text"
            label="شماره"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("tell", toEnDigit(e.target.value));
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
              text="ویرایش پرونده"
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

export default EditParaclinic;
