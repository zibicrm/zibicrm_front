import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import PrimaryBtn from "../../../common/PrimaryBtn";
import RadioInput from "../../../common/RadioBtn";
import SelectInput from "../../../common/SelectInput";
import {
  editUserService,
  getUserRuleService,
  getUserService,
} from "../../../Services/userServies";
import Error from "next/error";
import PageLoading from "../../../utils/LoadingPage";
import toEnDigit from "../../../hooks/ToEnDigit";
const EditUser = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const [rule, setRule] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const validationSchema = yup.object({
    tell: yup.string().required("شماره تلفن کاربر را وارد کنید"),
    first_name: yup.string().required("نام کاربر را وارد کنید"),
    last_name: yup.string().required("نام خانوادگی را وارد کنید"),
    rule: yup.string().required("نقش کاربر را وارد کنید"),
    gender: yup.string().required("جنسیت کاربر را وارد کنید"),
  });
  useEffect(() => {
    if (user && !loading && id) {
      getUserService(id, {
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
      getUserRuleService({
        Authorization: "Bearer " + user.token,
      }).then(({ data }) => setRule(data.result));
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);
  const initialValues = {
    first_name: data && data.first_name,
    last_name: data && data.last_name,
    rule: data && data.rule,
    tell: data && data.tell,
    gender: data && String(data.gender),
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editUserService(router.query.id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("کاربر با موفقیت ویرایش شد");
            router.push("/admin/users");
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
  const radioOptions = [
    { id: "1", label: "مرد", value: "1" },
    { id: "2", label: "زن", value: "2" },
  ];
  let defaultValue = {
    name: data ? data.rules.name : null,
    id: -1,
  };
  if (
    (user && user.user.rule !== 2) ||
    (user && user.user && user.user.id !== 1)
  )
    return <Error statusCode={404} />;
  if (!data) return <PageLoading />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/users/")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900"> ویرایش کاربر</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          {defaultValue.name !== null && rule && rule[0] && (
            <SelectInput
              formik={formik}
              label={defaultValue.name}
              name="rule"
              selectOption={rule}
              defaultV={rule[0]}
              labelOption="name"
              valueOption="id"
            />
          )}
          <Input name="first_name" type="text" label="نام " formik={formik} />
          <Input
            name="last_name"
            type="text"
            label="نام خانوادگی"
            formik={formik}
          />
          <Input
            name="tell"
            type="text"
            label="شماره تلفن"
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("tell", toEnDigit(e.target.value));
            }}
          />

          <div className="flex flex-row items-center gap-4">
            <span>جنسیت</span>
            <RadioInput
              radioOptions={radioOptions}
              name="gender"
              formik={formik}
            />
          </div>
        </div>
        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>
          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت تغییرات"
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

export default EditUser;
