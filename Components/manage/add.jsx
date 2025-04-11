import { MdArrowForward } from "react-icons/md";
import Layout from "../../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../common/Input";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SelectInput from "../../../../common/SelectInput";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import dynamic from "next/dynamic";
import { IoLocationSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  getParaclinicTypeService,
  newParaclinicService,
} from "../../../../Services/paraclinicServices";
import Error from "next/error";

const AddParaClinic = () => {
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const [types, setTypes] = useState();
  const router = useRouter();
  const validationSchema = yup.object({
    type: yup.string().required("شماره تلفن مراجعه کننده را وارد کنید"),
    description: yup.string().required("نام مراجعه کننده را وارد کنید"),
  });
  const initialValues = {
    description: "",
    type: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      //   newParaclinicService(values, {
      //     Authorization: "Bearer " + user.token,
      //   })
      //     .then(({ data }) => {
      //       if (data.status === false) {
      //         toast.error(data.message[0]);
      //       } else {
      //         toast.success("پرونده با موفقیت ثبت شد");
      //         formik.setStatus(0);
      //       }
      //     })
      //     .catch((err) => {
      //       if (err.response && err.response.status === 401) {
      //         userDispatch({
      //           type: "LOGOUTNOTTOKEN",
      //         });
      //       }
      //       if (err.response) {
      //         toast.error(err.response.data.message);
      //       }
      //       formik.setStatus(0);
      //     });
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
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
  if (user && user.user.rule !== 2) return <Error statusCode={404} />;
  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-50  px-6 py-3 flex flex-row items-center justify-start gap-3 border-b border-primary-900">
          <button
            onClick={() => router.push("/admin/paraclinic/manage")}
            className="text-2xl text-gray-900"
            type="button"
          >
            <MdArrowForward />
          </button>
          <h1 className="text-xl text-gray-900">نوع پاراکلینیک جدید</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
          <Input
            name="title"
            type="text"
            label="نوع پاراکلینیک"
            formik={formik}
          />
          <div className="col-span-2">
            <Input name="tell" type="text" label="شرح" formik={formik} />
          </div>
        </div>

        <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
          <div className={"col-span-2"}></div>

          <div className="h-12 ">
            <PrimaryBtn
              text="ثبت پرونده"
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

export default AddParaClinic;
