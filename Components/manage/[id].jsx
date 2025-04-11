import { MdArrowForward } from "react-icons/md";
import Layout from "../../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../../common/Input";
import PrimaryBtn from "../../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useAuthActions } from "../../../../Provider/AuthProvider";
import Error from "next/error";
import PageLoading from "../../../../utils/LoadingPage";

const EditParaclinic = (props) => {
  const { loading, user } = useAuth();
  const [data, setData] = useState();
  const userDispatch = useAuthActions();
  const router = useRouter();
  const id = router.query.id;
  const validationSchema = yup.object({
    type: yup.string().required("شماره تلفن مراجعه کننده را وارد کنید"),
    description: yup.string().required("نام مراجعه کننده را وارد کنید"),
  });
  useEffect(() => {
    if (user && !loading && id) {
      //   getParaclinicService(id, {
      //     Authorization: "Bearer " + user.token,
      //   })
      //     .then(({ data }) => {
      //       if (data.status === false) {
      //         toast.error(data.message[0]);
      //       } else {
      //         setData(data.result[0]);
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
      //     });
    }
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading, id]);

  const initialValues = {
    description: data && data.title,
    type: data && data.tell,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      //   editSystemicService(router.query.id, values, {
      //     Authorization: "Bearer " + user.token,
      //   })
      //     .then(({ data }) => {
      //       if (data.status === false) {
      //         toast.error(data.message[0]);
      //       } else {
      //         toast.success("بیماری با موفقیت ویرایش شد");
      //         router.push("/admin/diseases");
      //       }
      //       formik.setStatus(0);
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

  if ((user && user.user.rule !== 2) || !data)
    return <Error statusCode={404} />;
  if (!data) return <PageLoading />;

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

export default EditParaclinic;
