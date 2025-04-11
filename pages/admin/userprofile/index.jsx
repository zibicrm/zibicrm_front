import React, { useEffect } from "react";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import Error from "next/error";
import { MdPerson, MdEdit, MdDelete } from "react-icons/md";
import { useAuth } from "../../../Provider/AuthProvider";
import { newUserService } from "../../../Services/userServies";
import { useRouter } from "next/router";


const Index = ({}) => {
  const validationSchema = yup.object({
    repeatPassword: yup.string().required("رمز عبور کاربر را وارد کنید"),
  });
  const initialValues = {
    password: "",
    repeatPassword: "",
  };
  const { loading, user } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  if (
    (user && user.user.rule !== 2) ||
    (user && user.user && user.user.id !== 1)
  )
    return <Error statusCode={404} />;
  return (
    <Layout>
      <div className="w-full h-16 flex justify-start bg-gray-50 relative border">
        <p className="absolute top-4 right-4 text-sm">نمایش پروفایل</p>
      </div>

      <form>
        <div class="flex  justify-start  gap-3 ">
          <label
            for="fileUpload"
            className="flex flex-col items-center justify-center w-24 h-24 rounded border-gray-300 border-none rounded-lg cursor-pointer bg-gray-100 mr-9 mt-4 relative "
          >
            <div>
              <MdPerson className="text-5xl text-white" />
            </div>

            <div className="absolute flex flex-col gap-2 top-3 -right-4">
              <button className="rounded-full bg-transparent bg-primary-100 w-9 h-9  border-2 border-white">
                <MdEdit className=" text-primary-600 text-2xl" />
                <input
                  type="file"
                  id="fileUpload"
                  className="w-48 h-48 hidden"
                />
              </button>
              <button className="rounded-full bg-transparent bg-red-100 w-9 h-9 border-2 border-white relative">
                <MdDelete className="text-red-500 text-2xl absolute top-1 left-1" />
              </button>
            </div>
            {/* class="hidden" */}
          </label>
          <div className="flex flex-col text-sm font-normal gap-4  ">
            <p className="mt-3">مریم اکبری</p>
            <p>۰۹۳۷۳۹۵۶۰۴۳</p>
          </div>
        </div>

        <div className=" w-10/12 flex justify-between gap-8 absolute  p-4 mr-3 ml-1   overflow-x-hidden">
          <Input
            type="password"
            name="password"
            label=" رمز جدید"
            show={true}
            formik={formik}
          />
          <Input
            type="password"
            name="repeatPassword"
            label="  تکرار رمز جدید "
            show={true}
            formik={formik}
          />
          <button className="w-full bg-primary-800 rounded-sm text-white text-xs">
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Index;
