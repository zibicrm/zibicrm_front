import { MdArrowForward } from "react-icons/md";
import Layout from "../../../Layout/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import Input from "../../../common/Input";
import PrimaryBtn from "../../../common/PrimaryBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";

import Modal from "../../../Components/Modal";
import AddEvent from "../../../Components/AddEvent";
import {
  editPatientStatusService,
  getPatientStatusService,
} from "../../../Services/patientStatusServices";
import Error from "next/error";
import { useAuth, useAuthActions } from "../../../Provider/AuthProvider";
import PageLoading from "../../../utils/LoadingPage";
const EditPatientStatus = () => {
  const [data, setData] = useState(null);
  const { loading, user } = useAuth();
  const userDispatch = useAuthActions();
  const [add, setAdd] = useState(false);
  const router = useRouter();
  const id = router.query.id;
  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
    if (user && user.user.rule !== 2) {
      router.push("/");
    }
  }, [user, loading]);
  useEffect(() => {
    if (user && !loading && id) {
      getPatientStatusService(id, {
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
  const validationSchema = yup.object({
    title: yup.string().required("عنوان وضعیت را وارد کنید"),
    description: yup.string(),
  });
  const initialValues = {
    title: data && data.title,
    description: data && data.description ? data.description : "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      formik.setStatus(1);
      editPatientStatusService(id, values, {
        Authorization: "Bearer " + user.token,
      })
        .then(({ data }) => {
          if (data.status === false) {
            toast.error(data.message[0]);
          } else {
            toast.success("وضعیت با موفقیت ویرایش شد");
            router.push("/admin/patient-status");
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
      <div>
        <div className="bg-gray-50 px-6 py-3 flex flex-row items-center justify-between gap-3 border-b border-primary-900">
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => router.push("/admin/patient-status/")}
              className="text-2xl text-gray-900"
              type="button"
            >
              <MdArrowForward />
            </button>
            <h1 className="text-xl text-gray-900">ویرایش وضعیت بیمار</h1>
          </div>
        </div>
        <div className="w-full flex flex-row items-start ">
          <form className="w-full" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-3 gap-x-4 gap-y-8 p-6">
              <Input name="title" type="text" label="عنوان" formik={formik} />
              <div className="col-span-2">
                <Input
                  name="description"
                  type="text"
                  label="شرح"
                  formik={formik}
                />
              </div>
            </div>
            <div className="w-full  gap-x-4 gap-y-8 grid grid-cols-3 p-6">
              <div className={"col-span-2"}></div>

              <div className="h-12 ">
                <PrimaryBtn
                  text="ثبت تغیرات"
                  type="submit"
                  status={formik.status}
                  disabled={formik.status === 1 || !formik.isValid}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      {add ? (
        <Modal setModal={() => {}}>
          <AddEvent setOpen={setAdd} />
        </Modal>
      ) : null}
    </Layout>
  );
};

export default EditPatientStatus;
