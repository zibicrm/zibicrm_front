import { MdArrowForward, MdOutlineEdit } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SelectInput from "../../../common/SelectInput";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import RadioInput from "../../../common/RadioBtn";
import { toast } from "react-toastify";
import {
  getUserRuleService,
  newUserService,
} from "../../../Services/userServies";
import Error from "next/error";
import toEnDigit from "../../../hooks/ToEnDigit";
import { SketchPicker } from "react-color";
import Modal from "../../../Components/Modal";

const AddUser = () => {
  const [rule, setRule] = useState([]);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const [bgColor, setBgColor] = useState("#000");
  const [displayColorPicker, setdisplayColorPicker] = useState(false);
  const handleChangeComplete = (color) => {
    setBgColor(color.hex);
    setdisplayColorPicker(false);
    formik.setFieldValue("color", color.hex);
  };

  useEffect(() => {
    if (user && !loading) {
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
  }, [user, loading]);

  const validationSchema = yup.object({
    tell: yup.string().required("شماره تلفن کاربر را وارد کنید"),
    first_name: yup.string().required("نام کاربر را وارد کنید"),
    last_name: yup.string().required("نام خانوادگی کاربر را وارد کنید"),
    rule: yup.string().required("نقش کاربر را وارد کنید"),
    password: yup.string().required("رمز عبور کاربر را وارد کنید"),
    gender: yup.string().required("جنسیت کاربر را وارد کنید"),
    color: yup.string().required("رنگ کاربر را وارد کنید"),
  });
  const initialValues = {
    tell: "",
    first_name: "",
    last_name: "",
    password: "",
    rule: "",
    gender: "",
    color: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      newUserService(values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("کاربر با موفقیت ثبت شد");
            router.push("/admin/users/");
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
  if (
    (user && user.user.rule !== 2) ||
    (user && user.user && user.user.id !== 1)
  )
    return <Error statusCode={404} />;
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
          <h1 className="text-xl text-gray-900">کاربر جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <SelectInput
            formik={formik}
            label="نقش کاربر"
            name="rule"
            selectOption={rule}
            defaultV={rule[0]}
            labelOption="name"
            valueOption="id"
          />
          <Input name="first_name" type="text" label="نام " formik={formik} />
          <Input
            name="last_name"
            type="text"
            label="نام خانوادگی "
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
          <Input
            name="password"
            type="password"
            label="رمز عبور"
            show={true}
            formik={formik}
            onChange={(e) => {
              formik.setFieldValue("password", toEnDigit(e.target.value));
            }}
          />

          <div className="flex flex-row items-center gap-4">
            <span>جنسیت</span>
            <RadioInput
              formik={formik}
              radioOptions={radioOptions}
              name="gender"
            />
          </div>

          <button
            name="color"
            formik={formik}
            className="p-3 border border-primary-600  rounded relative h-[64]  "
            onChange={(e) => {
              formik.setFieldValue("color", bgColor);
            }}
            type="button"
          >
            <div
              className="flex justify-between "
              onClick={() => {
                setdisplayColorPicker(true);
              }}
            >
              <p className="text-gray-500 ">رنگ</p>
              <div className="flex justify-between gap-2">
                <div
                  className={`rounded-full  w-7`}
                  style={{ backgroundColor: bgColor }}
                ></div>
                <MdOutlineEdit size="1.5rem" className="text-gray-500" />
              </div>
            </div>
          </button>
          {displayColorPicker ? (
            <Modal>
              <SketchPicker
                color={bgColor}
                onChangeComplete={handleChangeComplete}
              />
            </Modal>
          ) : null}
        </div>

        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت کاربر"
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

export default AddUser;
